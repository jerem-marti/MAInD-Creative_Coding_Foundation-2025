import Rectangle from "./Rectangle";
import audio from "../utils/audio";

/**
 * A bouncing rectangle with elastic collision physics.
 * Extends Rectangle to add bounce behavior on collisions with canvas edges and other rectangles.
 * 
 * @class RectangleBouncy
 * @extends Rectangle
 */
export default class RectangleBouncy extends Rectangle {
    /**
     * Creates a new RectangleBouncy instance.
     * 
     * @constructor
     * @param {Object} options - Configuration options for the bouncy rectangle
     * @param {number} [options.x=0] - The x-coordinate of the center
     * @param {number} [options.y=0] - The y-coordinate of the center
     * @param {number} [options.width=100] - The width of the rectangle in pixels
     * @param {number} [options.height=100] - The height of the rectangle in pixels
     * @param {Object} [options.speed] - Initial speed configuration
     * @param {number} [options.speed.velocity=0] - Initial velocity magnitude
     * @param {number} [options.speed.angle=0] - Initial direction in radians
     * @param {number|null} [options.speed.max=null] - Maximum velocity (null for no limit)
     * @param {Object} [options.acceleration] - Acceleration vector
     * @param {number} [options.acceleration.x=0] - Acceleration in x-direction
     * @param {number} [options.acceleration.y=0] - Acceleration in y-direction
     * @param {string} [options.color='white'] - The fill color of the rectangle
     */
    constructor({
        x = 0,
        y = 0,
        width = 100,
        height = 100,
        speed = {
            velocity : 0,
            angle : 0,
            max : null
        },
        acceleration = {
            x : 0,
            y : 0
        },
        color = 'white'
    } = {}) {
        super({x, y, width, height, speed, acceleration, color});
    }

    /**
     * Handles collision with canvas boundaries with bounce physics.
     * When the rectangle hits an edge, it bounces back with velocity reversal.
     * Returns which side was touched for scoring purposes.
     * 
     * @method canvasCollision
     * @param {number} canvasWidth - The width of the canvas in pixels
     * @param {number} canvasHeight - The height of the canvas in pixels
     * @param {number} [bounce=1] - Bounciness factor (1 = perfectly elastic, <1 = energy loss)
     * @returns {string|null} The side that was touched ('left', 'right', 'top', 'bottom') or null if no collision
     */
    canvasCollision(canvasWidth, canvasHeight, bounce = 1) {
        let sideTouched = null;
        
        const overlapLeft = this.x - this.width / 2;
        const overlapRight = this.x + this.width / 2 - canvasWidth;
        if (overlapLeft < 0 || overlapRight > 0) {
            const overlapX = overlapLeft < 0 ? overlapLeft : overlapRight;
            this.x -= overlapX;
            this.stop();
            sideTouched = overlapLeft < 0 ? 'left' : 'right';
        }
        const overlapTop = this.y - this.height / 2;
        const overlapBottom = this.y + this.height / 2 - canvasHeight;
        if (overlapTop < 0 || overlapBottom > 0) {
            const overlapY = overlapTop < 0 ? overlapTop : overlapBottom;
            const newLastYDelta = bounce * (this.y - this.lastY - this.acceleration.y);
            this.y -= overlapY;
            this.lastY = this.y + newLastYDelta;
            sideTouched = overlapTop < 0 ? 'top' : 'bottom';
        }
        
        return sideTouched;
    }

    /**
     * Handles collision with another rectangle with bounce physics and momentum transfer.
     * Detects collision, bounces the ball, and transfers momentum from the other rectangle.
     * Plays a sound effect when collision occurs.
     * 
     * @method rectangleCollision
     * @param {Rectangle} Rectangle - The rectangle to check collision with
     * @param {number} [bounce=1] - Bounciness factor (1 = perfectly elastic, >1 = energy gain)
     */
    rectangleCollision(Rectangle, bounce = 1) {
        const distanceX = this.distanceXto(Rectangle);
        const distanceY = this.distanceYto(Rectangle);
        const overlapX = (this.width / 2 + Rectangle.width / 2) - Math.abs(distanceX);
        const overlapY = (this.height / 2 + Rectangle.height / 2) - Math.abs(distanceY);
        if (overlapX > 0 && overlapY > 0) {
            audio.playPaddleHitSound();
            if (overlapX < overlapY) {
                const newLastXDelta = bounce * (this.x - this.lastX - this.acceleration.x);
                this.x += Math.sign(distanceX) * overlapX;
                this.lastX = this.x + newLastXDelta;
                const otherSpeed = Rectangle.getSpeed();
                const collisionGainedSpeedX = (Rectangle.mass / (this.mass + Rectangle.mass)) * (otherSpeed.x);
                const collisionGainedSpeedY = (Rectangle.mass / (this.mass + Rectangle.mass)) * (otherSpeed.y);
                this.applySpeed(collisionGainedSpeedX, collisionGainedSpeedY);
            } else {
                const newLastYDelta = bounce * (this.y - this.lastY - this.acceleration.y);
                this.y += Math.sign(distanceY) * overlapY;
                this.lastY = this.y + newLastYDelta;
            }
        }
    }
}