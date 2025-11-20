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
        const dateItem = document.createElement('span');
        dateItem.textContent = `[${date.toLocaleString()}]`;
        
        const modeItem = document.createElement('span');
        modeItem.textContent = `Mode: ${mode}`;
        
        const player1Item = document.createElement('span');
        player1Item.textContent = `${player1.name} (${player1.score})`;
        
        const vsItem = document.createElement('span');
        vsItem.textContent = " vs ";
        
        const player2Item = document.createElement('span');
        player2Item.textContent = `${player2.name} (${player2.score})`;
        
        if(player1.score > player2.score) {
            player1Item.classList.add('winner');
            player2Item.classList.add('loser');
        } else if(player2.score > player1.score) {
            player2Item.classList.add('winner');
            player1Item.classList.add('loser');
        }
        
        listItem.prepend(dateItem);
        listItem.appendChild(modeItem);
        listItem.appendChild(player1Item);
        listItem.appendChild(vsItem);
        listItem.appendChild(player2Item);
        historyListElement.appendChild(listItem);
    });
}

historyClearButton.addEventListener('click', () => {
    clearHistory();
    displayHistory();
});

export {displayHistory};