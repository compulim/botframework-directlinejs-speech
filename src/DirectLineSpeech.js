import Observable from 'core-js/features/observable';

import shareObservable from './shareObservable';

// function sleep(ms = 1000) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

export default class DirectLineSpeech {
  constructor({
    dialogServiceConnector
  }) {
    let connectionStatusObserver;

    this.dialogServiceConnector = dialogServiceConnector;

    this.activity$ = shareObservable(new Observable(observer => {
      this._activityObserver = observer;
      connectionStatusObserver.next(0);
      connectionStatusObserver.next(1);
      connectionStatusObserver.next(2);

      return () => {};
    }));

    this.connectionStatus$ = shareObservable(new Observable(observer => {
      connectionStatusObserver = observer;

      return () => {};
    }));

    dialogServiceConnector.activityReceived = (_, { activity, audioStream }) => {
      console.log(`activityReceived`, activity);

      this._activityObserver && this._activityObserver.next(activity);
    };
  }

  getSessionId() { return Observable.of(); }
  postActivity(activity) {
    try {
      // TODO: Consider server echoing back the activity, because of timestamp clockskew issue.
      const pseudoActivityId = Math.random().toString(36).substr(2);

      this.dialogServiceConnector.sendActivityAsync(activity);

      this._activityObserver && this._activityObserver.next({
        ...activity,
        id: pseudoActivityId,
        timestamp: new Date().toISOString()
      });

      return Observable.of(pseudoActivityId);
    } catch (err) {
      return new Observable(observer => observer.error(err));
    }
  }
}

// connectionStatus$: BehaviorSubject<ConnectionStatus>,
// activity$: Observable<Activity>,
// end(): void,
// referenceGrammarId?: string,
// postActivity(activity: Activity): Observable<string>,
// getSessionId? : () => Observable<string>
