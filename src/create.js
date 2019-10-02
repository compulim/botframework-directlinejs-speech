import {
  // AudioConfig,
  // CognitiveSubscriptionKeyAuthentication,
  // DialogConnectorFactory,
  DialogServiceConfig,
  DialogServiceConnector,
  PropertyId
} from 'microsoft-cognitiveservices-speech-sdk';

// import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';

import DirectLineSpeech from './DirectLineSpeech';
import createWebSpeechPonyfillFactory from './createWebSpeechPonyfillFactory';

export default function create({
  secret,
  speechServicesAuthorizationToken,
  speechServicesRegion,
  speechServicesSubscriptionKey,
  token
}) {
  if (token) {
    throw new Error('Direct Line token is not supported.');
  }

  const config = DialogServiceConfig.fromBotSecret(secret, speechServicesSubscriptionKey || 'DUMMY', speechServicesRegion);

  config.setProperty(PropertyId.SpeechServiceConnection_RecoLanguage, 'en-US');

  // HACK: Pass authorization token instead of subscription key
  if (speechServicesAuthorizationToken) {
    config.setProperty(PropertyId.speechServicesSubscriptionKey, null);
    config.setProperty(PropertyId.SpeechServiceAuthorization_Token, speechServicesAuthorizationToken);
  }

  const dialogServiceConnector = new DialogServiceConnector(config);

  dialogServiceConnector.connect();
  dialogServiceConnector.startContinuousRecognitionAsync = () => {
    console.log('startContinuousRecognitionAsync');
  }

  return {
    directLine: new DirectLineSpeech({ dialogServiceConnector }),
    webSpeechPonyfillFactory: createWebSpeechPonyfillFactory({
      // enableTelemetry,
      recognizer: dialogServiceConnector,
      // speechRecognitionEndpointId,
      // speechSynthesisDeploymentId,
      // speechSynthesisOutputFormat,
      // textNormalization
    })
  };
}
