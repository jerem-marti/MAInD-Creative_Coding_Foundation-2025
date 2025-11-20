export default class Scoreboard {
    constructor({
        x = 0,
        y = 0,
        font = '20px Arial',
        color = 'white',
        gap = 50,
        scores = {
            left: 0,
            right: 0
        }
    }={}) {
        this.x = x;
        this.y = y;
        this.font = font;
        this.color = color;
        this.gap = gap;
        this.scores = scores;
    }

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

    updateScore(leftScore, rightScore) {
        if (leftScore !== null && leftScore !== undefined) {
            this.scores.left = leftScore;
        }
        if (rightScore !== null && rightScore !== undefined) {
            this.scores.right = rightScore;
        }
    }

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

        console.log(height);
        
        ctx.fillText(leftText, startX, this.y + height);
        ctx.fillText(rightText, startX + leftWidth + this.gap, this.y + height);
    }
}