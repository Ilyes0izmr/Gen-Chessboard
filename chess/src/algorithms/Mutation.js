import { convertVectorToMatrix } from './BoardGeneration';
export function performMutation(offspring, mutationProbability) {
  return offspring.map(individual => {
    const randomValue = Math.random();

    if (randomValue >= mutationProbability) {
      //console.log(`No mutation occurred for offspring`);
      return { ...individual, fitness: null }; 
    } else {
      //console.log(`Mutation occurred for offspring`);
      const mutatedVector = [...individual.vector];

      //(0-31) or lower half (32-63)
      let startIdx, endIdx;
      if (Math.random() < 0.5) {
        startIdx = 0;
        endIdx = 32;
      } else {
        startIdx = 32;
        endIdx = 64;
      }

      //non-empty cells 
      const nonEmptyCells = [];
      for (let i = startIdx; i < endIdx; i++) {
        if(mutatedVector[i] !== null)
          nonEmptyCells.push(i);
      }

      // Select two distinct random indices
      const indx1 = nonEmptyCells[Math.floor(Math.random() * nonEmptyCells.length)];
      let indx2;

      do {
        indx2 = nonEmptyCells[Math.floor(Math.random() * nonEmptyCells.length)];
      } while (indx1 === indx2);

      // Swap values
      const temp = mutatedVector[indx1];
      mutatedVector[indx1] = mutatedVector[indx2];
      mutatedVector[indx2] = temp;

      //console.log(`Swapped cells at indices ${indx1} and ${indx2}`);

      return { 
        matrix: convertVectorToMatrix(mutatedVector), 
        vector: mutatedVector, 
        fitness: null 
      };
    }
  });
}
