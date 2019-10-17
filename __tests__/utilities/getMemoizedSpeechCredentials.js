import fetchSpeechCredentials from './fetchSpeechCredentials';

let credentialsPromise;

export default async function getMemoizedSpeechCredentials() {
  if (!credentialsPromise) {
    credentialsPromise = fetchSpeechCredentials({
      region: process.env.SPEECH_SERVICES_REGION,
      subscriptionKey: process.env.SPEECH_SERVICES_SUBSCRIPTION_KEY
    });
  }

  return await credentialsPromise;
}
