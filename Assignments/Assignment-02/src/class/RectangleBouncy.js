import Rectangle from "./Rectangle";

export default class RectangleBouncy extends Rectangle {
    constructor({
        x = 0,
        y = 0,
        width = 100,
        height = 100,
        speed = {
            velocity : 0,
            angle : 0
        },
        color = 'white'
    } = {}) {
        super({x, y, width, height, speed, color});
        this.ax = 0;
        this.ay = 0;
    }

    move(dt) {
        const dx = this.x - this.lastX;
        const dy = this.y - this.lastY;

        this.lastX = this.x;
        this.lastY = this.y;

        this.y += dy + this.ay * dt * dt;
        this.x += dx + this.ax * dt * dt;
    }

    applyForce(fx, fy) {
        this.ax += fx / 1000;
        this.ay += fy / 1000;
    }

    canvasCollision(canvasWidth, canvasHeight, bounce = 1) {
        const overlapLeft = this.x - this.width / 2;
        const overlapRight = this.x + this.width / 2 - canvasWidth;
        if (overlapLeft < 0 || overlapRight > 0) {
            const overlapX = overlapLeft < 0 ? overlapLeft : overlapRight;
            const newLastXDelta = bounce * (this.x - this.lastX - this.ax);
            this.x -= overlapX;
            this.lastX = this.x + newLastXDelta;
        } 
        const overlapTop = this.y - this.height / 2;
        const overlapBottom = this.y + this.height / 2 - canvasHeight;
        if (overlapTop < 0 || overlapBottom > 0) {
            const overlapY = overlapTop < 0 ? overlapTop : overlapBottom;
            const newLastYDelta = bounce * (this.y - this.lastY - this.ay);
            this.y -= overlapY;
            this.lastY = this.y + newLastYDelta;
        } 
    }

    rectangleCollision(Rectangle, bounce = 1) {
        const distanceX = this.distanceXto(Rectangle);
        const distanceY = this.distanceYto(Rectangle);
        const overlapX = (this.width / 2 + Rectangle.width / 2) - Math.abs(distanceX);
        const overlapY = (this.height / 2 + Rectangle.height / 2) - Math.abs(distanceY);
        if (overlapX > 0 && overlapY > 0) {
            if (overlapX < overlapY) {
                const newLastXDelta = bounce * (this.x - this.lastX - this.ax);
                this.x += Math.sign(distanceX) * overlapX;
                this.lastX = this.x + newLastXDelta;
            } else {
                const newLastYDelta = bounce * (this.y - this.lastY - this.ay);
                this.y += Math.sign(distanceY) * overlapY;
                this.lastY = this.y + newLastYDelta;
            }
        }
    }
}