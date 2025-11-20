import PongGame from "../class/PongGame";
import Player from "../class/Player";

let pongGame;

const displayGame = () => {

    // NEED TO PLACE THE FULLSCREEN ON USER ACTION
    const canvas = document.querySelector('canvas');
    // Ask to fullscreen
    if (!document.fullscreenElement) {
        canvas.requestFullscreen();
    } else if (document.documentElement.webkitRequestFullscreen) { /* Safari */
        canvas.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) { /* IE11 */
        canvas.msRequestFullscreen();
    }
    //////////////////////////////////////////////

    const player1 = new Player("Player 1");
    const player2 = new Player("Player 2");
    
    pongGame = new PongGame(player1, player2);
    pongGame.start();
};

export {displayGame};