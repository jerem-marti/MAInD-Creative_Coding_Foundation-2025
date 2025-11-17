/**
 * @file Router for the application.
 * Handles navigation between different sections based on URL hash.
 */
import {displaySection} from './utils/navigation.js';

const router = () => {
    
    const hashs = window.location.hash.split('-');

    switch(hashs[0]) {
        case '#home':
            displaySection('home');
            break;
        case '#username':
            displaySection('username');
            break;
        case '#history':
            displaySection('history');
            break;
        case '#game':
            displaySection('game');
            break;
        default:
            // If the hash does not match any section, display the home section
            window.location.hash = '#home';
            displaySection('home');
    }
};

// Listen to hash changes to implement the router
window.addEventListener('hashchange', (event) => {
    isLeavingFormUnsaved().then((hasUnsavedChanges) => {
        if (!hasUnsavedChanges) {
            router();
        }
    });
});

// Call the router once
router();