/**
 * @fileoverview End game section module for displaying game results and handling replay functionality.
 * This module manages the end game UI, showing the winner, player names, final scores,
 * and providing a "Play Again" button to restart with the same settings.
 */

import { getLatestGame } from "../utils/historyManager";

/**
 * HTML element displaying the winner announcement text.
 * @type {HTMLElement}
 */
const winnerTextElement = document.getElementById('end-game-winner-text');

/**
 * HTML element displaying player 1's username.
 * @type {HTMLElement}
 */
const player1UsernameElement = document.getElementById('end-game-player1-username');

/**
 * HTML element displaying player 2's username.
 * @type {HTMLElement}
 */
const player2UsernameElement = document.getElementById('end-game-player2-username');

/**
 * HTML element displaying the final score.
 * @type {HTMLElement}
 */
const scoreElement = document.getElementById('end-game-score');

/**
 * HTML button element for playing another game with the same players.
 * @type {HTMLButtonElement}
 */
const playAgainButton = document.getElementById('end-game-play-again-button');

/**
 * Displays the end game screen with results from the most recent game.
 * Retrieves the latest game from history and updates the UI with:
 * - Winner announcement
 * - Player usernames with winner/loser styling
 * - Final score
 * 
 * If no game history is found, displays an error message.
 * 
 * @function displayEndGame
 */
const displayEndGame = () => {
    const latestGame = getLatestGame();
    if (!latestGame) {
        console.error("No game history found.");
        winnerTextElement.textContent = "No game data available.";
        player1UsernameElement.textContent = "";
        player2UsernameElement.textContent = "";
        scoreElement.textContent = "";
    } else {
        const player1 = latestGame.player1;
        const player2 = latestGame.player2;

        player1UsernameElement.textContent = player1.name;
        player2UsernameElement.textContent = player2.name;
        scoreElement.textContent = `( ${player1.score} : ${player2.score} )`;

        if (player1.score > player2.score) {
            player1UsernameElement.classList.add('winner');
            player1UsernameElement.classList.remove('loser');
            player2UsernameElement.classList.add('loser');
            player2UsernameElement.classList.remove('winner');
            winnerTextElement.textContent = `${player1.name} Wins!`;
        } else if (player2.score > player1.score) {
            player2UsernameElement.classList.add('winner');
            player2UsernameElement.classList.remove('loser');
            player1UsernameElement.classList.add('loser');
            player1UsernameElement.classList.remove('winner');
            winnerTextElement.textContent = `${player2.name} Wins!`;
        } else {
            player1UsernameElement.classList.remove('winner', 'loser');
            player2UsernameElement.classList.remove('winner', 'loser');
            winnerTextElement.textContent = "It's a Tie!";
        }
    }
};

/**
 * Event listener for the "Play Again" button.
 * Retrieves the latest game data and navigates to the game section with the same
 * player names and game mode as query parameters in the URL hash.
 * 
 * @listens click
 */
playAgainButton.addEventListener('click', () => {
    const latestGame = getLatestGame();
    if (!latestGame) {
        console.error("No game history found.");
        return;
    }
    // change hash to start the game by passing player names and mode in query params
    window.location.hash = `#game?player1=${encodeURIComponent(latestGame.player1.name)}&player2=${encodeURIComponent(latestGame.player2.name)}&mode=${encodeURIComponent(latestGame.mode)}`;
});

/**
 * Exported function to display the end game screen.
 * @exports displayEndGame
 */
export {displayEndGame};
