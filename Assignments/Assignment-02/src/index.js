/**
 * @file Router for the application.
 * Handles navigation between different sections based on URL hash.
 */
import {displaySection, getQueryParamsFromHash} from './utils/navigation.js';
import {displayGame} from './section/game.js';
import {displayNewGame} from './section/newGame.js'
import {displayEndGame} from './section/endGame.js';
import { initializeHistory } from './utils/historyManager.js';

// Initialize history from local storage
initializeHistory();

// Router function to handle hash changes
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
            displayNewGame();
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
            window.location.hash = '#new-game';
    }
};

// Listen to hash changes to implement the router
window.addEventListener('hashchange', (event) => {
    router();
});

// Call the router once
router();