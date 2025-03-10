export function rouletteWheelSelection(population) {
  const remainingPopulation = [...population];
  const pairs = [];

  while (remainingPopulation.length >= 2) {
    //const totalFitness = remainingPopulation.reduce((sum, individual) => sum + individual.fitness, 0);

    /*if (totalFitness === 0) {
      const [parent1, parent2] = remainingPopulation.splice(0, 2);
      pairs.push([parent1, parent2]);
      continue;
    }*/

    function selectParent(pop) {
      const totalFit = pop.reduce((sum, individual) => sum + individual.fitness, 0);
      const randomValue = Math.random() * totalFit;
      let cumulativeFitness = 0;

      for (let i = 0; i < pop.length; i++) {
        cumulativeFitness += pop[i].fitness;
        if (randomValue <= cumulativeFitness) {
          return i; // Return the selected index
        }
      }
      return pop.length - 1;
    }

    // Select Parent 1
    const index1 = selectParent(remainingPopulation);
    const parent1 = remainingPopulation[index1];

    // Remove Parent 1 from selection pool
    remainingPopulation.splice(index1, 1);

    // Select Parent 2 from the **updated** population
    const index2 = selectParent(remainingPopulation);
    const parent2 = remainingPopulation[index2];

    // Remove Parent 2
    remainingPopulation.splice(index2, 1);

    pairs.push([parent1, parent2]);
  }

  console.log("Selected Parent Pairs:", pairs);
  return pairs;
}
