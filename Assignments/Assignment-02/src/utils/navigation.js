/**
 * @file Helper functions for navigation.
 */

////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Navigation helper functions

/**
 * Activate the section corresponding to the given id and hide the others.
 * @param {*} id 
 */
const displaySection = (id) => {
    // Hide the currently active section if any
    document.querySelectorAll('section.active')?.forEach(section => section.classList.remove('active'));

    // Try to show the section corresponding to the given id 
    document.querySelector(`#${id}-section`)?.classList.add('active');
};

export {displaySection};