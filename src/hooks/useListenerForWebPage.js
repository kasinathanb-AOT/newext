import { useEffect, useRef, useState } from "react";

const useChromeMessageListener = (onMessage, isMicOn) => {
    const [socket, setSocket] = useState(null);
    const audioChunksRef = useRef([]);
    const mediaRecorderRef = useRef(null);

    useEffect(() => {
        // Listener function to handle messages
        const handleMessage = (message) => {
            onMessage(message);
        };

        // Check if chrome is available
        if (typeof chrome !== "undefined" && chrome.runtime) {
            // Add listener for messages from the background script
            chrome.runtime.onMessage.addListener(handleMessage);
        }

        // Cleanup listener on unmount
        return () => {
            if (typeof chrome !== "undefined" && chrome.runtime) {
                chrome.runtime.onMessage.removeListener(handleMessage);
            }
        };
    }, [onMessage]);

}

export default useChromeMessageListener;
