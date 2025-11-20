import { getLatestGame } from "../utils/historyManager";

const winnerTextElement = document.getElementById('end-game-winner-text');
const player1Container = document.getElementById('end-game-player1');
const player2Container = document.getElementById('end-game-player2');
const player1UsernameElement = document.getElementById('end-game-player1-username');
const player2UsernameElement = document.getElementById('end-game-player2-username');
const player1ResultElement = document.getElementById('end-game-player1-result');
const player2ResultElement = document.getElementById('end-game-player2-result');
const playAgainButton = document.getElementById('end-game-play-again-button');
const returnHomeButton = document.getElementById('end-game-return-home-button');

const displayEndGame = () => {
    const latestGame = getLatestGame();
    if (!latestGame) {
        console.error("No game history found.");
        winnerTextElement.textContent = "No game data available.";
        player1UsernameElement.textContent = "";
        player2UsernameElement.textContent = "";
        player1ResultElement.textContent = "";
        player2ResultElement.textContent = "";
    } else {
        const player1 = latestGame.player1;
        const player2 = latestGame.player2;

        player1UsernameElement.textContent = player1.name;
        player2UsernameElement.textContent = player2.name;
        player1ResultElement.textContent = player1.score;
        player2ResultElement.textContent = player2.score;

        if (player1.score > player2.score) {
            player1Container.classList.add('winner');
            player1Container.classList.remove('loser');
            player2Container.classList.add('loser');
            player2Container.classList.remove('winner');
            winnerTextElement.textContent = `${player1.name} Wins!`;
        } else if (player2.score > player1.score) {
            player2Container.classList.add('winner');
            player2Container.classList.remove('loser');
            player1Container.classList.add('loser');
            player1Container.classList.remove('winner');
            winnerTextElement.textContent = `${player2.name} Wins!`;
        } else {
            player1Container.classList.remove('winner', 'loser');
            player2Container.classList.remove('winner', 'loser');
            winnerTextElement.textContent = "It's a Tie!";
        }
    }
};

playAgainButton.addEventListener('click', () => {
    const latestGame = getLatestGame();
    if (!latestGame) {
        console.error("No game history found.");
        return;
    }
    // change hash to start the game by passing player names and mode in query params
    window.location.hash = `#game?player1=${encodeURIComponent(latestGame.player1.name)}&player2=${encodeURIComponent(latestGame.player2.name)}&mode=${encodeURIComponent(latestGame.mode)}`;
});

returnHomeButton.addEventListener('click', () => {
    window.location.hash = '#home';
});

export {displayEndGame};