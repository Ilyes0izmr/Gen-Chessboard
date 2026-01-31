/* eslint-disable no-restricted-globals */
import { runGeneticAlgorithm } from '../algorithms/GeneticAlgorithm';

self.onmessage = async (e) => {
  const params = e.data;

  let lastBestConflicts = Infinity;
  let lastSentVectorString = "";

  await runGeneticAlgorithm({
    maxGenerations: params.maxGen,
    targetConflicts: params.targetFitness,
    populationSize: params.popSize,
    crossoverProbability: params.crossoverProbability,
    mutationProbability: params.mutationProbability,
    
    onGenerationComplete: (generation, matrix, conflicts, vector ,conflictSquares) => {
      const currentVectorString = vector ? vector.join(',') : '';

      const isBetter = conflicts < lastBestConflicts;
      const isDifferent = conflicts === lastBestConflicts && currentVectorString !== lastSentVectorString;
      const isGoal = conflicts <= params.targetFitness;

      if (isBetter || isDifferent || isGoal) {
        lastBestConflicts = conflicts;
        lastSentVectorString = currentVectorString;

        self.postMessage({
          type: 'PROGRESS',
          generation,
          matrix,
          conflicts,
          conflictSquares,
        });
      }
    },
    onMessageUpdate: (message) => {
      self.postMessage({ type: 'MESSAGE', message });
    },
    shouldContinue: () => true 
  });

  self.postMessage({ type: 'FINISHED' });
  self.close(); 
};