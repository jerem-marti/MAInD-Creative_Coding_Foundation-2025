/**
 * A class for managing touchscreen input by tracking active touches.
 * Prevents default touch behaviors like scrolling, pinch zooming, and trackpad zooming.
 * Uses a Map data structure to efficiently track multiple simultaneous touches.
 * 
 * @class Touchscreen
 */
export default class Touchscreen {

    /**
     * Creates a new Touchscreen instance and initializes touch event listeners.
     * Sets up prevention for gesture-based zoom and wheel-based zoom.
     * 
     * @constructor
     */
    constructor() {
        /**
         * Map containing all currently active touches, indexed by touch identifier.
         * Each touch object contains x and y client coordinates.
         * @type {Map<number, {x: number, y: number}>}
         */
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

    /**
     * Initializes touch event listeners to track touch interactions.
     * Listens for touchstart, touchmove, touchend, and touchcancel events to manage active touches.
     * Prevents default behavior on all touch events to avoid scrolling and other unwanted interactions.
     * 
     * @method init
     */
    init() {
        /**
         * Handles touchstart events.
         * Adds each new touch to the touches Map with its identifier and initial position.
         * 
         * @param {TouchEvent} event - The touchstart event containing new touches
         */
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

        /**
         * Handles touchmove events.
         * Updates the position of existing touches in the touches Map.
         * 
         * @param {TouchEvent} event - The touchmove event containing updated touch positions
         */
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
        
        /**
         * Handles touchend events.
         * Removes touches that have ended from the touches Map.
         * 
         * @param {TouchEvent} event - The touchend event containing ended touches
         */
        document.addEventListener('touchend', event => {
            for (const touch of event.changedTouches) {
                this.touches.delete(touch.identifier);
            }
            // Prevent default to avoid scrolling
            event.preventDefault();
        });
        
        /**
         * Handles touchcancel events.
         * Removes cancelled touches from the touches Map.
         * Touchcancel occurs when a touch is interrupted (e.g., by system UI).
         * 
         * @param {TouchEvent} event - The touchcancel event containing cancelled touches
         */
        document.addEventListener('touchcancel', event => {
            for (const touch of event.changedTouches) {
                this.touches.delete(touch.identifier);
            }
            // Prevent default to avoid scrolling
            event.preventDefault();
        });
    }
}