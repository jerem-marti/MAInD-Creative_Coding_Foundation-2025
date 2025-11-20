import CanvasElement from './CanvasElement.js';

export default class Text extends CanvasElement {
    constructor({
        x = 0,
        y = 0,
        posParam = {
            relativeTo: 'top-left',
            canvasSize: {
                width: 0,
                height: 0
            },
            orientation: "right"
        },
        font = '20px Arial',
        color = 'white',
        text = ''
    }={}) {
        super({x, y, posParam});
        this.font = font;
        this.color = color;
        this.text = text;
        this.orientation = posParam.orientation;
    }

    draw(ctx) {
        ctx.save();
        
        ctx.fillStyle = this.color;
        ctx.font = this.font;

        //Measure text widths
        const width = ctx.measureText(this.text).width;

        //Measure text height for vertical alignment
        const height = ctx.measureText(this.text).actualBoundingBoxAscent;

        //Calculate startX based on positionRelativeTo
        let startX = this.x;
        switch (this.positionRelativeTo) {
            case 'top-left':
            case 'center-left':
            case 'bottom-left':
                startX = this.x;
                break;
            case 'top-right':
            case 'center-right':
            case 'bottom-right':
                startX = this.x - width;
                break;
            case 'top-center':
            case 'center':
            case 'bottom-center':
                startX = this.x - width / 2;
                break;
        }

        //Calculate startY based on positionRelativeTo
        let startY = this.y + height;
        switch (this.positionRelativeTo) {
            case 'top-left':
            case 'top-center':
            case 'top-right':
                startY = this.y + height;
                break;
            case 'center-left':
            case 'center':
            case 'center-right':
                startY = this.y + height / 2;
                break;
            case 'bottom-left':
            case 'bottom-center':
            case 'bottom-right':
                startY = this.y;
                break;
        }

        // Apply orientation
        if (this.orientation !== "right") {
            let angle = 0;
            switch (this.orientation) {
                case "left":
                    startX += width;
                    startY -= height;
                    angle = Math.PI;
                    break;
                case "up":
                    startX += width;
                    angle = -Math.PI / 2;
                    break;
                case "down":
                    startY -= height;
                    angle = Math.PI / 2;
                    break;
            }
            ctx.translate(startX, startY);
            ctx.rotate(angle);
            ctx.translate(-startX, -startY);
        }

        ctx.fillText(this.text, startX, startY);
        
        ctx.restore();
    }
}