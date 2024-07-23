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
  .overlay.hide {
    opacity: 0;
    pointer-events: none;
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
  .banner {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background-color: #ff5555;
    color: white;
    font-family: Arial, sans-serif;
    text-align: center;
    padding: 20px;
    display: none;
    z-index: 2147483647;
    transition: transform 0.3s ease-in-out;
    transform: translateY(-100%);
    font-size: 24px;
    font-weight: bold;
  }
  .banner.show {
    display: block;
    transform: translateY(0);
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
continueBtn.textContent = 'Ignore warning';
overlay.appendChild(continueBtn);

// Create the banner element
const banner = document.createElement('div');
banner.className = 'banner';
shadow.appendChild(banner);

// Handle the continue button click
continueBtn.addEventListener('click', () => {
  overlay.classList.add('hide');
  setTimeout(() => {
    overlay.classList.remove('show', 'hide');
    banner.classList.add('show');
    banner.textContent = message.textContent;
    document.body.style.marginTop = `${banner.offsetHeight}px`;
  }, 300); // Duration of the transition
});

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "blockSite") {
    message.textContent = request.message;
    overlay.classList.add('show');
  } else if (request.action === "showError") {
    alert(request.message);
  }
});