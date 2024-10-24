import { useEffect } from "react";

export const useChromeMessageListener = (onMessage) => {
    useEffect(() => {
        const handleMessage = (message) => {
            onMessage(message);
        };
        if (typeof chrome !== "undefined" && chrome.runtime) {
            chrome.runtime.onMessage.addListener(handleMessage);
        }
        return () => {
            if (typeof chrome !== "undefined" && chrome.runtime) {
                chrome.runtime.onMessage.removeListener(handleMessage);
            }
        };
    }, [onMessage]);
}

