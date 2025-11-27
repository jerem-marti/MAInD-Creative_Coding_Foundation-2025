/**
 * A class representing a player in the game with a name and score tracking.
 * Uses private fields to encapsulate player data.
 * 
 * @class Player
 */
export default class Player {
    /**
     * Private field storing the player's name.
     * @type {string}
     * @private
     */
    #name;
    
    /**
     * Private field storing the player's current score.
     * @type {number}
     * @private
     */
    #score = 0;
    
    /**
     * Creates a new Player instance.
     * 
     * @constructor
     * @param {string} [name="Player"] - The name of the player
     */
    constructor(name = "Player") {
        this.#name = name;
        this.#score = 0;
    }

    /**
     * Gets the player's name.
     * 
     * @method getName
     * @returns {string} The player's name
     */
    getName() {
        return this.#name;
    }

    /**
     * Gets the player's current score.
     * 
     * @method getScore
     * @returns {number} The player's current score
     */
    getScore() {
        return this.#score;
    }

    /**
     * Increments the player's score by 1.
     * 
     * @method incrementScore
     */
    incrementScore() {
        this.#score += 1;
    }

    /**
     * Resets the player's score to 0.
     * 
     * @method resetScore
     */
    resetScore() {
        this.#score = 0;
    }
}