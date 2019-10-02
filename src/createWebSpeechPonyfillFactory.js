const { createSpeechRecognitionPonyfillFromRecognizer } = window.WebSpeechCognitiveServices;

export default function ({
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
