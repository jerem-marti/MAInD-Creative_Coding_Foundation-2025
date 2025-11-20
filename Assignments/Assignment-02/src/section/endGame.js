import { getLatestGame } from "../utils/historyManager";

const winnerTextElement = document.getElementById('end-game-winner-text');
const player1UsernameElement = document.getElementById('end-game-player1-username');
const player2UsernameElement = document.getElementById('end-game-player2-username');
const scoreElement = document.getElementById('end-game-score');
const playAgainButton = document.getElementById('end-game-play-again-button');

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

playAgainButton.addEventListener('click', () => {
    const latestGame = getLatestGame();
    if (!latestGame) {
        console.error("No game history found.");
        return;
    }
    // change hash to start the game by passing player names and mode in query params
    window.location.hash = `#game?player1=${encodeURIComponent(latestGame.player1.name)}&player2=${encodeURIComponent(latestGame.player2.name)}&mode=${encodeURIComponent(latestGame.mode)}`;
});

export {displayEndGame};
