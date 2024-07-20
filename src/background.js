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
    chrome.tabs.create({ url: chrome.runtime.getURL("src/setup.html") });
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
                chrome.tabs.sendMessage(tabId, {action: "showWarning", message: `Remember your intention: ${result.intention}`});
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
    try {
      const { apiKey } = await chrome.storage.local.get('apiKey');
      if (!apiKey) {
        throw new Error('API key not set. Please set your API key in the extension settings.');
      }

      const prompt1 = `
      You are an AI assistant that helps users adhere to their stated intention and stay focused and on task while browsing the web. 
      I will present you with an intention and a URL. 
      You will visit the URL and determine if its content is in alignment with the user's intention or not. 
      Please respond with only 'yes' or 'no'.
      `;

      const prompt2 = `
      You are an AI assistant that helps users adhere to their stated intention and stay focused and on task while browsing the web.
      I will present with you with an intention and a URL. 
      Please follow these steps.
      1. Visit the URL. (You have this capability.)
      2. Briefly describe the main content and purpose of the website.
      3. List ways in which the website aligns with the user's intention.
      4. List ways in which the website might not align with the intention, or could be a distraction.
      5. Make an assessment of whether or not the intention and uRL are aligned, and present your argument for why.

      After all of this, on a separate and final line, make a final decision about whether or not the intention is in alignment with the URL.
      Please respond with a single word: 'yes' or 'no'.
      `;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{
            role: "system",
            content: prompt2
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
      const fullResponse = data.choices[0].message.content.trim();
      const lastWord = fullResponse.split('\n').pop().toLowerCase();

      // send log message
      chrome.runtime.sendMessage({
        action: "log",
        intention: intention,
        url: url,
        fullResponse: fullResponse
      });

      return lastWord === 'yes';

    } catch (error) {
      console.error('Error in API request:', error);
      throw error; // Re-throw the error to be caught in the calling function
    }
  }