export default class Touchscreen {

    constructor() {
        this.touches = new Map();
        this.init();
        // Prevent pinch zooming with gestures
        document.addEventListener('gesturestart', (e) => {
            console.warn("gesturestart detected and prevented");
            e.preventDefault();
            document.body.style.zoom = '1.0';
        }, {passive: false});
        document.addEventListener('gesturechange', (e) => {
            console.warn("gesturechange detected and prevented");
            e.preventDefault();
            document.body.style.zoom = '1.0';
        }, {passive: false});
        document.addEventListener('gestureend', (e) => {
            console.warn("gestureend detected and prevented");
            e.preventDefault();
            document.body.style.zoom = '1.0';
        }, {passive: false});
        // Prevent trackpad zooming with ctrl + scroll
        document.addEventListener('wheel', (e) => {
            console.warn("wheel event detected and prevented");
            e.preventDefault();
        }, {passive: false});
    }

    init() {
        document.addEventListener('touchstart', event => {
            for (const touch of event.changedTouches) {
                this.touches.set(touch.identifier, {
                    x: touch.clientX,
                    y: touch.clientY
                });
            }
            // Prevent default to avoid scrolling
            event.preventDefault();
        }, {passive: false});

        document.addEventListener('touchmove', event => {
            for (const touch of event.changedTouches) {
                this.touches.set(touch.identifier, {
                    x: touch.clientX,
                    y: touch.clientY
                });
            }
            // Prevent default to avoid scrolling
            event.preventDefault();
        }, {passive: false});
        document.addEventListener('touchend', event => {
            for (const touch of event.changedTouches) {
                this.touches.delete(touch.identifier);
            }
            // Prevent default to avoid scrolling
            event.preventDefault();
        });
        document.addEventListener('touchcancel', event => {
            for (const touch of event.changedTouches) {
                this.touches.delete(touch.identifier);
            }
            // Prevent default to avoid scrolling
            event.preventDefault();
        });
    }
}