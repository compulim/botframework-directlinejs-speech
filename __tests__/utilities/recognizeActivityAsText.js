import readCognitiveServicesAudioStreamAsWAVFile from './readCognitiveServicesAudioStreamAsWAVFile';
import recognizeWAVFile from './recognizeWAVFile';

export default async function recognizeActivityAsText(activity) {
  const riffWAVBuffer = await readCognitiveServicesAudioStreamAsWAVFile(activity.channelData.utterance.audioStream);

  return await recognizeWAVFile(riffWAVBuffer);
}
