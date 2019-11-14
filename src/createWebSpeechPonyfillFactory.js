// TODO: Use package instead of bundle
const { createSpeechRecognitionPonyfillFromRecognizer } = window.WebSpeechCognitiveServices;

import { AudioStreamFormat } from 'microsoft-cognitiveservices-speech-sdk';
import AbortController from 'abort-controller';

import createErrorEvent from './createErrorEvent';
import createTaskQueue from './createTaskQueue';
import EventTargetShim, { defineEventAttribute } from './external/event-target-shim';
import playCognitiveServicesStream from './playCognitiveServicesStream';
import playWhiteNoise from './playWhiteNoise';
import SpeechSynthesisAudioStreamUtterance from './SpeechSynthesisAudioStreamUtterance';

export default function ({
  audioConfig,
  enableTelemetry,
  recognizer,
  // speechRecognitionEndpointId,
  // speechSynthesisDeploymentId,
  // speechSynthesisOutputFormat,
  textNormalization
}) {
  // return ({ referenceGrammarID }) => {
  return () => {
    const { SpeechGrammarList, SpeechRecognition } = createSpeechRecognitionPonyfillFromRecognizer({
      audioConfig,
      createRecognizer: () => recognizer,
      enableTelemetry,
      looseEvents: true,
      // enableTelemetry,
      // referenceGrammars: [`luis/${referenceGrammarID}-PRODUCTION`],
      // speechRecognitionEndpointId,
      // speechSynthesisDeploymentId,
      // speechSynthesisOutputFormat,
      textNormalization
    });

    const audioContext = new AudioContext();
    const audioFormat = AudioStreamFormat.getDefaultInputFormat();

    const { cancelAll, push } = createTaskQueue();

    class SpeechSynthesis extends EventTargetShim {
      getVoices() {
        return [];
      }

      cancel() {
        cancelAll();
      }

      speak(utterance) {
        push(() => {
          const { abort, signal } = new AbortController();

          return {
            abort,
            result: (async () => {
              utterance.dispatchEvent(new Event('start'));

              try {
                if (utterance.audioStream) {
                  const { streamReader } = utterance.audioStream;

                  await playCognitiveServicesStream(audioContext, audioFormat, streamReader, { signal });
                } else {
                  await playWhiteNoise(audioContext);
                }
              } catch (error) {
                utterance.dispatchEvent(createErrorEvent(error));
              }

              utterance.dispatchEvent(new Event('end'));
            })()
          };
        });
      }
    }

    defineEventAttribute(SpeechSynthesis, 'voiceschanged');

    return {
      SpeechGrammarList,
      SpeechRecognition,
      speechSynthesis: new SpeechSynthesis(),
      SpeechSynthesisUtterance: SpeechSynthesisAudioStreamUtterance
    };
  }
}
