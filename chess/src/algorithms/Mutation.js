// src/algorithms/Mutation.js
import { convertVectorToMatrix } from './BoardGeneration';
export function performMutation(offspring, mutationProbability) {
  const mutatedOffspring = [];

  for (const individual of offspring) {
    const randomValue = Math.random();
    if (randomValue < mutationProbability) {
      console.log(`Mutation occurred for offspring`);

      // Clone the vector to avoid modifying the original
      const mutatedVector = [...individual.vector];

      // Decide whether to mutate the upper half or the lower half (50% probability)
      const mutateUpperHalf = Math.random() < 0.5;

      // Define the range of indices for the chosen half
      const startIdx = mutateUpperHalf ? 0 : 32; // Upper half: indices 0-31, Lower half: indices 32-63
      const endIdx = mutateUpperHalf ? 32 : 64;

      // Get all non-empty cells in the chosen half
      const nonEmptyCells = [];
      for (let i = startIdx; i < endIdx; i++) {
        if (mutatedVector[i] !== null) {
          nonEmptyCells.push(i);
        }
      }

      // Ensure there are at least two non-empty cells to swap
      if (nonEmptyCells.length >= 2) {
        // Randomly select two distinct indices to swap
        const idx1 = nonEmptyCells[Math.floor(Math.random() * nonEmptyCells.length)];
        let idx2;
        do {
          idx2 = nonEmptyCells[Math.floor(Math.random() * nonEmptyCells.length)];
        } while (idx1 === idx2); // Ensure idx1 and idx2 are different

        // Swap the values at the selected indices
        [mutatedVector[idx1], mutatedVector[idx2]] = [mutatedVector[idx2], mutatedVector[idx1]];

        console.log(`Swapped cells at indices ${idx1} and ${idx2}`);
      } else {
        console.log(`Not enough non-empty cells in the chosen half for mutation`);
      }

      // Reconstruct the matrix from the mutated vector
      const mutatedMatrix = convertVectorToMatrix(mutatedVector);

      // Add the mutated individual to the result
      mutatedOffspring.push({ matrix: mutatedMatrix, vector: mutatedVector, fitness: null });
    } else {
      console.log(`No mutation occurred for offspring`);
      // Add the unchanged individual to the result
      mutatedOffspring.push(individual);
    }
  }

  console.log('Mutated Offspring:', mutatedOffspring);
  return mutatedOffspring;
}