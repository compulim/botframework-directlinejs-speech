import {
  AudioConfig,
  BotFrameworkConfig,
  DialogServiceConnector,
  OutputFormat,
  PropertyId
} from 'microsoft-cognitiveservices-speech-sdk';

import createWebSpeechPonyfillFactory from './createWebSpeechPonyfillFactory';
import DirectLineSpeech from './DirectLineSpeech';
import patchDialogServiceConnectorInline from './patchDialogServiceConnectorInline';

export default function create({
  audioConfig = AudioConfig.fromDefaultMicrophoneInput(),
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
    throw new Error('You must specify either speechServicesAuthorizationToken or speechServicesSubscriptionKey only.');
  }

  let config;

  if (speechServicesAuthorizationToken) {
    config = BotFrameworkConfig.fromAuthorizationToken(speechServicesAuthorizationToken, speechServicesRegion);
  } else {
    config = BotFrameworkConfig.fromSubscription(speechServicesSubscriptionKey, speechServicesRegion);
  }

  config.setProperty(PropertyId.SpeechServiceConnection_RecoLanguage, lang);

  config.outputFormat = OutputFormat.Detailed;

  const dialogServiceConnector = patchDialogServiceConnectorInline(new DialogServiceConnector(config, audioConfig));

  dialogServiceConnector.connect();

  return {
    directLine: new DirectLineSpeech({
      dialogServiceConnector,
      userID,
      username
    }),
    webSpeechPonyfillFactory: createWebSpeechPonyfillFactory({
      audioConfig,
      // enableTelemetry,
      recognizer: dialogServiceConnector,
      // speechRecognitionEndpointId,
      // speechSynthesisDeploymentId,
      // speechSynthesisOutputFormat,
      // textNormalization
    })
  };
}
