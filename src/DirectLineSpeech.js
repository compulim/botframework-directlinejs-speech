import Observable from 'core-js/features/observable';

import shareObservable from './shareObservable';

// function sleep(ms = 1000) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

export default class DirectLineSpeech {
  constructor({
    dialogServiceConnector
  }) {
    let activityObserver;
    let connectionStatusObserver;

    this.activity$ = shareObservable(new Observable(observer => {
      activityObserver = observer;
      connectionStatusObserver.next(0);
      connectionStatusObserver.next(1);
      connectionStatusObserver.next(2);

      return () => {};
    }));

    this.connectionStatus$ = shareObservable(new Observable(observer => {
      connectionStatusObserver = observer;

      return () => {};
    }));

    dialogServiceConnector.activityReceived = (_sender, { activity }) => {
      const { messagePayload } = JSON.parse(activity);

      messagePayload.type = 'message';

      activityObserver && activityObserver.next(messagePayload);
    };
  }

  getSessionId() { return Observable.of(); }
  postActivity() { return Observable.of(); }
}

// connectionStatus$: BehaviorSubject<ConnectionStatus>,
// activity$: Observable<Activity>,
// end(): void,
// referenceGrammarId?: string,
// postActivity(activity: Activity): Observable<string>,
// getSessionId? : () => Observable<string>
