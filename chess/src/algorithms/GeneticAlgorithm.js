// src/algorithms/GeneticAlgorithm.js
import { calculateConflicts, calculateFitness } from './Fitness';
import { convertBoardToVector, generateRandomBoard } from './BoardGeneration';
import { rouletteWheelSelection } from './Selection';
import { performCrossover } from './Crossover';
import { performMutation } from './Mutation';
import { sleep } from '../utils/helpers'; 

/**
 * Runs the genetic algorithm for a specified number of generations or until the target number of conflicts is achieved.
 *
 * @param {Object} options - Configuration options for the genetic algorithm.
 * @param {number} options.maxGenerations - Maximum number of generations to run.
 * @param {number} options.targetConflicts - Target number of conflicts to achieve.
 * @param {number} options.populationSize - Size of the population.
 * @param {Function} options.onGenerationComplete - Callback to execute after each generation.
 * @param {number} options.crossoverProbability - Probability of crossover (0-1).
 * @param {number} options.mutationProbability - Probability of mutation (0-1).
 * @returns {Array<Array<string|null>>} - The best individual found (as an 8x8 matrix).
 */
export async function runGeneticAlgorithm({
  maxGenerations,
  targetConflicts,
  populationSize,
  onGenerationComplete,
  crossoverProbability,
  mutationProbability,
  onMessageUpdate, // New callback for updating messages
}) {
  let population = generatePopulation(populationSize);
  let bestIndividual = null;

  console.log(`Starting genetic algorithm with maxGenerations=${maxGenerations}, targetConflicts=${targetConflicts}, populationSize=${populationSize} ,proba=${crossoverProbability}, ${mutationProbability}`);

  // Notify that AI is thinking
  if (onMessageUpdate) onMessageUpdate("AI is thinking...");

  for (let generation = 1; generation <= maxGenerations; generation++) {
    console.log(`\n--- Generation ${generation} started ---`);

    // Evaluate conflicts and fitness for the current population
    population.forEach((individual) => {
      if (!individual.conflicts) {
        individual.conflicts = calculateConflicts(individual.matrix);
      }
      if (!individual.fitness) {
        individual.fitness = calculateFitness(individual.matrix);
      }
    });

    // Find the best individual in the current population
    const currentBest = population.reduce((best, individual) =>
      individual.conflicts < best.conflicts ? individual : best
    );

    // Update the global best individual if necessary
    if (!bestIndividual || currentBest.conflicts <= bestIndividual.conflicts) {
      bestIndividual = currentBest;
    }

    console.log(`Best individual in generation ${generation}:`, {
      conflicts: bestIndividual.conflicts,
      fitness: bestIndividual.fitness,
    });
    

    // Notify the UI about the current generation's progress
    if (onGenerationComplete) {
      const bestBoardMatrix = bestIndividual.matrix;
      const bestConflicts = bestIndividual.conflicts; // Pass conflicts value
      if (Array.isArray(bestBoardMatrix) && bestBoardMatrix.length === 8) {
        await onGenerationComplete(generation, JSON.parse(JSON.stringify(bestBoardMatrix)), bestConflicts); // Include conflicts
      } else {
        console.error('Invalid best board matrix:', bestBoardMatrix);
      }
    }

    // Check stopping conditions
    if (currentBest.conflicts <= targetConflicts) {
      console.log(`Target conflicts (${targetConflicts}) achieved in generation ${generation}. Stopping algorithm.`);
      if (onMessageUpdate) onMessageUpdate("AI finished calculation!"); // Notify completion
      return JSON.parse(JSON.stringify(bestIndividual.matrix)); // Deep copy
    }

    // Perform selection, crossover, and mutation
    const parentPairs = rouletteWheelSelection(population);
    const offspring = performCrossover(parentPairs, crossoverProbability);
    const mutatedOffspring = performMutation(offspring, mutationProbability);

    population = mutatedOffspring;

    console.log(`--- Generation ${generation} ended ---`);

    // Introduce a delay to make updates visible
    await sleep(5); // Delay of 5ms
  }

  console.log('Maximum generations reached. Returning best individual found.');
  if (onMessageUpdate) onMessageUpdate("AI finished calculation!"); // Notify completion
  return JSON.parse(JSON.stringify(bestIndividual.matrix)); // Deep copy
}

/**
 * Generates a population of random chessboards with both matrix and vector representations.
 *
 * @param {number} popSize - The size of the population (number of boards).
 * @returns {Array<Object>} - An array of objects, where each object contains:
 *                            - matrix: The 8x8 chessboard matrix.
 *                            - vector: The vector representation of the chessboard.
 *                            - fitness: The fitness score of the chessboard.
 */
export function generatePopulation(popSize) {
  const population = [];

  for (let i = 0; i < popSize; i++) {
    const matrix = generateRandomBoard();
    const vector = convertBoardToVector(matrix);
    const conflicts = calculateConflicts(matrix);
    const fitness = calculateFitness(matrix);
    population.push({ matrix, vector, conflicts, fitness });
  }

  return population;
}
