// Called when the service worker is installed
chrome.runtime.onInstalled.addListener(() => {
    console.log("Service worker installed.");
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // Ensure the tab URL is defined and the page is fully loaded
    if (changeInfo.status === 'complete' && tab.url && tab.url.startsWith("https://oscaremr.quipohealth.com/oscar/")) {
        console.log("Page loaded:", tab.url);

        // Inject the content script
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ['contentScript.js']
        }, () => {
            if (chrome.runtime.lastError) {
                console.error("Script injection failed:", chrome.runtime.lastError);
            } else {
                console.log("Content script injected successfully.");
            }
        });
    }
});


// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "BUTTON_CLICKED") {
        console.log("Button clicked on the webpage:", request.details);
        sendResponse({ status: "Message received" });
    }
});

// Function to get the active tab
async function getActiveTab() {
    try {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tabs.length > 0) {
            console.log("Active tab:", tabs[0]);
        } else {
            console.log("No active tabs found.");
        }
    } catch (error) {
        console.error("Error retrieving active tab:", error);
    }
}

// Call the function to log the active tab
getActiveTab();
