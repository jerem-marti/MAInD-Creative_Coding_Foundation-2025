/**
 * @fileoverview History manager module for managing Pong game history.
 * This module provides functionality to store, retrieve, and manage game results
 * using a Map structure and localStorage persistence. Game records are indexed by
 * ISO timestamp strings and contain player data (names and scores) and game mode.
 */

import { getLocalStorageItem, setLocalStorageItem } from './localStorage.js';

/**
 * Map storing game history records indexed by ISO timestamp strings.
 * Each record contains player1, player2 objects with name and score, and game mode.
 * @type {Map<string, {player1: {name: string, score: number}, player2: {name: string, score: number}, mode: string}>}
 */
const history = new Map();

/**
 * Initializes the history Map from localStorage.
 * Retrieves stored game history and populates the history Map with timestamp keys.
 * Should be called once at application startup.
 * 
 * @function initializeHistory
 */
const initializeHistory = () => {
    const storedHistory = getLocalStorageItem('pongGameHistory');
    if (storedHistory) {
        storedHistory.forEach(({ timestamp, ...record }) => {
            history.set(timestamp, record);
        });
    }
}

/**
 * Retrieves all game history records as an array.
 * Converts the history Map to an array of objects, each containing timestamp and game data.
 * 
 * @function getHistory
 * @returns {Array<{timestamp: string, player1: {avatar: string, name: string, score: number}, player2: {avatar: string, name: string, score: number}, mode: string}>} Array of game history records
 */
const getHistory = () => {
    return Array.from(history, ([timestamp, record]) => ({ timestamp, ...record })).toReversed();
}

/**
 * Retrieves the most recent game from history.
 * Returns the last element in the history array, or null if no games exist.
 * 
 * @function getLatestGame
 * @returns {{timestamp: string, player1: {name: string, score: number}, player2: {name: string, score: number}, mode: string}|null} The latest game record or null if history is empty
 */
const getLatestGame = () => {
    const historyArray = getHistory();
    console.log(historyArray);
    return historyArray.length > 0 ? historyArray[0] : null;
}

/**
 * Saves the current history Map to localStorage.
 * Converts the Map to an array and persists it using the localStorage utility.
 * 
 * @function saveHistory
 */
const saveHistory = () => {
    const historyArray = getHistory();
    setLocalStorageItem('pongGameHistory', historyArray);
}

/**
 * Clears all game history from both the Map and localStorage.
 * Removes all entries from the history Map and persists the empty state.
 * 
 * @function clearHistory
 */
const clearHistory = () => {
    history.clear();
    saveHistory();
};

/**
 * Adds a new game result to the history.
 * Creates a new history entry with the current timestamp and provided game data.
 * Validates that all required data is provided and that scores are numbers.
 * Validates that the game mode is either 'Single Player' or 'Two Players'.
 * Automatically saves the updated history to localStorage.
 * 
 * @function addGameResultToHistory
 * @param {string} player1Avatar - Avatar URL of player 1
 * @param {string} player1Name - Name of player 1
 * @param {number} player1Score - Final score of player 1
 * @param {string} player2Avatar - Avatar URL of player 2
 * @param {string} player2Name - Name of player 2
 * @param {number} player2Score - Final score of player 2
 * @param {string} mode - Game mode ('Single Player' or 'Two Players')
 * @throws {Error} If player names or scores are missing
 * @throws {Error} If scores are not numbers
 * @throws {Error} If game mode is not 'Single Player' or 'Two Players'
 */
const addGameResultToHistory = (player1Avatar, player1Name, player1Score, player2Avatar, player2Name, player2Score, mode) => {
    if (!player1Avatar || !player2Avatar || player1Avatar === '' || player2Avatar === '') {
        throw new Error("Both Player1 and Player2 avatars must be provided.");
    } else if (!player1Name || !player2Name) {
        throw new Error("Both Player1 and Player2 names must be provided.");
    } else if (player1Score === undefined || player2Score === undefined) {
        throw new Error("Both Player1 and Player2 scores must be provided.");
    } else if (typeof player1Score !== 'number' || typeof player2Score !== 'number') {
        throw new Error("Scores must be numbers.");
    } else if (mode !== 'Single Player' && mode !== 'Two Players') {
        console.error("Invalid game mode:", mode);
        throw new Error("Game mode must be either 'Single Player' or 'Two Players'.");
    }
    const timestamp = new Date().toISOString();
    history.set(timestamp, { 
        player1: { avatar: player1Avatar, name: player1Name, score: player1Score }, 
        player2: { avatar: player2Avatar, name: player2Name, score: player2Score },
        mode
    });
    saveHistory();
}

/**
 * Exported history management functions.
 * @exports addGameResultToHistory - Adds a game result to history
 * @exports getHistory - Retrieves all game history
 * @exports getLatestGame - Retrieves the most recent game
 * @exports initializeHistory - Initializes history from localStorage
 * @exports saveHistory - Saves history to localStorage
 * @exports clearHistory - Clears all history
 */
export { addGameResultToHistory, getHistory, getLatestGame, initializeHistory, saveHistory, clearHistory };