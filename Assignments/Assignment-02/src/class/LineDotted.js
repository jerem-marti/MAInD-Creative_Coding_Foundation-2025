import CanvasElement from './CanvasElement.js';

export default class LineDotted extends CanvasElement {
    constructor({
        x = 0,
        y = 0,
        lenght = 100,
        angle = Math.PI / 2,
        posParam = {
            relativeTo: 'top-left',
            canvasSize: {
                width: 0,
                height: 0
            }
        },
        color = 'white',
        lineWidth = 1,
        dotLength = 5,
        gapLength = 5
    } = {}) {
        super({x, y, posParam});
        this.lenght = lenght;
        this.angle = angle;
        this.color = color;
        this.lineWidth = lineWidth;
        this.dotLength = dotLength;
        this.gapLength = gapLength;
    }

    draw(ctx) {
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.lineWidth;
        const deltaX = this.lenght * Math.cos(this.angle);
        const deltaY = this.lenght * Math.sin(this.angle);
        const dashCount = Math.floor(this.lenght / (this.dotLength + this.gapLength));
        const dashX = (deltaX / this.lenght) * this.dotLength;
        const dashY = (deltaY / this.lenght) * this.dotLength;
        const gapX = (deltaX / this.lenght) * this.gapLength;
        const gapY = (deltaY / this.lenght) * this.gapLength;
        let currentX = this.x;
        let currentY = this.y;
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