export const DeepgramLive = (Base) =>
  class extends Base {
    wsOnMessage(e) {
      const data = e?.data;
      if (Object.keys(this.speechSegments).length === 0) {
        this.speechSegments[1] = data;
      } else {
        this.speechSegments[1] = this.speechSegments[1] + " " + data;
      }
      this.cb(this.speechSegments);
    }

    mediaRecorderOnDataAvailable(e) {
      this.audioChunks.push(e.data);
      this.ws.send(e.data);
    }

    startRecording() {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        this.initWSConnection(this.wsUrl);
        this.ws.onopen = (e) => {
          this.wsOnOpen(e);
          this.logData("WebSocket connected, starting recording...");
          navigator.mediaDevices
            .getUserMedia({ audio: true, video: false })
            .then((stream) => {
              this.initializeMediaRecorder(stream);
              if (this.mediaRecorder) {
                this.logData(`MediaRecorder initialized with state: ${this.mediaRecorder.state} and id: ${this.mediaRecorder.stream.id}`);
              } else {
                this.logData("MediaRecorder could not be initialized.");
              }
            })
            .catch((error) => {
              this.logData("Error accessing microphone:", error);
            });
        };
      } else {
        this.logData("WebSocket is already open, starting recording...");
        // Get user media for audio
        navigator.mediaDevices
          .getUserMedia({ audio: true, video: false })
          .then((stream) => {
            this.initializeMediaRecorder(stream);
            if (this.mediaRecorder) {
              this.logData(`MediaRecorder initialized with state: ${this.mediaRecorder.state} and id: ${this.mediaRecorder.stream.id}`);
            } else {
              this.logData("MediaRecorder could not be initialized.");
            }
          })
          .catch((error) => {
            this.logData("Error accessing microphone:", error);
          });
      }
    }

    pauseRecording() {
      this.mediaRecorder.pause();
      this.logData("Recording paused.");
    }

    resumeRecording() {
      this.mediaRecorder.resume();
      this.logData("Recording resumed.");
    }

    async stopRecording(setTranscriptText, setIsDictationChanged) {
      try {
        this.mediaRecorder.stop();
        await new Promise((resolve) => {
          this.mediaRecorder.onstop = resolve;
        });
        this.logData(`MediaRecorder stopped with state: ${this.mediaRecorder.state}`);
        if (this.mediaRecorder.stream) {
          this.mediaRecorder.stream.getTracks().forEach((track) => {
            if (track.readyState === 'live') {
              this.logData(`Stopping track: ${track.kind}, track id: ${track.id}`);
              track.stop();
            }
          });
        }

        if (this.ws && this.ws.readyState !== WebSocket.CLOSED && this.ws.readyState !== WebSocket.CLOSING) {
          this.logData("Closing WebSocket connection.");
          this.ws.close();
        } else {
          this.logData("WebSocket is already closed or in the process of closing.");
        }

        // Transcribe the full audio
        const transcribeText = await this.transcribeFullAudio(setTranscriptText, setIsDictationChanged);
        return transcribeText;
      } catch (error) {
        this.logData(`Error in stopRecording: ${error.message}`);
        throw error;
      }
    }
  };
