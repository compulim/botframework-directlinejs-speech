import fetchSpeechCredentials from './fetchSpeechCredentials';
import fetchSpeechCredentialsFromWaterBottle from './fetchSpeechCredentialsFromMockBot';

let credentialsPromise;

export default async function getMemoizedSpeechCredentials() {
  if (!credentialsPromise) {
    const { SPEECH_SERVICES_REGION, SPEECH_SERVICES_SUBSCRIPTION_KEY } = process.env;

    if (SPEECH_SERVICES_REGION && SPEECH_SERVICES_SUBSCRIPTION_KEY) {
      credentialsPromise = fetchSpeechCredentials({
        region: process.env.SPEECH_SERVICES_REGION,
        subscriptionKey: process.env.SPEECH_SERVICES_SUBSCRIPTION_KEY
      });
    } else {
      credentialsPromise = fetchSpeechCredentialsFromWaterBottle();
    }
  }

  return await credentialsPromise;
}
