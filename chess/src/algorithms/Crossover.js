// src/algorithms/Crossover.js
import { convertVectorToMatrix } from './BoardGeneration';
export function performCrossover(parentPairs, crossoverProbability = 0.8) {
  const offspring = [];

  for (const [parent1, parent2] of parentPairs) {
    // Roll a random number to decide if crossover occurs
    const randomValue = Math.random();
    if (randomValue < crossoverProbability) {
      console.log(`Crossover occurred between Parent 1 and Parent 2`);

      // Perform crossover: Exchange halves of the vectors
      const midpoint = Math.floor(parent1.vector.length / 2);
      const child1Vector = [
        ...parent1.vector.slice(0, midpoint),
        ...parent2.vector.slice(midpoint),
      ];
      const child2Vector = [
        ...parent2.vector.slice(0, midpoint),
        ...parent1.vector.slice(midpoint),
      ];

      // Reconstruct matrices from vectors
      const child1Matrix = convertVectorToMatrix(child1Vector);
      const child2Matrix = convertVectorToMatrix(child2Vector);

      // Create offspring objects
      offspring.push({ matrix: child1Matrix, vector: child1Vector, fitness: null });
      offspring.push({ matrix: child2Matrix, vector: child2Vector, fitness: null });
    } else {
      console.log(`No crossover occurred between Parent 1 and Parent 2`);

      // Add parents as-is to the next generation (as offspring)
      offspring.push({ ...parent1, fitness: null }); // Clone parent1
      offspring.push({ ...parent2, fitness: null }); // Clone parent2
    }
  }

  console.log('Resulting Offspring:', offspring);
  return offspring;
}