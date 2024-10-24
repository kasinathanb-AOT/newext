export const WhisperLive = (Base) =>
  class extends Base {
    wsOnMessage(e) {
      const data = JSON.parse(e?.data);

      if ("segments" in data) {
        for (const segment in data.segments) {
          if (data.segments[segment].text !== " Thanks for watching!") {
            this.speechSegments[data.segments[segment].start] =
              data.segments[segment].text;
          }
        }
      } else if (data.message === "SERVER_READY") {
        this.isServerReady = true;
      }

      this.cb(this.speechSegments);
    }

    async transmitAudioToWS(stream) {
      await this.context.audioWorklet.addModule("/worklets/audioProcessor.js");
      const mediaStream = this.context.createMediaStreamSource(stream);
      const audioProcessor = new AudioWorkletNode(
        this.context,
        "audio-processor"
      );
      this.initializeMediaRecorder(stream);

      audioProcessor.port.onmessage = (event) => {
        const audioData16kHz = event.data;
        if (this.connectionActive && this.ws?.readyState === WebSocket.OPEN) {
          this.ws.send(audioData16kHz);
        }
      };

      mediaStream.connect(audioProcessor);
      audioProcessor.connect(this.context.destination);
    }

    startRecording() {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        this.initWSConnection(this.wsUrl);
      }

      this.context = new (window.AudioContext ||
        window.webkitAudioContext ||
        window.mozAudioContext ||
        window.oAudioContext ||
        window.msAudioContext)();

      try {
        navigator.mediaDevices
          .getUserMedia({ audio: true, video: false })
          .then((stream) => this.transmitAudioToWS(stream));
      } catch (error) {
        this.logData("Error during recording initialization:", error);
      }
    }

    pauseRecording() {
      if (this.context && this.context.state !== "closed") {
        this.context.suspend().then(() => {
          this.mediaRecorder.pause();
          this.logData("Recording paused.");
        });
      }
    }

    resumeRecording() {
      if (this.context && this.context.state !== "closed") {
        this.context.resume().then(() => {
          this.mediaRecorder.resume();
          this.logData("Recording resumed.");
        });
      }
    }

    async stopRecording(setTranscriptText, setIsDictationChanged) {
      try {
        if (this.context && this.context.state !== "closed") {
          await this.context.close();
          this.mediaRecorder.stop();
          if (this.ws?.readyState === WebSocket.OPEN) {
            this.logData("Closing WebSocket connection.");
            this.ws.close();
          }
          await this.transcribeFullAudio(
            setTranscriptText,
            setIsDictationChanged
          );

          return "Recording stopped and transcribed successfully.";
        } else {
          const errorMessage = "No active context or context already closed.";
          this.logData(errorMessage);
          throw new Error(errorMessage);
        }
      } catch (error) {
        this.logData(`Error in stopRecording: ${error.message}`);
        throw error;
      }
    }
  };
