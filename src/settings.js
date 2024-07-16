document.addEventListener('DOMContentLoaded', () => {
    const apiKeyInput = document.getElementById('apiKey')
    const saveButton = document.getElementById('save');

    chrome.storage.local.get(['apiKey'], (result) => {
        if (result.apiKey) {
            apiKeyInput.value = result.apiKey;
        }
    });

    saveButton.addEventListener('click', () => {
        const apiKey = apiKeyInput.value.trim();
        if (apiKey) {
            chrome.storage.local.set({ apiKey: apiKey }, () => {
                alert('API key updated successfully!');
            });
        } else {
            alert('Please enter a valid API key.');
        }
    });
});