import { useState } from 'react';
import startIcon from '../assets/start.png';
import stopIcon from '../assets/reset.png';  
import generationsIcon from '../assets/generations-icon.png'; 
import targetIcon from '../assets/target-icon.png';           
import populationIcon from '../assets/population-icon.png';   
import crossoverIcon from '../assets/crossover-icon.png';     
import mutationIcon from '../assets/mutation-icon.png';      
import './Controls.css';

const Controls = ({ onStart, onStop, conflicts, message }) => {

  const [maxGen, setMaxGen] = useState(50);
  const [targetFitness, setTargetFitness] = useState(0);
  const [popSize, setPopSize] = useState(50);
  const [crossoverProbability, setCrossoverProbability] = useState(0.8);
  const [mutationProbability, setMutationProbability] = useState(0.1);

 
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
    if (isNaN(value)) value = 10;
    if (value % 2 !== 0) value += 1;
    setPopSize(value);
  };

  const handleCrossoverProbabilityChange = (e) => {
    const value = parseFloat(e.target.value);
    setCrossoverProbability(isNaN(value) || value < 0 ? 0 : value > 1 ? 1 : value);
  };

  const handleMutationProbabilityChange = (e) => {
    const value = parseFloat(e.target.value);
    setMutationProbability(isNaN(value) || value < 0 ? 0 : value > 1 ? 1 : value);
  };

  return (
    <div className="controls">
      <div className="sidebar">
        {/* Max Generations */}
        <div className="input-group">
          <img src={generationsIcon} alt="Generations" className="icon" />
          <label htmlFor="maxGen">  Max Gens</label>
          <input
            type="number"
            id="maxGen"
            value={maxGen}
            onChange={handleMaxGenChange}
          />
        </div>

        {/* Target Fitness */}
        <div className="input-group">
          <img src={targetIcon} alt="Target Fitness" className="icon" />
          <label htmlFor="targetFitness">  Target Fitness</label>
          <input
            type="number"
            id="targetFitness"
            value={targetFitness}
            onChange={handleTargetFitnessChange}
          />
        </div>

        {/* Population Size */}
        <div className="input-group">
          <img src={populationIcon} alt="Population Size" className="icon" />
          <label htmlFor="popSize">  Population Size</label>
          <input
            type="number"
            id="popSize"
            value={popSize}
            onChange={handlePopulationChange}
          />
        </div>

        {/* Crossover Probability */}
        <div className="input-group">
          <img src={crossoverIcon} alt="Crossover Probability" className="icon" />
          <label htmlFor="crossoverProbability">  Crossover %</label>
          <input
            type="number"
            step="0.01"
            id="crossoverProbability"
            value={crossoverProbability}
            onChange={handleCrossoverProbabilityChange}
          />
        </div>

        {/* Mutation Probability */}
        <div className="input-group">
          <img src={mutationIcon} alt="Mutation Probability" className="icon" />
          <label htmlFor="mutationProbability">  Mutation %</label>
          <input
            type="number"
            step="0.01"
            id="mutationProbability"
            value={mutationProbability}
            onChange={handleMutationProbabilityChange}
          />
        </div>

        {/* Display Conflicts */}
        <div className="info-item">
          <span className="info-label">Conflicts:</span>
          <span className="info-value">{conflicts}</span>
        </div>

        {/* Display Message */}
        <div className="message-item">
          <span className="message-text">{message}</span>
        </div>

        {/* Start and Stop Buttons */}
        <div className="button-group">
          <div
            className="button-item"
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
            <img src={startIcon} alt="Start" className="icon" />
            <span className="button-label">Start</span>
          </div>
          <div className="button-item" onClick={onStop}>
            <img src={stopIcon} alt="Stop" className="icon" />
            <span className="button-label">Stop</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Controls;