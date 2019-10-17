import fetch from 'node-fetch';

const TOKEN_URL_TEMPLATE = 'https://{region}.api.cognitive.microsoft.com/sts/v1.0/issueToken';

export default async function fetchAuthorizationToken({ region, subscriptionKey }) {
  const res = await fetch(TOKEN_URL_TEMPLATE.replace(/\{region\}/u, region), {
    headers: {
      'Ocp-Apim-Subscription-Key': subscriptionKey
    },
    method: 'POST'
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch authorization token, server returned ${res.status}`);
  }

  return {
    authorizationToken: await res.text(),
    region
  };
}
