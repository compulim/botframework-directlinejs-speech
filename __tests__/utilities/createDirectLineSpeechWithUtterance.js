import createDirectLineSpeech from '../../src/create';
import createAudioConfigFromSSML from './createAudioConfigFromSSML';
import getMemoizedSpeechCredentials from './getMemoizedSpeechCredentials';

export default async function createDirectLineSpeechWithUtterance(utterance) {
  const [
    audioConfig,
    { authorizationToken: speechServicesAuthorizationToken, region: speechServicesRegion }
  ] = await Promise.all([createAudioConfigFromSSML(utterance), getMemoizedSpeechCredentials()]);

  return createDirectLineSpeech({
    audioConfig,
    // TODO: Update to use Direct Line token instead of secret
    secret: process.env.DIRECT_LINE_SPEECH_SECRET,
    speechServicesAuthorizationToken,
    speechServicesRegion
  });
}
