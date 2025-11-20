export default class LineDotted {
    constructor({
        x1 = 0,
        y1 = 0,
        x2 = 100,
        y2 = 100,
        color = 'white',
        lineWidth = 1,
        dotLength = 5,
        gapLength = 5
    } = {}) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.color = color;
        this.lineWidth = lineWidth;
        this.dotLength = dotLength;
        this.gapLength = gapLength;
    }

    draw(ctx) {
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.lineWidth;
        const deltaX = this.x2 - this.x1;
        const deltaY = this.y2 - this.y1;
        const lineLength = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const dashCount = Math.floor(lineLength / (this.dotLength + this.gapLength));
        const dashX = (deltaX / lineLength) * this.dotLength;
        const dashY = (deltaY / lineLength) * this.dotLength;
        const gapX = (deltaX / lineLength) * this.gapLength;
        const gapY = (deltaY / lineLength) * this.gapLength;
        let currentX = this.x1;
        let currentY = this.y1;
        for (let i = 0; i < dashCount; i++) {
            ctx.beginPath();
            ctx.moveTo(currentX, currentY);
            currentX += dashX;
            currentY += dashY;
            ctx.lineTo(currentX, currentY);
            ctx.stroke();
            currentX += gapX;
            currentY += gapY;
        }
    }
}