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
  lang = 'en-US',
  secret,
  speechServicesAuthorizationToken,
  speechServicesRegion,
  speechServicesSubscriptionKey,
  token
}) {
  if (token) {
    throw new Error('Direct Line token is not supported yet.');
  }

  if (
    (!speechServicesAuthorizationToken && !speechServicesSubscriptionKey)
    || (speechServicesAuthorizationToken && speechServicesSubscriptionKey)
  ) {
    throw new Error('You must specify either speechServicesAuthorizationToken or speechServicesSubscriptionKey only.');
  }

  const config = DialogServiceConfig.fromBotSecret(secret, speechServicesSubscriptionKey || 'DUMMY', speechServicesRegion);

  config.setProperty(PropertyId.SpeechServiceConnection_RecoLanguage, lang);

  // HACK: Setup use of "auto reply" bot to test
  // config.setProperty("Conversation_Communication_Type", "AutoReply");

  // HACK: Pass authorization token instead of subscription key
  if (speechServicesAuthorizationToken) {
    config.setProperty(PropertyId.SpeechServiceConnection_Key, null);
    config.setProperty(PropertyId.SpeechServiceAuthorization_Token, speechServicesAuthorizationToken);
  }

  config.outputFormat = OutputFormat.Detailed;

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
