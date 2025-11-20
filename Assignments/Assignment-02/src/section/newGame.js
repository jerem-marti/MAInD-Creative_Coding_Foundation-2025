const title = document.querySelector('#new-game-title');
const player1Input = document.querySelector('#player1-username');
const player2Input = document.querySelector('#player2-username');
const gameModeOptions = document.getElementsByName('game-mode');
const startGameButton = document.querySelector('#start-game-button');

const displayNewGame = () => {
    // Reset form fields
    title.textContent = 'Start a New Game';
    player1Input.value = '';
    player2Input.value = '';
    gameModeOptions[0].checked = true; // Default to first option
};

startGameButton.addEventListener('click', () => {
    const player1Name = player1Input.value.trim() || 'Player 1';
    const player2Name = player2Input.value.trim() || 'Player 2';
    let selectedGameMode = 'Single Player';
    for (const option of gameModeOptions) {
        if (option.checked) {
            selectedGameMode = option.value;
            break;
        }
    }

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

export {displayNewGame};