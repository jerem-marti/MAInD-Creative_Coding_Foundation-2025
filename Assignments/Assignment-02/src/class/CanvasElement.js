export default class CanvasElement {
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