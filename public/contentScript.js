console.log("DOM fully loaded and parsed");

// Inject the React app CSS when the page loads
const reactAppCSS = document.createElement("link");
reactAppCSS.rel = "stylesheet";
reactAppCSS.href = chrome.runtime.getURL("static/css/main.css");
document.head.appendChild(reactAppCSS);
console.log("CSS injected");

// Create the button element
const injectButton = document.createElement("button");
injectButton.id = "openReactApp";
injectButton.className = "initButton";
console.log("Button created");

// Create the image element and append it inside the button
const buttonImage = document.createElement("img");
buttonImage.src = chrome.runtime.getURL("./media/logo512.png");
buttonImage.alt = "Logo";
buttonImage.style.width = "32px";
buttonImage.style.height = "32px";
injectButton.appendChild(buttonImage);
console.log("Image added to button");

// Try to append the button to the first div inside body, fallback to body if no div found
const firstDiv = document.body.querySelector("div");
if (firstDiv) {
    firstDiv.appendChild(injectButton);
} else {
    document.body.appendChild(injectButton);
}

// Add event listener to button
injectButton.addEventListener("click", () => {
    // Check if the React app is already loaded
    if (!document.getElementById("react-chrome-extension")) {
        console.log("Loading React app...");

        // Create the React app container
        const appDiv = document.createElement("div");
        appDiv.id = "react-chrome-extension";
        appDiv.className = "react-ext-container custom-scrollbar";
        document.body.appendChild(appDiv);

        // Inject the React app script only if it hasn't been added already
        const existingScript = document.getElementById("react-app-script");
        if (!existingScript) {
            const reactAppScript = document.createElement("script");
            reactAppScript.id = "react-app-script";
            reactAppScript.src = chrome.runtime.getURL("static/js/main.js");

            // Ensure React app mounts after the script is loaded
            reactAppScript.onload = () => {
                console.log("React app script loaded successfully.");

                // Dispatch an event or call a function to tell the React app to mount
                const event = new Event('reactAppLoaded');
                window.dispatchEvent(event); // You can listen for this in your React code if needed
            };

            // Log if there is an error loading the script
            reactAppScript.onerror = () => {
                console.error("Failed to load the React app script.");
            };

            document.body.appendChild(reactAppScript);
        } else {
            console.log("React app script is already loaded.");
        }
    } else {
        console.log("React app is already loaded.");
    }
});

// Global event listener for clicks, logging button clicks and image clicks
document.addEventListener('click', (event) => {
    const target = event.target.closest('button, img');
    if (target && (target.id === 'openReactApp' || target.tagName === 'IMG')) {
        const buttonDetails = {
            buttonText: target.innerText || 'Image',
            buttonId: target.id || target.closest('button').id,
        };
        console.log("Button clicked: ", buttonDetails);
        chrome.runtime.sendMessage({ type: 'BUTTON_CLICKED', details: buttonDetails });
    }
});
