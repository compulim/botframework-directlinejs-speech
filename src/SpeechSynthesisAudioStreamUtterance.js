import EventTarget, { defineEventAttribute } from './external/event-target-shim';

export default class SpeechSynthesisAudioStreamUtterance extends EventTarget {
  constructor(audioStream) {
    super();

    if (typeof audioStream !== 'string') {
      this.audioStream = audioStream;
    }
  }
}

defineEventAttribute(SpeechSynthesisAudioStreamUtterance, 'boundary');
defineEventAttribute(SpeechSynthesisAudioStreamUtterance, 'end');
defineEventAttribute(SpeechSynthesisAudioStreamUtterance, 'error');
defineEventAttribute(SpeechSynthesisAudioStreamUtterance, 'start');
