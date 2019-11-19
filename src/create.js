import {
  BotFrameworkConfig,
  DialogServiceConnector,
  OutputFormat,
  PropertyId
} from 'microsoft-cognitiveservices-speech-sdk';

import createWebSpeechPonyfillFactory from './createWebSpeechPonyfillFactory';
import DirectLineSpeech from './DirectLineSpeech';
import patchDialogServiceConnectorInline from './patchDialogServiceConnectorInline';

export default function create({
  audioConfig,
  audioContext,
  lang = 'en-US',
  speechServicesAuthorizationToken,
  speechServicesRegion,
  speechServicesSubscriptionKey,
  userID,
  username
}) {
  if (
    (!speechServicesAuthorizationToken && !speechServicesSubscriptionKey)
    || (speechServicesAuthorizationToken && speechServicesSubscriptionKey)
  ) {
    throw new Error('You must specify either "speechServicesAuthorizationToken" or "speechServicesSubscriptionKey" only.');
  }

  if (userID || username) {
    throw new Error('Direct Line Speech do not support custom "userId" and "username".');
  }

  let config;

  if (speechServicesAuthorizationToken) {
    config = BotFrameworkConfig.fromAuthorizationToken(speechServicesAuthorizationToken, speechServicesRegion);
  } else {
    config = BotFrameworkConfig.fromSubscription(speechServicesSubscriptionKey, speechServicesRegion);
  }

  config.setProperty(PropertyId.SpeechServiceConnection_RecoLanguage, lang);

  // TODO: Checks if this outputFormat is being used or not.
  config.outputFormat = OutputFormat.Detailed;

  const dialogServiceConnector = patchDialogServiceConnectorInline(new DialogServiceConnector(config, audioConfig));

  dialogServiceConnector.connect();

  const directLine = new DirectLineSpeech({ dialogServiceConnector });

  const webSpeechPonyfillFactory = createWebSpeechPonyfillFactory({
    audioConfig,
    audioContext,
    // enableTelemetry,
    recognizer: dialogServiceConnector,
    // speechRecognitionEndpointId,
    // speechSynthesisDeploymentId,
    // speechSynthesisOutputFormat,
    // textNormalization
  });

  // setTimeout(() => {
  //   console.log('Closing');
  //   directLine.end();
  // }, 5000);

  // setTimeout(() => {
  //   console.log('Closing in 1 second');
  // }, 4000);

  return {
    directLine,
    webSpeechPonyfillFactory
  };
}
