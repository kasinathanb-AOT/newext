// Inject the React app CSS when the page loads
const reactAppCSS = document.createElement("link");
reactAppCSS.rel = "stylesheet";
reactAppCSS.href = chrome.runtime.getURL("static/css/main.6e59a139.css");
document.head.appendChild(reactAppCSS);

// Create the button element
const injectButton = document.createElement("button");
injectButton.innerText = "Open React App";
injectButton.id = "openReactApp";
injectButton.className = "initButton";

document.body.appendChild(injectButton);

injectButton.addEventListener("click", () => {
    if (!document.getElementById("react-chrome-extension")) {
        const appDiv = document.createElement("div");
        appDiv.id = "react-chrome-extension";
        appDiv.className = "react-app-container";
        document.body.appendChild(appDiv);
        const reactAppScript = document.createElement("script");
        reactAppScript.src = chrome.runtime.getURL("static/js/main.c8f7ad07.js");
        document.body.appendChild(reactAppScript);
    }
});

// Listener for the button click
document.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {
        const buttonDetails = {
            buttonText: event.target.innerText,
            buttonId: event.target.id,
        };
        chrome.runtime.sendMessage({ type: 'BUTTON_CLICKED', details: buttonDetails });
    }
});
