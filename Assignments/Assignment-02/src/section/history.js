import { getHistory, clearHistory } from "../utils/historyManager";

const historyListElement = document.getElementById('history-list');
const historyClearButton = document.getElementById('history-clear-button');

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

historyClearButton.addEventListener('click', () => {
    clearHistory();
    displayHistory();
});

export {displayHistory};