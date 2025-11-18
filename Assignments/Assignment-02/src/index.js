/**
 * @file Router for the application.
 * Handles navigation between different sections based on URL hash.
 */
import {displaySection} from './utils/navigation.js';
import {displayGame} from './section/game.js';

// Lock the screen orientation to landscape
// This feature is not Baseline, it does not work in some of the most widely-used browsers.
// https://developer.mozilla.org/en-US/docs/Web/API/ScreenOrientation/lock#browser_compatibility 
// screen.orientation.lock('landscape').catch((error) => {
//     console.warn("Orientation lock failed:", error);
// });

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
            displayGame();
            break;
        default:
            // If the hash does not match any section, display the home section
            window.location.hash = '#game';
            displaySection('game');
    }
};

// Listen to hash changes to implement the router
window.addEventListener('hashchange', (event) => {
    router();
});

// Call the router once
router();