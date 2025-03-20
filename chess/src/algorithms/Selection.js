export function rouletteWheelSelection(population, eliteCount = 2) {
  
  population.sort((a, b) => b.fitness - a.fitness);

  
  const selectedPairs = [];
  const eliteIndividuals = population.slice(0, eliteCount);
  
 
  let totalFitness = population.reduce((sum, individual) => sum + individual.fitness, 0);
  
  if (totalFitness === 0) {
    
    while (selectedPairs.length < population.length / 2) {
      const randomParents = [
        population[Math.floor(Math.random() * population.length)],
        population[Math.floor(Math.random() * population.length)]
      ];
      selectedPairs.push(randomParents);
    }
    return selectedPairs;
  }

  function selectParent() {
    let randomValue = Math.random() * totalFitness;
    let cumulativeFitness = 0;

    for (const individual of population) {
      cumulativeFitness += individual.fitness;
      if (randomValue <= cumulativeFitness) {
        return individual;
      }
    }
    return population[population.length - 1]; // Fallback
  }

  // Select parents in pairs
  while (selectedPairs.length < (population.length - eliteCount) / 2) {
    let parent1 = selectParent();
    let parent2 = selectParent();

    // Ensure diversity (prevent selecting the same parent)
    while (parent1 === parent2) {
      parent2 = selectParent();
    }

    selectedPairs.push([parent1, parent2]);
  }

  //console.log("Selected Parent Pairs:", selectedPairs);
  return [...selectedPairs, ...eliteIndividuals.map(e => [e, e])]; // Ensure elites remain in the population
}
