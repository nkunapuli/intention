function openIntentionPopup() {
    chrome.windows.create({
      url: chrome.runtime.getURL("src/popup.html"),
      type: "popup",
      width: 400,
      height: 300
    });
  }

  chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ intention: '' });
  });

  chrome.runtime.onStartup.addListener(() => {
    chrome.storage.local.set({ intention: '' });
    openIntentionPopup();
  });
  
  chrome.windows.onCreated.addListener((window) => {
    if (window.type === "normal") {
      chrome.storage.local.get(['intention'], (result) => {
        if (!result.intention) {
          openIntentionPopup();
        }
      });
    }
  });
  
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
      chrome.storage.local.get(['intention'], (result) => {
        if (result.intention) {
          checkAlignment(tab.url, result.intention)
            .then(alignment => {
              if (alignment === false) {
                chrome.tabs.sendMessage(tabId, {action: "showWarning", message: "This website might not align with your intention."});
              }
            })
            .catch(error => {
              console.error('Error in alignment check:', error);
              chrome.tabs.sendMessage(tabId, {action: "showWarning", message: `Error checking alignment: ${error.message}`});
            });
        }
      });
    }
  });
  
  async function checkAlignment(url, intention) {
    const API_KEY = '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'; // Replace with your actual API key
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [{
            role: "system",
            content: "You are an AI assistant that helps users adhere to their stated intention and stay focused and on task while browsing the web. I will present you with an intention and a URL. You will visit the URL and determine if its content is in alignment with the user's intention or not. Be strict in your interpretation. Please respond with only 'yes' or 'no'."
          }, {
            role: "user",
            content: `Intention: ${intention}\nURL: ${url}`
          }]
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API request failed: ${response.status} ${response.statusText}. ${errorData.error?.message || ''}`);
      }
  
      const data = await response.json();
      return data.choices[0].message.content.toLowerCase() === 'yes';
    } catch (error) {
      console.error('Error in API request:', error);
      throw error; // Re-throw the error to be caught in the calling function
    }
  }