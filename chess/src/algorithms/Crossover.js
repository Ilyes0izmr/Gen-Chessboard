// src/algorithms/Crossover.js
import { convertVectorToMatrix } from './BoardGeneration';
import { performMutation } from './Mutation'; // Import mutation function

export function performCrossover(parentPairs, crossoverProbability, mutationProbability) {
  const offspring = [];

  for (const [parent1, parent2] of parentPairs) {
    const randomValue = Math.random();
    if (randomValue < crossoverProbability) {
      console.log(`Crossover occurred between Parent 1 and Parent 2`);

      // Perform one-point crossover (split at the midpoint)
      const midpoint = Math.floor(parent1.vector.length / 2);
      const child1Vector = [
        ...parent1.vector.slice(0, midpoint),
        ...parent2.vector.slice(midpoint),
      ];
      const child2Vector = [
        ...parent2.vector.slice(0, midpoint),
        ...parent1.vector.slice(midpoint),
      ];

      // Convert vectors back to matrices
      const child1Matrix = convertVectorToMatrix(child1Vector);
      const child2Matrix = convertVectorToMatrix(child2Vector);

      // Create child objects
      const child1 = { matrix: child1Matrix, vector: child1Vector, fitness: null };
      const child2 = { matrix: child2Matrix, vector: child2Vector, fitness: null };

      // Apply mutation
      const mutatedOffspring = performMutation([child1, child2], mutationProbability);
      offspring.push(...mutatedOffspring);
    } else {
      console.log(`No crossover occurred between Parent 1 and Parent 2`);

      // Add parents to next generation (deep copy to avoid reference issues)
      offspring.push(JSON.parse(JSON.stringify({ ...parent1, fitness: null }))); // Clone parent1
      offspring.push(JSON.parse(JSON.stringify({ ...parent2, fitness: null }))); // Clone parent2
    }
  }

  console.log('Resulting Offspring:', offspring);
  return offspring;
}
