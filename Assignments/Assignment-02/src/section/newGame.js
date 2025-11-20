const title = document.querySelector('#new-game-title');
const form = document.querySelector('#new-game-form');
const player1Input = document.querySelector('#player1-username');
const player2Input = document.querySelector('#player2-username');
// const gameModeOptions = document.getElementsByName('game-mode');

const displayNewGame = () => {
    // Reset form fields
    title.textContent = 'Start a New Game';
    player1Input.value = '';
    player2Input.value = '';
    // gameModeOptions[0].checked = true; // Default to first option
};

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

export {displayNewGame};