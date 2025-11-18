import PongGame from "../class/PongGame";

let pongGame;

const displayGame = () => {
    pongGame = new PongGame();
    pongGame.start();
};

export {displayGame};