// TODO: Use package instead of bundle
const { createSpeechRecognitionPonyfillFromRecognizer } = window.WebSpeechCognitiveServices;

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
      // enableTelemetry,
      // referenceGrammars: [`luis/${referenceGrammarID}-PRODUCTION`],
      // speechRecognitionEndpointId,
      // speechSynthesisDeploymentId,
      // speechSynthesisOutputFormat,
      textNormalization
    });

    return {
      SpeechGrammarList,
      SpeechRecognition
    };
  }
}
