document.addEventListener('DOMContentLoaded', () => {
    const apiKeyInput = document.getElementById('apiKey');
    const saveButton = document.getElementById('save');

    saveButton.addEventListener('click', () => {
        const apiKey = apiKeyInput.value.trim();
        if (apiKey) {
            chrome.storage.local.set({ apiKey: apiKey }, () => {
                alert('API key saved successfully!');
                window.close();
                chrome.runtime.sendMessage({ action: "openPopup" });
            });
        } else {
            alert('Please enter a valid API key.');
        }
    });
});