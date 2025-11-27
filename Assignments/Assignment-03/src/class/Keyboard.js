/**
 * A class for managing keyboard input by tracking which keys are currently pressed.
 * Uses the Set data structure to efficiently track multiple simultaneous key presses.
 * 
 * @class Keyboard
 */
export default class Keyboard {
    /**
     * Creates a new Keyboard instance and initializes keyboard event listeners.
     * 
     * @constructor
     */
    constructor() {
        /**
         * Set containing the codes of all currently pressed keys.
         * @type {Set<string>}
         */
        this.keydown = new Set();
        
        /**
         * Stored event handler references for cleanup.
         * @type {Object}
         * @private
         */
        this.handlers = {
            keydown: null,
            keyup: null
        };
        
        this.init();
    }

    /**
     * Initializes keyboard event listeners to track key press and release events.
     * Listens for 'keydown' events to add keys to the pressed keys set,
     * and 'keyup' events to remove keys from the set.
     * 
     * @method init
     */
    init() {
        this.handlers.keydown = event => {
            this.keydown.add(event.code);
        };
        document.addEventListener('keydown', this.handlers.keydown);
        
        this.handlers.keyup = event => {
            this.keydown.delete(event.code);
        };
        document.addEventListener('keyup', this.handlers.keyup);
    }

    /**
     * Checks if a specific key is currently pressed.
     * 
     * @method isDown
     * @param {string} keyCode - The key code to check (e.g., 'KeyW', 'ArrowUp', 'Space')
     * @returns {boolean} True if the key is currently pressed, false otherwise
     */
    isDown(keyCode) {
        return this.keydown.has(keyCode);
    }
    
    /**
     * Cleans up all event listeners and clears key state.
     * Should be called when the Keyboard instance is no longer needed to prevent memory leaks.
     * 
     * @method destroy
     */
    destroy() {
        // Remove event listeners
        if (this.handlers.keydown) {
            document.removeEventListener('keydown', this.handlers.keydown);
        }
        if (this.handlers.keyup) {
            document.removeEventListener('keyup', this.handlers.keyup);
        }
        
        // Clear pressed keys
        this.keydown.clear();
        
        // Clear handler references
        this.handlers = {};
    }
}