// Create a container for the shadow DOM
const container = document.createElement('div');
container.style.cssText = `
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2147483647;
  pointer-events: none;
`;
document.body.appendChild(container);

// Create a shadow DOM
const shadow = container.attachShadow({mode: 'open'});

// Create a style element for the shadow DOM
const style = document.createElement('style');
style.textContent = `
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 85, 85, 0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    color: white;
    font-family: Arial, sans-serif;
    text-align: center;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
    pointer-events: none;
  }
  .overlay.show {
    opacity: 1;
    pointer-events: auto;
  }
  .message {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  .continue-btn {
    background-color: white;
    color: #ff5555;
    border: none;
    padding: 10px 20px;
    font-size: 18px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  .continue-btn:hover {
    background-color: #f0f0f0;
  }
`;
shadow.appendChild(style);

// Create the overlay element
const overlay = document.createElement('div');
overlay.className = 'overlay';
shadow.appendChild(overlay);

// Create the message element
const message = document.createElement('div');
message.className = 'message';
overlay.appendChild(message);

// Create the continue button
const continueBtn = document.createElement('button');
continueBtn.className = 'continue-btn';
continueBtn.textContent = 'Continue Anyway';
continueBtn.addEventListener('click', () => {
  overlay.classList.remove('show');
});
overlay.appendChild(continueBtn);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "blockSite") {
    message.textContent = request.message;
    overlay.classList.add('show');
  } else if (request.action === "showError") {
    alert(request.message);
  }
});