import CanvasElement from './CanvasElement.js';

/**
 * A text element that can be drawn on canvas with customizable orientation and alignment.
 * Supports rotation in four directions (right, left, up, down) and aligns text based on position reference point.
 * Extends CanvasElement to inherit position management capabilities.
 * 
 * @class Text
 * @extends CanvasElement
 */
export default class Text extends CanvasElement {
    /**
     * Creates a new Text instance.
     * 
     * @constructor
     * @param {Object} options - Configuration options for the text element
     * @param {number} [options.x=0] - The x-coordinate relative to the reference point
     * @param {number} [options.y=0] - The y-coordinate relative to the reference point
     * @param {Object} [options.posParam] - Position parameters object
     * @param {string} [options.posParam.relativeTo='top-left'] - Reference point on canvas
     * @param {Object} options.posParam.canvasSize - Canvas dimensions
     * @param {number} [options.posParam.canvasSize.width=0] - Canvas width in pixels
     * @param {number} [options.posParam.canvasSize.height=0] - Canvas height in pixels
     * @param {string} [options.posParam.orientation='right'] - Text orientation ('right', 'left', 'up', or 'down')
     * @param {string} [options.font='20px Arial'] - Font specification for the text
     * @param {string} [options.color='white'] - Color of the text
     * @param {string} [options.text=''] - The text content to display
     */
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

    /**
     * Draws the text on the provided canvas context.
     * Handles text alignment based on position reference point and applies rotation based on orientation.
     * 
     * @method draw
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context to draw on
     */
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