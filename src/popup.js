document.getElementById('save').addEventListener('click', () => {
    const intention = document.getElementById('intention').value;
    chrome.storage.local.set({intention: intention}, () => {
      chrome.runtime.sendMessage({action: "intentionSet"});
      window.close();
    });
  });