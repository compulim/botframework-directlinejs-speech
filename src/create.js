import {
  AudioConfig,
  BotFrameworkConfig,
  DialogServiceConnector,
  OutputFormat,
  PropertyId
} from 'microsoft-cognitiveservices-speech-sdk';

import createWebSpeechPonyfillFactory from './createWebSpeechPonyfillFactory';
import DirectLineSpeech from './DirectLineSpeech';

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

  // HACK: Setup use of "auto reply" bot to test
  // config.setProperty("Conversation_Communication_Type", "AutoReply");

  config.outputFormat = OutputFormat.Detailed;

  const dialogServiceConnector = new DialogServiceConnector(config, audioConfig);

  dialogServiceConnector.connect();

  // HACK: startContinuousRecognitionAsync is not working yet, use listenOnceAsync instead
  dialogServiceConnector.startContinuousRecognitionAsync = (resolve, reject) => {
    dialogServiceConnector.listenOnceAsync(({ text }) => {
      const recognizedEvent = new Event('recognized');

      recognizedEvent.text = text;
    }, err => {
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
