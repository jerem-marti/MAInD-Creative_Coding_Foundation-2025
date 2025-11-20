import { getLocalStorageItem, setLocalStorageItem } from './localStorage.js';

const history = new Map();

const initializeHistory = () => {
    const storedHistory = getLocalStorageItem('pongGameHistory');
    if (storedHistory) {
        storedHistory.forEach(({ timestamp, ...record }) => {
            history.set(timestamp, record);
        });
    }
}

const getHistory = () => {
    return Array.from(history.entries()).map(([timestamp, record]) => ({ timestamp, ...record }));
}

const getLatestGame = () => {
    const historyArray = getHistory();
    return historyArray.length > 0 ? historyArray[historyArray.length - 1] : null;
}

const saveHistory = () => {
    const historyArray = getHistory();
    setLocalStorageItem('pongGameHistory', historyArray);
}

const addGameResultToHistory = (player1Name, player1Score, player2Name, player2Score, mode) => {
    if (!player1Name || !player2Name || player1Score === undefined || player2Score === undefined) {
        throw new Error("Both Player1 and Player2 data must be provided.");
    } else if (typeof player1Score !== 'number' || typeof player2Score !== 'number') {
        throw new Error("Scores must be numbers.");
    } else if (mode !== 'Single Player' && mode !== 'Two Players') {
        console.error("Invalid game mode:", mode);
        throw new Error("Game mode must be either 'Single Player' or 'Two Players'.");
    }
    const timestamp = new Date().toISOString();
    history.set(timestamp, { 
        player1: { name: player1Name, score: player1Score }, 
        player2: { name: player2Name, score: player2Score },
        mode
    });
    saveHistory();
}

export { addGameResultToHistory, getHistory, getLatestGame, initializeHistory, saveHistory };