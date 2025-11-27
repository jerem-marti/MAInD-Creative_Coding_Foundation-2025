/**
 * @fileoverview Screen orientation utility module for tracking viewport orientation.
 * This module monitors the window dimensions and maintains the current screen orientation
 * (landscape or portrait), updating automatically when the window is resized.
 */

/**
 * The current screen orientation based on viewport dimensions.
 * Set to 'landscape' when width > height, 'portrait' otherwise.
 * @type {string}
 */
let screenOrientation = window.innerWidth > window.innerHeight ? "landscape" : "portrait";

/**
 * Event listener for window resize events.
 * Updates the screenOrientation variable whenever the window dimensions change.
 * 
 * @listens resize
 */
window.addEventListener('resize', () => {
    screenOrientation = window.innerWidth > window.innerHeight ? "landscape" : "portrait";
});

/**
 * Returns the current screen orientation.
 * Orientation is determined by comparing viewport width and height:
 * - 'landscape' when width > height
 * - 'portrait' when height >= width
 * 
 * @function getScreenOrientation
 * @returns {string} The current screen orientation ('landscape' or 'portrait')
 */
export const getScreenOrientation = () => screenOrientation;

/**
 * Default export of the screen orientation getter function.
 * @exports getScreenOrientation
 */
export default getScreenOrientation;