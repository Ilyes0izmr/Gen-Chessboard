// src/algorithms/GeneticAlgorithm.js
import { calculateConflicts, calculateFitness } from './Fitness';
import { convertBoardToVector, generateRandomBoard } from './BoardGeneration';
import { rouletteWheelSelection } from './Selection';
import { performCrossover } from './Crossover';
import { performMutation } from './Mutation';
import { sleep } from '../utils/helpers'; 

export async function runGeneticAlgorithm({
  maxGenerations,                               // Maximum number of generations
  targetConflicts,                              // target conflict
  populationSize,                               // Population size
  onGenerationComplete,                         // Callback for updating the UI
  crossoverProbability,                         // Crossover probability
  mutationProbability,                          // Mutation probability
  onMessageUpdate,                              // new callback for updating messages
}) {

  let population = generatePopulation(populationSize);  // we generate the initial population 
  let bestIndividual = null;                            // to track the best board found 
  //console.log(`Starting genetic algorithm with maxGenerations=${maxGenerations}, targetConflicts=${targetConflicts}, populationSize=${populationSize} ,proba=${crossoverProbability}, ${mutationProbability}`);

  if (onMessageUpdate) onMessageUpdate("AI is thinking..."); //update the UI with a message

  for (let generation = 1; generation <= maxGenerations; generation++) {
    //console.log(`\n--- Generation ${generation} started ---`);

    
    population.forEach((individual) => {
      if (!individual.conflicts) {
        individual.conflicts = calculateConflicts(individual.matrix);  // calculate conflicts
      }
      if (!individual.fitness) {
        individual.fitness = calculateFitness(individual.matrix);      // calculate fitness
      }
    });

    // find the best individual in the current population
    const currentBest = population.reduce((best, individual) =>
      individual.conflicts < best.conflicts ? individual : best
    );

    //update the UI board 
    if (!bestIndividual || currentBest.conflicts <= bestIndividual.conflicts) {
      bestIndividual = currentBest;
    }
    // LOGS TO TRACK CONFLICTS 
    /*console.log(`Best individual in generation ${generation}:`, {
      conflicts: bestIndividual.conflicts,
      fitness: bestIndividual.fitness,
    });*/
    

    
    if (onGenerationComplete) {
      const bestBoardMatrix = bestIndividual.matrix; // UPDATE THE BOARD
      const bestConflicts = bestIndividual.conflicts; // UPDATE THE CONFLICTS
      if (Array.isArray(bestBoardMatrix) && bestBoardMatrix.length === 8) {
          await onGenerationComplete(generation, bestBoardMatrix, bestConflicts);
      } 
      else {
          console.error('Invalid best board matrix:', bestBoardMatrix);
      }
    }

    // Check stopping conditions
    if (currentBest.conflicts <= targetConflicts) {
      //console.log(`Target conflicts (${targetConflicts}) achieved in generation ${generation}. Stopping algorithm.`);
      if (onMessageUpdate) onMessageUpdate("AI finished calculation!");      //state messege
      return (bestIndividual.matrix);
    }

    
    const parentPairs = rouletteWheelSelection(population);  //selection 
    const offspring = performCrossover(parentPairs, crossoverProbability); // crossover 
    const mutatedOffspring = performMutation(offspring, mutationProbability); // mutation (it i sincluded in the crossover function)

    population = mutatedOffspring; // the new population 

    //console.log(`--- Generation ${generation} ended ---`);

    // Introduce a delay to make updates visible
    await sleep(0); // Delay of 5ms
  }

  //console.log('Maximum generations reached. Returning best individual found.');
  if (onMessageUpdate) onMessageUpdate("AI finished calculation!"); // Notify completion
  return bestIndividual.matrix;
}
export function generatePopulation(popSize) {
  const population = new Set();
  const uniqueIndividuals = [];

  while (uniqueIndividuals.length < popSize) {
    const matrix = generateRandomBoard();
    const vector = convertBoardToVector(matrix);
    const vectorString = JSON.stringify(vector);

    if (!population.has(vectorString)) {
      population.add(vectorString); // Mark as seen
      const conflicts = calculateConflicts(matrix);
      const fitness = calculateFitness(matrix);
      uniqueIndividuals.push({ matrix, vector, conflicts, fitness });
    }
  }

  return uniqueIndividuals;
}

