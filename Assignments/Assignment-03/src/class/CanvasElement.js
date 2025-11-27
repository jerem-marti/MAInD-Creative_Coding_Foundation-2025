/**
 * A base class for elements that can be drawn on a canvas with position management
 * relative to different reference points on the canvas.
 * 
 * @class CanvasElement
 */
export default class CanvasElement {
    /**
     * Creates a new CanvasElement instance.
     * 
     * @constructor
     * @param {Object} options - Configuration options for the canvas element
     * @param {number} [options.x=0] - The x-coordinate relative to the reference point
     * @param {number} [options.y=0] - The y-coordinate relative to the reference point
     * @param {Object} [options.posParam] - Position parameters object
     * @param {string} [options.posParam.relativeTo='top-left'] - Reference point on canvas. Valid values: 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'center', 'center-left', 'center-right', 'top-center', 'bottom-center'
     * @param {Object} options.posParam.canvasSize - Canvas dimensions
     * @param {number} [options.posParam.canvasSize.width=0] - Canvas width in pixels
     * @param {number} [options.posParam.canvasSize.height=0] - Canvas height in pixels
     */
    constructor({
        x = 0,
        y = 0,
        posParam = {
            relativeTo: 'top-left',
            canvasSize: {
                width: 0,
                height: 0
            }
        }
    } = {}) {
        this.positionRelativeTo = posParam.relativeTo;
        this.x = 0;
        this.y = 0;
        this.setPositionRelativeToCanvas(x, y, posParam);
    }

    /**
     * Sets the element's absolute position based on relative coordinates and reference point.
     * Converts relative coordinates to absolute canvas coordinates based on the specified reference point.
     * 
     * @method setPositionRelativeToCanvas
     * @param {number} x - The x-coordinate relative to the reference point
     * @param {number} y - The y-coordinate relative to the reference point
     * @param {Object} posParam - Position parameters object
     * @param {string} posParam.relativeTo - Reference point on canvas ('top-left', 'top-right', 'bottom-left', 'bottom-right', 'center', 'center-left', 'center-right', 'top-center', 'bottom-center')
     * @param {Object} posParam.canvasSize - Canvas dimensions
     * @param {number} posParam.canvasSize.width - Canvas width in pixels
     * @param {number} posParam.canvasSize.height - Canvas height in pixels
     */
    setPositionRelativeToCanvas(x, y, posParam) {
        this.positionRelativeTo = posParam.relativeTo;
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
            case 'top-center':
                this.x = posParam.canvasSize.width / 2 + x;
                this.y = y;
                break;
            case 'bottom-center':
                this.x = posParam.canvasSize.width / 2 + x;
                this.y = posParam.canvasSize.height - y;
                break;
        }
    }

    /**
     * Updates the element's position when canvas size changes.
     * Adjusts the absolute position based on the delta values and current reference point
     * to maintain relative positioning when canvas is resized.
     * 
     * @method updatePositionRelativeToCanvas
     * @param {number} dx - Change in canvas width (new width - old width)
     * @param {number} dy - Change in canvas height (new height - old height)
     */
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
            case 'top-center':
                this.x += dx / 2;
                break;
            case 'bottom-center':
                this.x += dx / 2;
                this.y += dy;
                break;
        }
    }
}