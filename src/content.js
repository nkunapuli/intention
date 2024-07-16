chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "showWarning") {
      const warning = document.createElement('div');
      warning.textContent = request.message;
      warning.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        padding: 20px;
        background-color: #ff5555;
        color: #ffffff;
        text-align: center;
        font-size: 24px;
        font-weight: bold;
        z-index: 9999999;
      `;
      document.body.appendChild(warning);
//      setTimeout(() => warning.remove(), 5000);
    }
  });