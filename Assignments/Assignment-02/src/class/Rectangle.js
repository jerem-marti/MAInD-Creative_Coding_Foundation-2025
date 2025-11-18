export default class Rectangle {
    
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
        this.setPositionRelativeToCanvas(x, y, posParam);
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

    distanceXto({x}) {
        return this.x - x;
    }
    distanceYto({y}) {
        return this.y - y;
    }

    isInside({x, y}) {
        const distanceX = Math.abs(this.distanceXto({x}));
        const distanceY = Math.abs(this.distanceYto({y}));
        return distanceX <= this.width / 2 && distanceY <= this.height / 2;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(
            this.x - this.width / 2,
            this.y - this.height / 2,
            this.width,
            this.height,
        );
    }

    setPositionRelativeToCanvas(x, y, posParam) {
        switch (posParam.relativeTo) {
            case 'top-left':
                this.x = x;
                this.y = y;
                break;
            case 'top-right':
                this.x = posParam.canvasSize.width - x;
                this.y = y;
                break;
            case 'bottom-left':
                this.x = x;
                this.y = posParam.canvasSize.height - y;
                break;
            case 'bottom-right':
                this.x = posParam.canvasSize.width - x;
                this.y = posParam.canvasSize.height - y;
                break;
            case 'center':
                this.x = posParam.canvasSize.width / 2 + x;
                this.y = posParam.canvasSize.height / 2 + y;
                break;
            case 'center-left':
                this.x = x;
                this.y = posParam.canvasSize.height / 2 + y;
                break;
            case 'center-right':
                this.x = posParam.canvasSize.width - x;
                this.y = posParam.canvasSize.height / 2 + y;
                break;
        }
    }

    updatePositionRelativeToCanvas(dx, dy) {
        switch (this.positionRelativeTo) {
            case 'top-left':
                return;
            case 'center-left':
                this.y += dy / 2;
                break;
            case 'bottom-left':
            this.y += dy;
            break;
            case 'top-right':
                this.x += dx;
                break;
            case 'center-right':
                this.x += dx;
                this.y += dy / 2;
                break;
            case 'bottom-right':
                this.x += dx;
                this.y += dy;
                break;
            case 'center':
                this.x += dx / 2;
                this.y += dy / 2;
                break;
        }
    }

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

    setSpeed(vx, vy) {
        this.lastX = this.x - vx;
        this.lastY = this.y - vy;
    }

    applySpeed(vx, vy) {
        this.lastX -= vx;
        this.lastY -= vy;
    }

    getSpeed() {
        return {
            x: this.x - this.lastX,
            y: this.y - this.lastY
        };
    }

    setForce(fx, fy, divider = 10000) {
        this.acceleration.x = fx / divider;
        this.acceleration.y = fy / divider;
    }

    applyForce(fx, fy, divider = 10000) {
        this.acceleration.x += fx / divider;
        this.acceleration.y += fy / divider;
    }

    stop() {
        this.lastX = this.x;
        this.lastY = this.y;
        this.acceleration.x = 0;
        this.acceleration.y = 0;
    }

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