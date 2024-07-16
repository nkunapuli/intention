document.addEventListener('DOMContentLoaded', () => {
  const intentionInput = document.getElementById('intention');
  const saveButton = document.getElementById('save');
  const noIntentionButton = document.getElementById('noIntention');
  const settingsLink = document.getElementById('settingsLink');

  // Load current intention
  chrome.storage.local.get(['intention'], (result) => {
    if (result.intention) {
      intentionInput.value = result.intention;
    } else {
      intentionInput.value = '';
      intentionInput.placeholder = 'No intention set.';
    }
  });

  saveButton.addEventListener('click', () => {
    const intention = intentionInput.value.trim();
    if (intention) {
      chrome.storage.local.set({intention: intention}, () => {
        window.close();
      });
    }
  });

  settingsLink.addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL("src/settings.html")});
  });

  noIntentionButton.addEventListener('click', () => {
    chrome.storage.local.set({intention: ''}, () => {
      window.close();
    });
  });
});