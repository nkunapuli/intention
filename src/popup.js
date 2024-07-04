document.addEventListener('DOMContentLoaded', () => {
  const intentionInput = document.getElementById('intention');
  const saveButton = document.getElementById('save');
  const noIntentionButton = document.getElementById('noIntention');

  // Load current intention
  chrome.storage.local.get(['intention'], (result) => {
    if (result.intention) {
      intentionInput.value = result.intention;
    } else {
      intentionInput.value = '';
      intentionInput.placeholder = 'No intention';
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

  noIntentionButton.addEventListener('click', () => {
    chrome.storage.local.set({intention: ''}, () => {
      window.close();
    });
  });
});