export const FullAudioTranscriber = (Base) =>
  class extends Base {
    processRecording() {
      this.audioBlob = new Blob(this.audioChunks, {
        type: this.config?.mimeType,
      });
      this.audioFile = new File([this.audioBlob], "recording.webm", {
        type: this.config?.mimeType,
      });
      this.audioChunks = [];
      return this.audioFile;
    }

    async transcribeFullAudio(setTranscriptText, setIsDictationChanged) {
      this.audioFile = this.processRecording();
      if (!this.audioFile) {
        throw new Error("No audio file to transcribe");
      }
      const formData = new FormData();
      formData.append("files", this.audioFile);

      const maxRetries = 3;
      let attempt = 0;
      let success = false;
      let resultText = null;

      while (attempt < maxRetries && !success) {
        attempt++;
        try {
          const response = await fetch(`${this.baseURL}/transcribe`, {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const result = await response.json();

          if (result.length > 0 && result[0].text) {
            resultText = result[0].text;
            setTranscriptText(resultText);
            setIsDictationChanged(true);
            success = true;
          } else {
            setIsDictationChanged(true);
            resultText = result[0]?.text || null;
            success = true;
          }
        } catch (error) {
          console.log(`Attempt ${attempt} failed: ${error.message}`);
          await new Promise(resolve => setTimeout(resolve, 1000)); //waiting for 1 sec to next try
        }
      }

      if (!success) {
        this.logData("Transcription failed after multiple attempts.");
        // setIsDictationChanged(false);
        throw new Error("Transcription failed after multiple attempts.");
      }
      return resultText;
    }
  };
