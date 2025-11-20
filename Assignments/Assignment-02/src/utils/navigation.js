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

// create a function who simulate query params parsing from hash
const getQueryParamsFromHash = () => {
    const queryString = window.location.hash.split('?')[1] || '';
    return new URLSearchParams(queryString);
};

export {displaySection, getQueryParamsFromHash};