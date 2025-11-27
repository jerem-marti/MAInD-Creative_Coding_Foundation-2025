/**
 * @fileoverview Main application entry point and router for the Pong game.
 * This module implements hash-based routing for a single-page application,
 * handling navigation between home, new game setup, active game, game history,
 * and end game sections. Initializes the game history from localStorage on load
 * and listens for URL hash changes to update the displayed section dynamically.
 */

import {displaySection, getQueryParamsFromHash} from './utils/navigation.js';
import {displayGame} from './section/game.js';
import {displayNewGame} from './section/newGame.js'
import {displayEndGame} from './section/endGame.js';
import {displayHistory} from './section/history.js';
import { initializeHistory } from './utils/historyManager.js';
import audio from './utils/audio.js';

/**
 * Initialize game history from localStorage.
 * Loads previously saved game results into memory for display in the history section.
 */
initializeHistory();

/** Initialize button sounds.
 * Sets up sound effects for button interactions across the application.
 */
audio.initializeButtonSounds();

/**
 * Router function that handles URL hash changes and displays the appropriate section.
 * Parses the current URL hash and query parameters to determine which section to display
 * and what data to pass to section initialization functions. Supports the following routes:
 * - #home: Home screen
 * - #new-game: New game setup form
 * - #history: Game history list
 * - #game?player1=X&player2=Y&mode=Z: Active game with player names and mode
 * - #end-game: End game results screen
 * 
 * If the hash doesn't match any known route, redirects to #home.
 * 
 * @function router
 */
const router = () => {
    
    const queryParams = getQueryParamsFromHash();
    const hashs = window.location.hash.split('?')[0].split('/');

    switch(hashs[0]) {
        case '#home':
            displaySection('home');
            break;
        case '#new-game':
            displaySection('new-game');
            displayNewGame();
            break;
        case '#history':
            displaySection('history');
            displayHistory();
            break;
        case '#game':
            const player1 = queryParams.get('player1');
            const player2 = queryParams.get('player2');
            const mode = queryParams.get('mode');
            displaySection('game');
            displayGame(player1, player2, mode);
            break;
        case '#end-game':
            displaySection('end-game');
            displayEndGame();
            break;
        default:
            // If the hash does not match any section, display the home section
            window.location.hash = '#home';
    }
};

/**
 * Event listener for hashchange events.
 * Triggers the router function whenever the URL hash changes,
 * enabling navigation without page reloads.
 * 
 * @listens hashchange
 */
window.addEventListener('hashchange', (event) => {
    router();
});

/**
 * Initial router invocation.
 * Runs the router once on page load to display the section corresponding
 * to the initial URL hash (or redirect to home if no valid hash exists).
 */
router();