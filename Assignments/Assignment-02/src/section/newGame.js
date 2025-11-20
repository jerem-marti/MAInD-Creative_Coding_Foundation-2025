/**
 * @fileoverview New game section module for setting up and starting a new Pong game.
 * This module handles the new game form, validates player inputs, requests fullscreen mode,
 * and navigates to the game section with the configured parameters.
 */

/**
 * HTML element displaying the new game section title.
 * @type {HTMLElement}
 */
const title = document.querySelector('#new-game-title');

/**
 * HTML form element for new game configuration.
 * @type {HTMLFormElement}
 */
const form = document.querySelector('#new-game-form');

/**
 * HTML input element for player 1's username.
 * @type {HTMLInputElement}
 */
const player1Input = document.querySelector('#player1-username');

/**
 * HTML input element for player 2's username.
 * @type {HTMLInputElement}
 */
const player2Input = document.querySelector('#player2-username');
// const gameModeOptions = document.getElementsByName('game-mode');

/**
 * Displays and initializes the new game form.
 * Resets the form title and clears all input fields to their default state.
 * 
 * @function displayNewGame
 */
const displayNewGame = () => {
    // Reset form fields
    title.textContent = 'Start a New Game';
    player1Input.value = '';
    player2Input.value = '';
    // gameModeOptions[0].checked = true; // Default to first option
};

/**
 * Event listener for form submission.
 * Validates player names (browser validation handles required/minlength/maxlength),
 * requests fullscreen mode for the canvas, and navigates to the game section
 * with player names and game mode as URL hash parameters.
 * 
 * @listens submit
 * @param {Event} e - The form submit event
 */
form.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent default form submission

    const player1Name = player1Input.value.trim();
    const player2Name = player2Input.value.trim();

    // Browser validation will handle required and minlength/maxlength
    // But we can add additional custom validation if needed
    if (player1Name === '' || player2Name === '') {
        return; // This shouldn't happen due to required attribute
    }

    let selectedGameMode = 'Single Player';
    // for (const option of gameModeOptions) {
    //     if (option.checked) {
    //         selectedGameMode = option.value;
    //         break;
    //     }
    // }

    const canvas = document.querySelector('canvas');
    // Ask to fullscreen
    if (!document.fullscreenElement) {
        canvas.requestFullscreen();
    } else if (document.documentElement.webkitRequestFullscreen) { /* Safari */
        canvas.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) { /* IE11 */
        canvas.msRequestFullscreen();
    }

    // change hash to start the game by passing player names and mode in query params
    window.location.hash = `#game?player1=${encodeURIComponent(player1Name)}&player2=${encodeURIComponent(player2Name)}&mode=${encodeURIComponent(selectedGameMode)}`;
});

/**
 * Exported function to display and initialize the new game form.
 * @exports displayNewGame
 */
export {displayNewGame};