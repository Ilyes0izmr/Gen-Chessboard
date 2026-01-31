import { calculateConflictsWithData, calculateFitness } from './Fitness';
import { convertBoardToVector, generateRandomBoard } from './BoardGeneration';
import { rouletteWheelSelection } from './Selection';
import { performCrossover } from './Crossover';
import { performMutation } from './Mutation';

const conflictCache = new Map();

export async function runGeneticAlgorithm({
  maxGenerations,
  targetConflicts,
  populationSize,
  onGenerationComplete,
  crossoverProbability,
  mutationProbability,
  onMessageUpdate,
}) {
  conflictCache.clear();

  let population = generatePopulation(populationSize);
  let bestIndividual = null;

  if (onMessageUpdate) onMessageUpdate("AI is thinking...");

  for (let generation = 1; generation <= maxGenerations; generation++) {
    
    population.forEach((individual) => {
      const key = individual.vector.join(',');

      // 1. Efficiency: Check Cache for full conflict data
      if (individual.conflictData === undefined) {
        if (conflictCache.has(key)) {
          individual.conflictData = conflictCache.get(key);
        } else {
          //eturns { totalConflicts: X, conflictSquares: [[r,c],...] }
          individual.conflictData = calculateConflictsWithData(individual.matrix);
          conflictCache.set(key, individual.conflictData);
        }
        //totalConflicts back to .conflicts for easier access
        individual.conflicts = individual.conflictData.totalConflicts;
      }
      
      // Calculate fitness using the updated function
      if (!individual.fitness) {
        const fitnessResult = calculateFitness(individual.matrix);
        // Ensure we handle both object or number returns
        individual.fitness = typeof fitnessResult === 'object' ? fitnessResult.fitness : fitnessResult;
      }
    });

    // Find the best individual
    const currentBest = population.reduce((best, individual) =>
      individual.conflicts < best.conflicts ? individual : best
    );

    if (!bestIndividual || currentBest.conflicts <= bestIndividual.conflicts) {
      bestIndividual = currentBest;
    }

    // 2. Throttled UI Updates + Conflict Path Data
    if (onGenerationComplete && (generation % 10 === 0 || currentBest.conflicts <= targetConflicts)) {
      await onGenerationComplete(
        generation, 
        bestIndividual.matrix, 
        bestIndividual.conflicts, 
        bestIndividual.vector,
        bestIndividual.conflictData.conflictSquares 
      );
    }

    if (currentBest.conflicts <= targetConflicts) {
      if (onMessageUpdate) onMessageUpdate("AI found a solution!");
      return bestIndividual.matrix;
    }

    // 3. Evolution
    const parentPairs = rouletteWheelSelection(population);
    const offspring = performCrossover(parentPairs, crossoverProbability);
    const mutatedOffspring = performMutation(offspring, mutationProbability);

    population = mutatedOffspring;
  }

  if (onMessageUpdate) onMessageUpdate("Max generations reached.");
  return bestIndividual.matrix;
}

export function generatePopulation(popSize) {
  const uniqueIndividuals = [];
  const seen = new Set();

  while (uniqueIndividuals.length < popSize) {
    const matrix = generateRandomBoard();
    const vector = convertBoardToVector(matrix);
    const key = vector.join(',');

    if (!seen.has(key)) {
      seen.add(key);
      const conflictData = calculateConflictsWithData(matrix);
      const fitnessResult = calculateFitness(matrix);
      
      uniqueIndividuals.push({ 
        matrix, 
        vector, 
        conflicts: conflictData.totalConflicts, 
        conflictData: conflictData,
        fitness: typeof fitnessResult === 'object' ? fitnessResult.fitness : fitnessResult 
      });
      
      conflictCache.set(key, conflictData);
    }
  }

  return uniqueIndividuals;
}