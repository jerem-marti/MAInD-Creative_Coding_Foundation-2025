import PongGame from "../class/PongGame";

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
    
    pongGame = new PongGame();
    pongGame.start();
};

export {displayGame};