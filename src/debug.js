let logContainer = document.getElementById('logContainer');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "log") {
        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry';
        logEntry.innerHTML = `
        <h3>${new Date().toLocaleString()}</h3>
        <p><strong>Intention:</strong> ${request.intention}</p>
        <p><strong>URL:</strong> ${request.url}</p>
        <pre>${request.fullResponse}</pre>
        `;
        logContainer.prepend(logEntry);
    }
});