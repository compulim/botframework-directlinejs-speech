import createDeferred from './utilities/createDeferred';
import createDirectLineSpeechWithUtterance from './utilities/createDirectLineSpeechWithUtterance';
import recognizeOnce from './utilities/recognizeOnce';

jest.setTimeout(10000);

describe('send speech to bot using SSML', () => {
  let directLine, webSpeechPonyfillFactory;
  let connectedDeferred;
  let subscriptions = [];

  beforeEach(async () => {
    const result = await createDirectLineSpeechWithUtterance('Hello.');

    directLine = result.directLine;
    webSpeechPonyfillFactory = result.webSpeechPonyfillFactory;

    connectedDeferred = createDeferred();
    subscriptions = [];

    subscriptions.push(
      directLine.connectionStatus$.subscribe({
        next: value => value === 2 && connectedDeferred.resolve()
      })
    );
  });

  test('', async () => {
    subscriptions.push(
      directLine.activity$.subscribe({
        next: activity => console.log(activity)
      })
    );

    await connectedDeferred.promise;
    await recognizeOnce(webSpeechPonyfillFactory());

    // TODO: Wait for incoming activity
  });

  afterEach(() => {
    subscriptions.forEach(subscription => subscription.unsubscribe());
  });
});
