import 'global-agent/bootstrap';

import createTestHarness from './utilities/createTestHarness';
import MockAudioContext from './utilities/MockAudioContext';
import recognizeActivityAsText from './utilities/recognizeActivityAsText';
import subscribeAll from './utilities/observable/subscribeAll';
import take from './utilities/observable/take';
import waitForConnected from './utilities/waitForConnected';

beforeEach(() => {
  global.AudioContext = MockAudioContext;
});

jest.setTimeout(10000);

test('should echo back when saying "hello" and "world"', async () => {
  const { directLine, recognizeText } = await createTestHarness();

  const connectedPromise = waitForConnected(directLine);
  const activitiesPromise = subscribeAll(take(directLine.activity$, 2));

  await connectedPromise;

  await recognizeText('hello');
  await recognizeText('world');

  const activities = await activitiesPromise;
  const activityUtterances = Promise.all(activities.map(activity => recognizeActivityAsText(activity)));

  await expect(activityUtterances).resolves.toMatchInlineSnapshot(`
    Array [
      "Hello.",
      "World.",
    ]
  `);
});
