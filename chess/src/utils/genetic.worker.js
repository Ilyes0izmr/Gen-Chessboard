import { runGeneticAlgorithm } from './GeneticAlgorithm';


self.onmessage = async (e) => {
  const params = e.data;

  await runGeneticAlgorithm({
    ...params,
    onGenerationComplete: (generation, matrix, conflicts) => {
      // send the data back to Home.js
      self.postMessage({
        type: 'PROGRESS',
        generation,
        matrix,
        conflicts,
      });
    },
    onMessageUpdate: (message) => {
      self.postMessage({ type: 'MESSAGE', message });
    },
    shouldContinue: () => true 
  });

  self.postMessage({ type: 'FINISHED' });
};