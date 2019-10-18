import fetch from 'node-fetch';

export default async function fetchSpeechCredentialsFromWaterBottle() {
  const res = await fetch('https://webchat-waterbottle.azurewebsites.net/token/speechservices')

  if (!res.ok) {
    throw new Error(`Failed to fetch Cognitive Services Speech Services credentials, server returned ${ res.status }`);
  }

  const { region, token: authorizationToken } = await res.json();

  return { authorizationToken, region };
}
