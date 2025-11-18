export default class Touchscreen {

    constructor() {
        this.touches = new Map();
        this.init();
    }
    init() {
        document.addEventListener('touchstart', event => {
            for (const touch of event.changedTouches) {
                this.touches.set(touch.identifier, {
                    x: touch.clientX,
                    y: touch.clientY
                });
            }
        });
        document.addEventListener('touchmove', event => {
            for (const touch of event.changedTouches) {
                this.touches.set(touch.identifier, {
                    x: touch.clientX,
                    y: touch.clientY
                });
            }
        });
        document.addEventListener('touchend', event => {
            for (const touch of event.changedTouches) {
                this.touches.delete(touch.identifier);
            }
        });
        document.addEventListener('touchcancel', event => {
            for (const touch of event.changedTouches) {
                this.touches.delete(touch.identifier);
            }
        });
    }
}