import CanvasElement from './CanvasElement.js';

/**
 * A class for drawing dotted lines on a canvas with customizable appearance.
 * Extends CanvasElement to inherit position management capabilities.
 * 
 * @class LineDotted
 * @extends CanvasElement
 */
export default class LineDotted extends CanvasElement {
    /**
     * Creates a new LineDotted instance.
     * 
     * @constructor
     * @param {Object} options - Configuration options for the dotted line
     * @param {number} [options.x=0] - The x-coordinate of the line start point relative to the reference point
     * @param {number} [options.y=0] - The y-coordinate of the line start point relative to the reference point
     * @param {number} [options.lenght=100] - The total length of the line in pixels
     * @param {number} [options.angle=Math.PI/2] - The angle of the line in radians (default: π/2, pointing downward)
     * @param {Object} [options.posParam] - Position parameters object
     * @param {string} [options.posParam.relativeTo='top-left'] - Reference point on canvas
     * @param {Object} options.posParam.canvasSize - Canvas dimensions
     * @param {number} [options.posParam.canvasSize.width=0] - Canvas width in pixels
     * @param {number} [options.posParam.canvasSize.height=0] - Canvas height in pixels
     * @param {string} [options.color='white'] - The color of the line
     * @param {number} [options.lineWidth=1] - The width of the line in pixels
     * @param {number} [options.dotLength=5] - The length of each dot segment in pixels
     * @param {number} [options.gapLength=5] - The length of each gap between dots in pixels
     */
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

    /**
     * Draws the dotted line on the provided canvas context.
     * Renders a series of line segments (dots) with gaps between them,
     * following the specified angle and length.
     * 
     * @method draw
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context to draw on
     */
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