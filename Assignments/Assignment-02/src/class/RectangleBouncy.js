import Rectangle from "./Rectangle";
import audio from "../utils/audio";

export default class RectangleBouncy extends Rectangle {
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