import CanvasElement from './CanvasElement.js';

/**
 * A scoreboard display for showing two players' scores on a canvas.
 * Displays scores with leading zeros and centers them horizontally.
 * Extends CanvasElement to inherit position management capabilities.
 * 
 * @class Scoreboard
 * @extends CanvasElement
 */
export default class Scoreboard extends CanvasElement {
    /**
     * Creates a new Scoreboard instance.
     * 
     * @constructor
     * @param {Object} options - Configuration options for the scoreboard
     * @param {number} [options.x=0] - The x-coordinate relative to the reference point
     * @param {number} [options.y=0] - The y-coordinate relative to the reference point
     * @param {Object} [options.posParam] - Position parameters object
     * @param {string} [options.posParam.relativeTo='top-left'] - Reference point on canvas
     * @param {Object} options.posParam.canvasSize - Canvas dimensions
     * @param {number} [options.posParam.canvasSize.width=0] - Canvas width in pixels
     * @param {number} [options.posParam.canvasSize.height=0] - Canvas height in pixels
     * @param {string} [options.font='20px Arial'] - Font specification for the score text
     * @param {string} [options.color='white'] - Color of the score text
     * @param {number} [options.gap=50] - Gap between left and right scores in pixels
     * @param {Object} [options.scores] - Initial score values
     * @param {number} [options.scores.left=0] - Left player's initial score
     * @param {number} [options.scores.right=0] - Right player's initial score
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
        },
        font = '20px Arial',
        color = 'white',
        gap = 50,
        scores = {
            left: 0,
            right: 0
        }
    }={}) {
        super({x, y, posParam});
        this.font = font;
        this.color = color;
        this.gap = gap;
        this.scores = scores;
    }

    /**
     * Updates the score for a specific side (left or right).
     * If no new score is provided, increments the current score by 1.
     * 
     * @method updateSideScore
     * @param {string} side - The side to update ('left' or 'right')
     * @param {number|null} [newScore=null] - The new score value, or null to increment by 1
     * @throws {Error} If side is not 'left' or 'right'
     */
    updateSideScore(side, newScore = null) {
        if (side === 'left' || side === 'right') {
            if (newScore === null) {
                this.scores[side] += 1;
            } else {
                this.scores[side] = newScore;
            }
            return;
        }
        throw new Error("Invalid side. Use 'left' or 'right'.");
    }

    /**
     * Updates both left and right scores.
     * Only updates scores that are provided (not null or undefined).
     * 
     * @method updateScore
     * @param {number|null} leftScore - The new left score value, or null to leave unchanged
     * @param {number|null} rightScore - The new right score value, or null to leave unchanged
     */
    updateScore(leftScore, rightScore) {
        if (leftScore !== null && leftScore !== undefined) {
            this.scores.left = leftScore;
        }
        if (rightScore !== null && rightScore !== undefined) {
            this.scores.right = rightScore;
        }
    }

    /**
     * Draws the scoreboard on the provided canvas context.
     * Displays scores with leading zeros, centered horizontally around the x coordinate.
     * 
     * @method draw
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context to draw on
     */
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.font = this.font;

        //Stringify scores with leading zeros
        const leftText = this.scores.left.toString().padStart(2, '0');
        const rightText = this.scores.right.toString().padStart(2, '0');
        
        //Measure text widths to center the scoreboard
        const leftWidth = ctx.measureText(leftText).width;
        
        //Measure text height for vertical alignment
        const height = ctx.measureText(leftText).actualBoundingBoxAscent;

        //Calculate total width and center position
        const startX = this.x - leftWidth - this.gap / 2;
        
        ctx.fillText(leftText, startX, this.y + height);
        ctx.fillText(rightText, startX + leftWidth + this.gap, this.y + height);
    }
}