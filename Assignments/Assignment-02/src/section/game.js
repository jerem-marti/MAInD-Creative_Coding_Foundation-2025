import PongGame from "../class/PongGame";
import Player from "../class/Player";

let pongGame;

const displayGame = (player1Name = "Player 1", player2Name = "Player 2", mode = "Single Player") => {

    const player1 = new Player(player1Name);
    const player2 = new Player(player2Name);
    
    pongGame = new PongGame(player1, player2, mode);
    pongGame.onEnded(() => {
        // quit fullscreen
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
        window.location.hash = '#end-game';
    });
    pongGame.start();
};

export {displayGame};