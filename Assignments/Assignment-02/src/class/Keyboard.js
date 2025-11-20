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
        document.addEventListener('keydown', event => {
            this.keydown.add(event.code);
        });
        document.addEventListener('keyup', event => {
            this.keydown.delete(event.code);
        });
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
}