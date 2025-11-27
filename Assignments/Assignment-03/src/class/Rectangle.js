import CanvasElement from './CanvasElement.js';

/**
 * A rectangular shape that can be drawn on canvas with physics properties.
 * Uses Verlet integration for physics simulation with velocity, acceleration, and collision detection.
 * Extends CanvasElement to inherit position management capabilities.
 * 
 * @class Rectangle
 * @extends CanvasElement
 */
export default class Rectangle extends CanvasElement {
    
    /**
     * Creates a new Rectangle instance.
     * 
     * @constructor
     * @param {Object} options - Configuration options for the rectangle
     * @param {number} [options.x=0] - The x-coordinate relative to the reference point
     * @param {number} [options.y=0] - The y-coordinate relative to the reference point
     * @param {number} [options.width=100] - The width of the rectangle in pixels
     * @param {number} [options.height=100] - The height of the rectangle in pixels
     * @param {number} [options.mass=1] - The mass of the rectangle (used for physics calculations)
     * @param {Object} [options.speed] - Initial speed configuration
     * @param {number} [options.speed.velocity=0] - Initial velocity magnitude
     * @param {number} [options.speed.angle=0] - Initial direction in radians
     * @param {number|null} [options.speed.max=null] - Maximum velocity (null for no limit)
     * @param {Object} [options.acceleration] - Acceleration vector
     * @param {number} [options.acceleration.x=0] - Acceleration in x-direction
     * @param {number} [options.acceleration.y=0] - Acceleration in y-direction
     * @param {string} [options.color='white'] - The fill color of the rectangle
     * @param {Object} [options.posParam] - Position parameters object
     * @param {string} [options.posParam.relativeTo='top-left'] - Reference point on canvas
     * @param {Object} options.posParam.canvasSize - Canvas dimensions
     * @param {number} [options.posParam.canvasSize.width=0] - Canvas width in pixels
     * @param {number} [options.posParam.canvasSize.height=0] - Canvas height in pixels
     */
    constructor({
        x = 0,
        y = 0,
        width = 100,
        height = 100,
        mass = 1,
        speed = {
            velocity : 0,
            angle : 0,
            max : null
        },
        acceleration = {
            x : 0,
            y : 0
        },
        color = 'white',
        posParam = {
            relativeTo: 'top-left',
            canvasSize: {
                width: 0,
                height: 0
            }
        }
    } = {}) {
        super({x, y, posParam});
        this.lastX = this.x - Math.cos(speed.angle) * speed.velocity;
        this.lastY = this.y - Math.sin(speed.angle) * speed.velocity;
        this.width = width;
        this.height = height;
        this.mass = mass;
        this.speed = speed;
        this.acceleration = acceleration;
        this.color = color;
        this.positionRelativeTo = posParam.relativeTo;
    }

    /**
     * Calculates the horizontal distance from this rectangle's center to a point.
     * 
     * @method distanceXto
     * @param {Object} point - Point object with x coordinate
     * @param {number} point.x - The x-coordinate of the point
     * @returns {number} The horizontal distance (positive if point is to the left)
     */
    distanceXto({x}) {
        return this.x - x;
    }

    /**
     * Calculates the vertical distance from this rectangle's center to a point.
     * 
     * @method distanceYto
     * @param {Object} point - Point object with y coordinate
     * @param {number} point.y - The y-coordinate of the point
     * @returns {number} The vertical distance (positive if point is above)
     */
    distanceYto({y}) {
        return this.y - y;
    }

    /**
     * Checks if a point is inside this rectangle.
     * 
     * @method isInside
     * @param {Object} point - Point object with coordinates
     * @param {number} point.x - The x-coordinate of the point
     * @param {number} point.y - The y-coordinate of the point
     * @returns {boolean} True if the point is inside the rectangle, false otherwise
     */
    isInside({x, y}) {
        const distanceX = Math.abs(this.distanceXto({x}));
        const distanceY = Math.abs(this.distanceYto({y}));
        return distanceX <= this.width / 2 && distanceY <= this.height / 2;
    }

    /**
     * Draws the rectangle on the provided canvas context.
     * 
     * @method draw
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context to draw on
     */
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(
            this.x - this.width / 2,
            this.y - this.height / 2,
            this.width,
            this.height,
        );
    }

    /**
     * Updates the rectangle's position using Verlet integration.
     * Applies velocity, acceleration, and enforces maximum speed limits.
     * 
     * @method move
     * @param {number} dt - Delta time since last update in seconds
     */
    move(dt) {
        const dx = this.x - this.lastX + this.acceleration.x * dt * dt;
        const dy = this.y - this.lastY + this.acceleration.y * dt * dt;

        this.lastX = this.x;
        this.lastY = this.y;

        const currentVelocity = Math.sqrt(dx * dx + dy * dy) / dt;

        if (this.speed.max !== null && currentVelocity > this.speed.max) {
            const scalingFactor = (this.speed.max * dt) / Math.sqrt(dx * dx + dy * dy);
            this.x += dx * scalingFactor;
            this.y += dy * scalingFactor;
            return;
        }

        this.y += dy;
        this.x += dx;
    }

    /**
     * Sets the rectangle's velocity to specific values.
     * 
     * @method setSpeed
     * @param {number} vx - Velocity in x-direction (pixels per frame)
     * @param {number} vy - Velocity in y-direction (pixels per frame)
     */
    setSpeed(vx, vy) {
        this.lastX = this.x - vx;
        this.lastY = this.y - vy;
    }

    /**
     * Adds velocity to the rectangle's current velocity.
     * 
     * @method applySpeed
     * @param {number} vx - Velocity to add in x-direction (pixels per frame)
     * @param {number} vy - Velocity to add in y-direction (pixels per frame)
     */
    applySpeed(vx, vy) {
        this.lastX -= vx;
        this.lastY -= vy;
    }

    /**
     * Gets the rectangle's current velocity.
     * 
     * @method getSpeed
     * @returns {Object} Object with x and y velocity components
     */
    getSpeed() {
        return {
            x: this.x - this.lastX,
            y: this.y - this.lastY
        };
    }

    /**
     * Sets the rectangle's acceleration to specific values.
     * 
     * @method setForce
     * @param {number} fx - Force in x-direction
     * @param {number} fy - Force in y-direction
     * @param {number} [divider=10000] - Divider to scale force values
     */
    setForce(fx, fy, divider = 10000) {
        this.acceleration.x = fx / divider;
        this.acceleration.y = fy / divider;
    }

    /**
     * Adds force to the rectangle's current acceleration.
     * 
     * @method applyForce
     * @param {number} fx - Force to add in x-direction
     * @param {number} fy - Force to add in y-direction
     * @param {number} [divider=10000] - Divider to scale force values
     */
    applyForce(fx, fy, divider = 10000) {
        this.acceleration.x += fx / divider;
        this.acceleration.y += fy / divider;
    }

    /**
     * Stops the rectangle's movement by setting velocity and acceleration to zero.
     * 
     * @method stop
     */
    stop() {
        this.lastX = this.x;
        this.lastY = this.y;
        this.acceleration.x = 0;
        this.acceleration.y = 0;
    }

    /**
     * Handles collision with canvas boundaries.
     * Keeps the rectangle within the canvas bounds by adjusting position when it hits edges.
     * 
     * @method canvasCollision
     * @param {number} canvasWidth - The width of the canvas in pixels
     * @param {number} canvasHeight - The height of the canvas in pixels
     */
    canvasCollision(canvasWidth, canvasHeight) {
        // if collision with canvas borders, stop at the border
        if (this.x - this.width / 2 < 0) {
            this.x = this.width / 2;
            this.lastX = this.x;
        } else if (this.x + this.width / 2 > canvasWidth) {
            this.x = canvasWidth - this.width / 2;
            this.lastX = this.x;
        }
        if (this.y - this.height / 2 < 0) {
            this.y = this.height / 2;
            this.lastY = this.y;
        } else if (this.y + this.height / 2 > canvasHeight) {
            this.y = canvasHeight - this.height / 2;
            this.lastY = this.y;
        }
    }
}