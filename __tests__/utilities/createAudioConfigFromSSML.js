import { AudioConfig } from 'microsoft-cognitiveservices-speech-sdk';

import fetchSpeechData from './fetchSpeechData';

export default async function createAudioConfigFromSSML(text) {
  const file = new File([await fetchSpeechData({ text })], 'test.wav');

  return AudioConfig.fromWavFileInput(file);
}
