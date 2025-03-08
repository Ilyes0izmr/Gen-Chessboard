// src/algorithms/Selection.js

/**
 * Performs roulette wheel selection to select parent pairs **without replacement**.
 *
 * @param {Array<Object>} population - The population of individuals with fitness scores.
 * @returns {Array<Array<Object>>} - An array of parent pairs (couples).
 */
export function rouletteWheelSelection(population) {
  // Create a copy of the population to avoid mutating the original
  let remainingPopulation = [...population];
  const pairs = [];

  // Continue pairing until fewer than 2 parents remain
  while (remainingPopulation.length >= 2) {
    // Step 1: Calculate total fitness for the remaining population
    const totalFitness = remainingPopulation.reduce(
      (sum, individual) => sum + individual.fitness,
      0
    );

    // Step 2: Create a cumulative probability distribution
    const cumulativeProbabilities = [];
    let cumulativeProbability = 0;
    for (const individual of remainingPopulation) {
      cumulativeProbability += individual.fitness / totalFitness;
      cumulativeProbabilities.push(cumulativeProbability);
    }

    // Step 3: Select Parent 1
    const randomValue1 = Math.random();
    let selectedIndex1 = 0;
    for (let i = 0; i < cumulativeProbabilities.length; i++) {
      if (randomValue1 <= cumulativeProbabilities[i]) {
        selectedIndex1 = i;
        break;
      }
    }
    const parent1 = remainingPopulation[selectedIndex1];
    remainingPopulation = remainingPopulation.filter((_, index) => index !== selectedIndex1);

    // Step 4: Select Parent 2 from the remaining population
    if (remainingPopulation.length === 0) break;

    const totalFitness2 = remainingPopulation.reduce(
      (sum, individual) => sum + individual.fitness,
      0
    );
    const cumulativeProbabilities2 = [];
    let cumulativeProbability2 = 0;
    for (const individual of remainingPopulation) {
      cumulativeProbability2 += individual.fitness / totalFitness2;
      cumulativeProbabilities2.push(cumulativeProbability2);
    }

    const randomValue2 = Math.random();
    let selectedIndex2 = 0;
    for (let i = 0; i < cumulativeProbabilities2.length; i++) {
      if (randomValue2 <= cumulativeProbabilities2[i]) {
        selectedIndex2 = i;
        break;
      }
    }
    const parent2 = remainingPopulation[selectedIndex2];
    remainingPopulation = remainingPopulation.filter(
      (_, index) => index !== selectedIndex2
    );

    pairs.push([parent1, parent2]);
  }

  console.log('Selected Parent Pairs:', pairs);
  return pairs;
}