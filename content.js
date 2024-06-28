chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "showWarning") {
      const warning = document.createElement('div');
      warning.textContent = request.message;
      warning.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        padding: 10px;
        background-color: #ffcccc;
        color: #ff0000;
        text-align: center;
        z-index: 9999;
      `;
      document.body.appendChild(warning);
      setTimeout(() => warning.remove(), 5000);
    }
  });