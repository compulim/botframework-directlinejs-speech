import Observable from 'core-js/features/observable';

import shareObservable from './shareObservable';
import SpeechSynthesisAudioStreamUtterance from './SpeechSynthesisAudioStreamUtterance';

function randomActivityId() {
  return Math.random().toString(36).substr(2);
}

export default class DirectLineSpeech {
  constructor({
    dialogServiceConnector,
    eventSource
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
      // console.log('dialogServiceConnector.activityReceived', activity);

      try {
        this._activityObserver && this._activityObserver.next({
          ...activity,
          channelData: {
            ...activity.channelData,
            ...(audioStream ? { utterance: new SpeechSynthesisAudioStreamUtterance(audioStream) } : {}),
            directLineSpeechAudioStream: audioStream
          },
          from: {
            ...activity.from,
            role: 'bot'
          },
          // Direct Line Speech server currently do not timestamp outgoing activities.
          // Thus, it will be easier to just re-timestamp every incoming/outgoing activities using local time.
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error(error);
      }
    };

    // Speech recognition may recognized the text, but the outgoing activities was not echoed back from Direct Line Speech servers.
    // Thus, all recognized text need to be synthetically add to "activity$".
    eventSource.addEventListener('recognized', ({ text }) => {
      // console.log('eventSource.recognized', text);

      const timestamp = new Date().toISOString();

      // TODO: [P0] The "postActivity" come later the bot response, plus, the server did not timestamp the outgoing activity.
      //       Thus, the timestamp is incorrect. We are hacking by remembering the last recognized timestamp and timestamping it ourselves.

      // The "audiosourceoff" event is received later than bot response.
      // Although the "ServiceRecognizer.recognized" was on-time, the actual "speechRecognition.result" event was pretty late.
      this._lastRecognizedEventTimestamp = timestamp;
    });
  }

  getSessionId() { throw new Error('OAuth is not supported.'); }

  postActivity(activity) {
    // console.log('postActivity', activity);

    try {
      // TODO: [P1] Direct Line Speech server currently do not ack the outgoing activities with any activity ID or timestamp.
      const pseudoActivityId = randomActivityId();
      const isSpeech = !!(activity.channelData && activity.channelData.speech);

      // Do not send the activity if it was from speech
      if (!isSpeech) {
        this.dialogServiceConnector.sendActivityAsync(activity);
      }

      this._activityObserver && this._activityObserver.next({
        ...activity,
        id: pseudoActivityId,
        timestamp: (isSpeech && this._lastRecognizedEventTimestamp) || new Date().toISOString()
      });

      this._lastRecognizedEventTimestamp = null;

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
