import CanvasElement from './CanvasElement.js';

/**
 * An avatar image element that can be drawn on canvas with customizable orientation and alignment.
 * Supports rotation in four directions (right, left, up, down) and aligns images based on position reference point.
 * Extends CanvasElement to inherit position management capabilities.
 * 
 * @class Avatar
 * @extends CanvasElement
 */
export default class Avatar extends CanvasElement {
    /**
     * Creates a new Avatar instance.
     * 
     * @constructor
     * @param {Object} options - Configuration options for the avatar element
     * @param {number} [options.x=0] - The x-coordinate relative to the reference point
     * @param {number} [options.y=0] - The y-coordinate relative to the reference point
     * @param {Object} [options.posParam] - Position parameters object
     * @param {string} [options.posParam.relativeTo='top-left'] - Reference point on canvas
     * @param {Object} options.posParam.canvasSize - Canvas dimensions
     * @param {number} [options.posParam.canvasSize.width=0] - Canvas width in pixels
     * @param {number} [options.posParam.canvasSize.height=0] - Canvas height in pixels
     * @param {string} [options.posParam.orientation='right'] - Avatar orientation ('right', 'left', 'up', or 'down')
     * @param {string} [options.urlEncoded=''] - Data URI encoded image source
     * @param {number} [options.size=64] - Size of the avatar image in pixels (width and height)
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
        urlEncoded = "",
        size = 64
    }={}) {
        super({x, y, posParam});
        this.orientation = posParam.orientation;
        this.size = size;
        this.image = new Image();
        this.image.src = urlEncoded;
    }

    /**
     * Draws the avatar on the provided canvas context.
     * Handles image alignment based on position reference point and applies rotation based on orientation.
     * 
     * @method draw
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context to draw on
     */
    draw(ctx) {
        ctx.save();

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
                startX = this.x - this.size;
                break;
            case 'top-center':
            case 'center':
            case 'bottom-center':
                startX = this.x - this.size / 2;
                break;
        }

        //Calculate startY based on positionRelativeTo
        let startY = this.y + this.size;
        switch (this.positionRelativeTo) {
            case 'top-left':
            case 'top-center':
            case 'top-right':
                startY = this.y;
                break;
            case 'center-left':
            case 'center':
            case 'center-right':
                startY = this.y - this.size / 2;
                break;
            case 'bottom-left':
            case 'bottom-center':
            case 'bottom-right':
                startY = this.y - this.size;
                break;
        }

        // Apply orientation
        if (this.orientation !== "right") {
            let angle = 0;
            switch (this.orientation) {
            case "left":
                angle = Math.PI;
                startX += this.size;
                startY -= this.size;
                break;
            case "up":
                angle = -Math.PI / 2;
                startX += this.size;
                break;
            case "down":
                angle = Math.PI / 2;
                startY -= this.size;
                break;
            }
            ctx.translate(this.x, this.y);
            ctx.rotate(angle);
            ctx.translate(-this.x, -this.y);
        }

        // Draw the avatar image
        ctx.drawImage(this.image, startX, startY, this.size, this.size);
        
        ctx.restore();
    }
}