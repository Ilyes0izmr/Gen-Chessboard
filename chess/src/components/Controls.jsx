// src/components/Controls.jsx
import React, { useState } from 'react';
import './Controls.css';

const Controls = ({ onStart, onReset }) => {
  // Log the props to debug
  console.log({ onStart, onReset });

  // Default values for inputs
  const [maxGen, setMaxGen] = useState(10);
  const [targetFitness, setTargetFitness] = useState(0);
  const [popSize, setPopSize] = useState(10);
  const [crossoverProbability, setCrossoverProbability] = useState(0.8); // Default crossover probability
  const [mutationProbability, setMutationProbability] = useState(0.05); // Default mutation probability

  // Input change handlers
  const handleMaxGenChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setMaxGen(isNaN(value) ? 10 : value);
  };

  const handleTargetFitnessChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setTargetFitness(isNaN(value) ? 0 : value);
  };

  const handlePopulationChange = (e) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value)) value = 10; // Default if invalid
    if (value % 2 !== 0) value += 1; // Force even number
    setPopSize(value);
  };

  const handleCrossoverProbabilityChange = (e) => {
    const value = parseFloat(e.target.value);
    setCrossoverProbability(isNaN(value) || value < 0 ? 0 : value > 1 ? 1 : value); // Clamp between 0 and 1
  };

  const handleMutationProbabilityChange = (e) => {
    const value = parseFloat(e.target.value);
    setMutationProbability(isNaN(value) || value < 0 ? 0 : value > 1 ? 1 : value); // Clamp between 0 and 1
  };

  return (
    <div className="controls">
      {/* Max Generations Input */}
      <div className="input-group">
        <label htmlFor="maxGen">Max Generations</label>
        <input
          type="number"
          id="maxGen"
          value={maxGen}
          onChange={handleMaxGenChange}
        />
      </div>

      {/* Target Fitness Input */}
      <div className="input-group">
        <label htmlFor="targetFitness">Target Fitness</label>
        <input
          type="number"
          id="targetFitness"
          value={targetFitness}
          onChange={handleTargetFitnessChange}
        />
      </div>

      {/* Population Size Input */}
      <div className="input-group">
        <label htmlFor="popSize">Population Size (even number)</label>
        <input
          type="number"
          id="popSize"
          value={popSize}
          onChange={handlePopulationChange}
        />
      </div>

      {/* Crossover Probability Input */}
      <div className="input-group">
        <label htmlFor="crossoverProbability">Crossover Probability (0-1)</label>
        <input
          type="number"
          step="0.01" // Allow decimal values with a step of 0.01
          id="crossoverProbability"
          value={crossoverProbability}
          onChange={handleCrossoverProbabilityChange}
        />
      </div>

      {/* Mutation Probability Input */}
      <div className="input-group">
        <label htmlFor="mutationProbability">Mutation Probability (0-1)</label>
        <input
          type="number"
          step="0.01" // Allow decimal values with a step of 0.01
          id="mutationProbability"
          value={mutationProbability}
          onChange={handleMutationProbabilityChange}
        />
      </div>

      {/* Buttons */}
      <button
        className="start-button"
        onClick={() =>
          onStart({
            maxGen,
            targetFitness,
            popSize,
            crossoverProbability,
            mutationProbability,
          })
        }
      >
        Start Algorithm
      </button>
      <button className="reset-button" onClick={onReset}>
        Reset Board
      </button>
    </div>
  );
};

export default Controls;