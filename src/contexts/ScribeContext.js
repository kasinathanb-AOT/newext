
import React, { createContext, useContext, useState, useRef } from 'react';
import { scribeFactory } from '../services/scribe';

const ScribeContext = createContext();

export const ScribeProvider = ({ children }) => {
    const processorRef = useRef(null);
    const [transcriptText, setTranscriptText] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    function callback(data) {
        if (data && typeof data === "object") {
            const sortedValues = Object.entries(data)
                .sort(([keyA], [keyB]) => Number(keyA) - Number(keyB))
                .map(([key, value]) => value);
            setTranscriptText(sortedValues.join(" "));
        } else {
            console.error("Invalid data received:", data);
        }
    }

    const handleStart = () => {
        const mode = localStorage.getItem("API_MODE");

        const ScribeProcessor = scribeFactory({ live: mode });
        const newProcessor = new ScribeProcessor(
            process.env.REACT_APP_WS_URL,
            process.env.REACT_APP_SERVER_URL,
            callback
        );


        processorRef.current = newProcessor;

        processorRef.current.getMicrophoneAccess(() => {
            setIsRecording(true);
            setIsPaused(false);
            newProcessor.startRecording();
            console.log("Recording started");
        }, (error) => {
            console.error("Error while accessing microphone:", error);
        });
    };

    const handleStop = async () => {
        try {
            setIsRecording(false);
            setIsPaused(false);
            const newTranscript = await processorRef.current.stopRecording();
            console.log(newTranscript);
            setTranscriptText(newTranscript);
        } catch (error) {
            console.error('Error while processing transcription:', error);
        }
    };

    const handlePause = () => {
        if (processorRef.current && isRecording && !isPaused) {
            processorRef.current.pauseRecording();
            setIsPaused(true);
            console.log("Recording paused");
        }
    };

    const handleResume = () => {
        if (processorRef.current && isRecording && isPaused) {
            processorRef.current.resumeRecording();
            setIsPaused(false);
            console.log("Recording resumed");
        }
    };

    return (
        <ScribeContext.Provider value={{ isRecording, isPaused, transcriptText, handleStart, handleStop, handlePause, handleResume }}>
            {children}
        </ScribeContext.Provider>
    );
};

export const useScribe = () => useContext(ScribeContext);