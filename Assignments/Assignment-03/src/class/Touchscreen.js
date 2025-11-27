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
        
        /**
         * Stored event handler references for cleanup.
         * @type {Object}
         * @private
         */
        this.handlers = {
            touchstart: null,
            touchmove: null,
            touchend: null,
            touchcancel: null,
            gesturestart: null,
            gesturechange: null,
            gestureend: null,
            wheel: null
        };
        
        this.init();
        
        // Prevent pinch zooming with gestures
        this.handlers.gesturestart = (e) => {
            console.warn("gesturestart detected and prevented");
            e.preventDefault();
            document.body.style.zoom = '1.0';
        };
        document.addEventListener('gesturestart', this.handlers.gesturestart, {passive: false});
        
        this.handlers.gesturechange = (e) => {
            console.warn("gesturechange detected and prevented");
            e.preventDefault();
            document.body.style.zoom = '1.0';
        };
        document.addEventListener('gesturechange', this.handlers.gesturechange, {passive: false});
        
        this.handlers.gestureend = (e) => {
            console.warn("gestureend detected and prevented");
            e.preventDefault();
            document.body.style.zoom = '1.0';
        };
        document.addEventListener('gestureend', this.handlers.gestureend, {passive: false});
        
        // Prevent trackpad zooming with ctrl + scroll
        this.handlers.wheel = (e) => {
            console.warn("wheel event detected and prevented");
            e.preventDefault();
        };
        document.addEventListener('wheel', this.handlers.wheel, {passive: false});
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
        this.handlers.touchstart = event => {
            for (const touch of event.changedTouches) {
                this.touches.set(touch.identifier, {
                    x: touch.clientX,
                    y: touch.clientY
                });
            }
            // Prevent default to avoid scrolling
            event.preventDefault();
        };
        document.addEventListener('touchstart', this.handlers.touchstart, {passive: false});

        /**
         * Handles touchmove events.
         * Updates the position of existing touches in the touches Map.
         * 
         * @param {TouchEvent} event - The touchmove event containing updated touch positions
         */
        this.handlers.touchmove = event => {
            for (const touch of event.changedTouches) {
                this.touches.set(touch.identifier, {
                    x: touch.clientX,
                    y: touch.clientY
                });
            }
            // Prevent default to avoid scrolling
            event.preventDefault();
        };
        document.addEventListener('touchmove', this.handlers.touchmove, {passive: false});
        
        /**
         * Handles touchend events.
         * Removes touches that have ended from the touches Map.
         * 
         * @param {TouchEvent} event - The touchend event containing ended touches
         */
        this.handlers.touchend = event => {
            for (const touch of event.changedTouches) {
                this.touches.delete(touch.identifier);
            }
            // Prevent default to avoid scrolling
            event.preventDefault();
        };
        document.addEventListener('touchend', this.handlers.touchend);
        
        /**
         * Handles touchcancel events.
         * Removes cancelled touches from the touches Map.
         * Touchcancel occurs when a touch is interrupted (e.g., by system UI).
         * 
         * @param {TouchEvent} event - The touchcancel event containing cancelled touches
         */
        this.handlers.touchcancel = event => {
            for (const touch of event.changedTouches) {
                this.touches.delete(touch.identifier);
            }
            // Prevent default to avoid scrolling
            event.preventDefault();
        };
        document.addEventListener('touchcancel', this.handlers.touchcancel);
    }
    
    /**
     * Cleans up all event listeners and clears touch data.
     * Should be called when the Touchscreen instance is no longer needed to prevent memory leaks
     * and avoid blocking touch events on other parts of the application.
     * 
     * @method destroy
     */
    destroy() {
        // Remove all touch event listeners
        if (this.handlers.touchstart) {
            document.removeEventListener('touchstart', this.handlers.touchstart);
        }
        if (this.handlers.touchmove) {
            document.removeEventListener('touchmove', this.handlers.touchmove);
        }
        if (this.handlers.touchend) {
            document.removeEventListener('touchend', this.handlers.touchend);
        }
        if (this.handlers.touchcancel) {
            document.removeEventListener('touchcancel', this.handlers.touchcancel);
        }
        
        // Remove gesture and wheel event listeners
        if (this.handlers.gesturestart) {
            document.removeEventListener('gesturestart', this.handlers.gesturestart);
        }
        if (this.handlers.gesturechange) {
            document.removeEventListener('gesturechange', this.handlers.gesturechange);
        }
        if (this.handlers.gestureend) {
            document.removeEventListener('gestureend', this.handlers.gestureend);
        }
        if (this.handlers.wheel) {
            document.removeEventListener('wheel', this.handlers.wheel);
        }
        
        // Clear all active touches
        this.touches.clear();
        
        // Clear handler references
        this.handlers = {};
    }
}