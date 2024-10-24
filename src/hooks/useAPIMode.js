const getTranscriptionService = (name) => {
    switch (name) {
        case "deepgram":
            return "DEEPGRAM";
        case "transcribemanager":
            return "WHISPER";
        default:
            return "DEEPGRAM";
    }
};

export const useAPIMode = async () => {
    try {
        const apiUrl = `${process.env.REACT_APP_SERVER_URL}/config`;

        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        localStorage.setItem(
            "API_MODE",
            getTranscriptionService(data.transcription_service)
        );
    } catch (error) {
        console.error("Error while fetching the transcribe API mode", error);
        return null;
    }
};