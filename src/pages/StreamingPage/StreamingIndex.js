// pages/StreamingIndex.js
import React from 'react';
import { useScribe } from '../../contexts/ScribeContext';
import './StreamingIndex.scss';

export const StreamingIndex = () => {
    const { isRecording, isPaused, transcriptText, handleStart, handleStop, handlePause, handleResume } = useScribe();

    return (
        <div className="streaming-index">
            <div className="transcription-container">
                <h3>Live Transcription:</h3>
                <p className="transcript-text">{transcriptText}</p>
            </div>
            <div className="button-container">
                {!isRecording ? (
                    <button onClick={handleStart} className="myextBtn">
                        Turn On Mic
                    </button>
                ) : isPaused ? (
                    <button onClick={handleResume} className="myextBtn">
                        Resume
                    </button>
                ) : (
                    <>
                        <button onClick={handlePause} className="myextBtn">
                            Pause
                        </button>
                        <button onClick={handleStop} className="myextBtn">
                            Turn Off Mic
                        </button>
                    </>
                )}
            </div>

        </div>
    );
};
