import createDeferred from './createDeferred';

export default async function recognizeOnce({ SpeechRecognition }) {
  const recognition = new SpeechRecognition();
  const recognitionEndDeferred = createDeferred();

  recognition.onend = recognitionEndDeferred.resolve;

  // TODO: Remove console.log
  recognition.onresult = ({ results }) => console.log(results);
  recognition.start();

  // TODO: Remove console.log
  recognition.addEventListener('end', () => {
    console.log('end');
  });

  // TODO: Remove console.log
  recognition.addEventListener('result', event => {
    console.log(event);
  });

  await recognitionEndDeferred.promise;
}
