chrome.runtime.onInstalled.addListener(() => {
    console.log("Service worker installed.");
});
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "BUTTON_CLICKED") {
        console.log("Button clicked on the webpage:", request.details);
        sendResponse({ status: "Message received" });
    }
});
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
        console.log("Active tab:", tabs[0]);
    } else {
        console.log("No active tabs found.");
    }
});
