/**
 * @fileoverview Navigation utility module for managing single-page application routing.
 * This module provides functions to handle section visibility toggling and URL hash
 * query parameter parsing for navigation within the Pong game application.
 */

/**
 * Activates the section corresponding to the given ID and hides all others.
 * Removes the 'active' class from all currently active sections and adds it to the
 * target section. If no section matches the provided ID, no section will be active.
 * 
 * @function displaySection
 * @param {string} id - The ID prefix of the section to display (e.g., 'home' for '#home-section')
 */
const displaySection = (id) => {
    // Hide the currently active section if any
    document.querySelectorAll('section.active')?.forEach(section => section.classList.remove('active'));

    // Try to show the section corresponding to the given id 
    document.querySelector(`#${id}-section`)?.classList.add('active');
};

/**
 * Parses query parameters from the URL hash.
 * Extracts the query string portion after '?' in the hash and returns a URLSearchParams object.
 * If no query string is present, returns an empty URLSearchParams object.
 * 
 * @function getQueryParamsFromHash
 * @returns {URLSearchParams} A URLSearchParams object containing the parsed query parameters
 * @example
 * // URL: #game?player1=Alice&player2=Bob
 * const params = getQueryParamsFromHash();
 * params.get('player1'); // 'Alice'
 * params.get('player2'); // 'Bob'
 */
const getQueryParamsFromHash = () => {
    const queryString = window.location.hash.split('?')[1] || '';
    return new URLSearchParams(queryString);
};

/**
 * Exported navigation utility functions.
 * @exports displaySection - Displays a specific section and hides others
 * @exports getQueryParamsFromHash - Parses query parameters from URL hash
 */
export {displaySection, getQueryParamsFromHash};