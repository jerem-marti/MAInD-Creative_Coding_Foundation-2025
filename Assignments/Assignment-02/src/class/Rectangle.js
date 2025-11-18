export default class Rectangle {
    
    constructor({
        x = 0,
        y = 0,
        width = 100,
        height = 100,
        speed = {
            velocity : 0,
            angle : 0
        },
        color = 'white',
        position = {
            relativeTo: 'top-left',
            canvasSize: {
                width: 0,
                height: 0
            }
        }
    } = {}) {
        switch (position.relativeTo) {
            case 'top-left':
                this.x = x;
                this.y = y;
                break;
            case 'top-right':
                this.x = position.canvasSize.width - x;
                this.y = y;
                break;
            case 'bottom-left':
                this.x = x;
                this.y = position.canvasSize.height - y;
                break;
            case 'bottom-right':
                this.x = position.canvasSize.width - x;
                this.y = position.canvasSize.height - y;
                break;
            case 'center':
                this.x = position.canvasSize.width / 2 + x;
                this.y = position.canvasSize.height / 2 + y;
                break;
        }
        this.lastX = x - Math.cos(speed.angle) * speed.velocity;
        this.lastY = y - Math.sin(speed.angle) * speed.velocity;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.color = color;
        this.positionRelativeTo = position.relativeTo;
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

    updatePositionRelativeToCanvas(dx, dy) {
        switch (this.positionRelativeTo) {
            case 'top-left':
                return;
            case 'bottom-right':
                this.x += dx;
                this.y += dy;
                break;
            case 'bottom-left':
                this.y += dy;
                break;
            case 'top-right':
                this.x += dx;
                break;
            case 'center':
                this.x += dx / 2;
                this.y += dy / 2;
                break;
        }
    }

    move(dt) {
        if(dt === undefined || dt === null) dt = 0;
        const dx = this.x - this.lastX;
        const dy = this.y - this.lastY;
        this.lastX = this.x;
        this.lastY = this.y;
    }

    stop() {
        this.lastX = this.x;
        this.lastY = this.y;
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