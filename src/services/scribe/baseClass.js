export class BaseClass {
  constructor(
    wsURL,
    aipURL,
    cb,
    config = { logging: true, streaSize: 500, mimeType: "audio/webm" }
  ) {
    this.cb = cb;
    this.wsUrl = wsURL;
    this.baseURL = aipURL;
    this.config = config;
    this.ws = null;
    this.connectionActive = false;
    this.isServerReady = false;
    this.speechSegments = {};
    this.audioChunks = [];
    this.audioFile = null;
    this.mediaOption = {};
    this.mediaRecorder = null;
    this.wsOnOpen = this.wsOnOpen.bind(this);
    this.wsOnClose = this.wsOnClose.bind(this);
    this.wsOnError = this.wsOnError.bind(this);
    this.wsOnMessage = this.wsOnMessage.bind(this);
    this.mediaRecorderOnDataAvailable =
      this.mediaRecorderOnDataAvailable.bind(this);
    this.mediaRecorderOnStop = this.mediaRecorderOnStop.bind(this);
    this.mediaRecorderOnError = this.mediaRecorderOnError.bind(this);
  }

  logData(...args) {
    if (this.config?.logging) {
      console.log("[scribe]: ", args);
    }
  }

  wsOnOpen(e) {
    this.connectionActive = true;
    this.logData("WebSocket connection established.", e);
  }

  wsOnClose(e) {
    if (e.wasClean) {
      this.logData(`WebSocket closed cleanly, code=${e.code}, reason=${e.reason}`);
    } else {
      this.logData(`WebSocket closed unexpectedly, code=${e.code}, reason=${e.reason}`);
    }
    this.connectionActive = false;
  }

  wsOnError(e) {
    this.connectionActive = false;
    this.logData("WebSocket error:", e);
  }

  wsOnMessage(e) {
    this.logData("ws messages", e);
    this.cb(e);
  }

  initWSConnection(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.ws.binaryType = "blob";

    this.ws.onopen = this.wsOnOpen;
    this.ws.onclose = this.wsOnClose;
    this.ws.onerror = this.wsOnError;
    this.ws.onmessage = this.wsOnMessage;
  }

  closeWSConnection() {
    if (this.ws && this.connectionActive) {
      this.logData("Closing WebSocket connection...");
      this.ws.close();
    }
  }

  mediaRecorderOnDataAvailable(e) {
    this.audioChunks.push(e.data);
  }

  mediaRecorderOnStop(e) {
    if (this.mediaRecorder.stream) {
      this.logData("Media recorder stoping...", e);
      this.mediaRecorder.stream.getTracks().forEach((track) => track.stop());
    }
    this.logData("Media recorder stopped.", e);
  }

  mediaRecorderOnError(e) {
    this.logData("Error while recording.", e);
  }

  initializeMediaRecorder(stream) {
    const isMacOS = navigator.userAgent.indexOf("Mac") > -1;
    this.mediaOption = isMacOS ? {} : { mimeType: this.config?.mimeType };
    this.logData(isMacOS, this.mediaOption)
    this.mediaRecorder = new MediaRecorder(stream, this.mediaOption);
    this.mediaRecorder.start(this.config?.streaSize);
    this.mediaRecorder.ondataavailable = this.mediaRecorderOnDataAvailable;
    this.mediaRecorder.onstop = this.mediaRecorderOnStop;
    this.mediaRecorder.onerror = this.mediaRecorderOnError;
  }

  async transcribeFullAudio(setTranscriptText, setIsDictationChanged) {
    this.logData(`Transcribing Full Audio:-`);
    setTranscriptText(null);
    setIsDictationChanged(true);
  }

  async getMicrophoneAccess(successCB, errorCB) {
    try {
      if (navigator.permissions && navigator.permissions.query) {
        try {
          const permission = await navigator.permissions.query({ name: "microphone" });
          if (permission.state === "granted") {
            successCB();
          } else if (permission.state === "prompt") {
            try {
              await navigator.mediaDevices.getUserMedia({ audio: true });
              successCB();
            } catch (err) {
              errorCB("Microphone access denied after prompt.");
            }
          } else {
            errorCB("Microphone access denied.");
          }
        } catch (err) {
          console.error("Permission query failed, falling back to getUserMedia");
          await this.fallbackToGetUserMedia(successCB, errorCB, err.message);
        }
      } else {
        console.log("Permissions API not supported, using getUserMedia directly.");
        await this.fallbackToGetUserMedia(successCB, errorCB);
      }
    } catch (err) {
      errorCB("Unexpected error: " + err.message);
    }
  }

  async fallbackToGetUserMedia(successCB, errorCB, message) {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      successCB();
    } catch (err) {
      errorCB("Microphone access denied or error occurred: " + (message ? message + "; " : "") + err.message);
    }
  }
}
