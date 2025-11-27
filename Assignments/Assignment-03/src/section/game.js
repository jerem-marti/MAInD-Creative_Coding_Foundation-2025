/**
 * @fileoverview Game section module for initializing and managing the Pong game.
 * This module creates player instances, initializes the PongGame, and handles
 * game lifecycle events including fullscreen management and navigation to end game.
 */

import PongGame from "../class/PongGame";
import Player from "../class/Player";
import { getAvatarUrlEncoded } from "../utils/avatar";

/**
 * Current PongGame instance.
 * Holds the active game object for the duration of a match.
 * @type {PongGame|undefined}
 */
let pongGame;

/**
 * Displays and starts a new Pong game with the specified players and mode.
 * Creates Player instances, initializes the PongGame, sets up the end game handler,
 * and starts the game loop. When the game ends, exits fullscreen mode and navigates
 * to the end game screen.
 * 
 * @function displayGame
 * @param {string} [player1Name="Player 1"] - Name of the first player
 * @param {string} [player2Name="Player 2"] - Name of the second player
 * @param {string} [mode="Single Player"] - Game mode (e.g., "Single Player", "Multiplayer")
 */
const displayGame = async (player1Name = "Player 1", player2Name = "Player 2", mode = "Single Player") => {

    const player1 = new Player(player1Name);
    const player2 = new Player(player2Name);
    
    // Generate avatar URLs from player names
    const player1AvatarUrlEncoded = await getAvatarUrlEncoded(player1Name);
    const player2AvatarUrlEncoded = await getAvatarUrlEncoded(player2Name);
    
    pongGame = new PongGame(player1, player2, mode, player1AvatarUrlEncoded, player2AvatarUrlEncoded);
    pongGame.onEnded(() => {
        // quit fullscreen
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
        window.location.hash = '#end-game';
    });
    pongGame.start();
};

/**
 * Exported function to display and start a new game.
 * @exports displayGame
 */
export {displayGame};