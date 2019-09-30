import {
  AudioConfig,
  CognitiveSubscriptionKeyAuthentication,
  // DialogConnectorFactory,
  DialogServiceConfig,
  DialogServiceConnector,
  PropertyId
} from 'microsoft-cognitiveservices-speech-sdk';

import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';
import Observable from 'core-js/features/observable';

import shareObservable from './shareObservable';

export default class DirectLineSpeech {
  constructor({
    secret,
    token,
    speechServicesAuthorizationToken,
    speechServicesRegion,
    speechServicesSubscriptionKey
  }) {
    if (token) {
      throw new Error('Direct Line token is not supported.');
    }

    this.activity$ = shareObservable(new Observable(observer => {
      try {
        const { connectionStatusObserver } = this;

        connectionStatusObserver.next(1);

        const config = DialogServiceConfig.fromBotSecret(secret, speechServicesSubscriptionKey || 'DUMMY', speechServicesRegion);

        config.setProperty(PropertyId.SpeechServiceConnection_RecoLanguage, 'en-US');

        if (speechServicesAuthorizationToken) {
          config.setProperty(PropertyId.speechServicesSubscriptionKey, null);
          config.setProperty(PropertyId.SpeechServiceAuthorization_Token, speechServicesAuthorizationToken);
        }

        const connector = new DialogServiceConnector(config);

        // connector.connect(); // This is not implemented.
        connector.privReco.connect();

        connectionStatusObserver.next(2);
      } catch (err) {
        console.error(err);
        observer.error(err);
      }
    }));

    this.connectionStatus$ = shareObservable(new Observable(observer => {
      this.connectionStatusObserver = observer;
    }));

    console.log(this);
  }
}

// connectionStatus$: BehaviorSubject<ConnectionStatus>,
// activity$: Observable<Activity>,
// end(): void,
// referenceGrammarId?: string,
// postActivity(activity: Activity): Observable<string>,
// getSessionId? : () => Observable<string>
