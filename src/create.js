import {
  AudioConfig,
  // CognitiveSubscriptionKeyAuthentication,
  // DialogConnectorFactory,
  DialogServiceConfig,
  DialogServiceConnector,
  OutputFormat,
  PropertyId
} from 'microsoft-cognitiveservices-speech-sdk';

// import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';

import DirectLineSpeech from './DirectLineSpeech';
import createWebSpeechPonyfillFactory from './createWebSpeechPonyfillFactory';

export default function create({
  audioConfig = AudioConfig.fromDefaultMicrophoneInput(),
  lang,
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

  config.outputFormat = OutputFormat.Detailed;
  config.speechRecognitionLanguage = lang || window.navigator.language || 'en-US';

  const dialogServiceConnector = new DialogServiceConnector(config, audioConfig);

  dialogServiceConnector.connect();

  // HACK: startContinuousRecognitionAsync is not working yet, use listenOnceAsync instead
  dialogServiceConnector.startContinuousRecognitionAsync = (resolve, reject) => {
    dialogServiceConnector.listenOnceAsync(() => {}, err => {
      resolve = null;
      reject && reject(err);
    });

    reject = null;
    resolve && resolve();
  };

  // HACK: stopContinuousRecognitionAsync is not working yet.
  dialogServiceConnector.stopContinuousRecognitionAsync = resolve => {
    resolve && resolve();
  };

  return {
    directLine: new DirectLineSpeech({ dialogServiceConnector }),
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
