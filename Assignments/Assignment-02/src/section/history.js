/**
 * @fileoverview History section module for displaying and managing game history.
 * This module retrieves game history from localStorage and dynamically renders it as a list,
 * showing game dates, player names, scores, and winner/loser styling.
 * Provides functionality to clear the entire game history.
 */

import { getHistory, clearHistory } from "../utils/historyManager";

/**
 * HTML list element that contains all game history items.
 * @type {HTMLUListElement}
 */
const historyListElement = document.getElementById('history-list');

/**
 * HTML button element for clearing all game history.
 * @type {HTMLButtonElement}
 */
const historyClearButton = document.getElementById('history-clear-button');

/**
 * Displays the game history by rendering each game as a list item.
 * Retrieves history from localStorage and creates DOM elements for each game entry,
 * including timestamp, player names, scores, and winner/loser styling.
 * If no history exists, displays a "No game history available" message.
 * 
 * @function displayHistory
 */
const displayHistory = () => {
    const history = getHistory();
    historyListElement.innerHTML = ''; // Clear existing history

    if (history.length === 0) {
        const noHistoryItem = document.createElement('li');
        noHistoryItem.textContent = "No game history available.";
        historyListElement.appendChild(noHistoryItem);
        return;
    }
    history.forEach(({ timestamp, player1, player2, mode }) => {
        const listItem = document.createElement('li');

        const date = new Date(timestamp);
        const dateItem = document.createElement('p');
        dateItem.classList.add('date');
        dateItem.textContent = `[${date.toLocaleString()}]`;
        
        // const modeItem = document.createElement('span');
        // modeItem.textContent = `Mode: ${mode}`;

        const scoreContainer = document.createElement('div');
        scoreContainer.classList.add('score-container');
        
        const player1Name = document.createElement('span');
        player1Name.textContent = `${player1.name}`;

        const score = document.createElement('span');
        score.textContent = `( ${player1.score} : ${player2.score} )`;

        const player2Name = document.createElement('span');
        player2Name.textContent = `${player2.name}`;
        
        
        if(player1.score > player2.score) {
            player1Name.classList.add('winner');
            player2Name.classList.add('loser');
        } else if(player2.score > player1.score) {
            player2Name.classList.add('winner');
            player1Name.classList.add('loser');
        }
        
        listItem.prepend(dateItem);
        // listItem.appendChild(modeItem);
        scoreContainer.appendChild(player1Name);
        scoreContainer.appendChild(score);
        scoreContainer.appendChild(player2Name);
        listItem.appendChild(scoreContainer);
        historyListElement.appendChild(listItem);
    });
}

/**
 * Event listener for the clear history button.
 * Clears all game history from localStorage and refreshes the display.
 * 
 * @listens click
 */
historyClearButton.addEventListener('click', () => {
    clearHistory();
    displayHistory();
});

/**
 * Exported function to display the game history.
 * @exports displayHistory
 */
export {displayHistory};