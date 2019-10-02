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

function sleep(ms = 1000) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default class DirectLineSpeech {
  constructor({
    dialogServiceConnector
  }) {
    let connectionStatusObserver;

    this.activity$ = shareObservable(new Observable(async _observer => {
      connectionStatusObserver.next(0);

      await sleep(100);

      connectionStatusObserver.next(1);

      await sleep(100);

      connectionStatusObserver.next(2);
    }));

    this.connectionStatus$ = shareObservable(new Observable(observer => {
      connectionStatusObserver = observer;
    }));
  }
}

// connectionStatus$: BehaviorSubject<ConnectionStatus>,
// activity$: Observable<Activity>,
// end(): void,
// referenceGrammarId?: string,
// postActivity(activity: Activity): Observable<string>,
// getSessionId? : () => Observable<string>
