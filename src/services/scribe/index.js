const { BaseClass } = require("./baseClass");
const { DeepgramLive } = require("./deppgramLive");
const { FullAudioTranscriber } = require("./fullAudioTranscriber");
const { WhisperLive } = require("./whisperLive");

const getLive = (Base, live) => {
  switch (live) {
    case "DEEPGRAM":
      return DeepgramLive(Base);
    case "WHISPER":
      return WhisperLive(Base);
    default:
      return DeepgramLive(Base);
  }
};

export const scribeFactory = (config = { live: "DEEPGRAM" }) => {
  const Live = getLive(BaseClass, config?.live);
  return FullAudioTranscriber(Live);
};
