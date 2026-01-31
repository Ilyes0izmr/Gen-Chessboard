import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLayerGroup,
  faBullseye,
  faUsers,
  faScissors,
  faDna,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import "./Controls.css";

const ProgressWatch = ({ currentGen, maxGen, conflicts, targetFitness }) => {
  // 1. Check if the AI found the solution
  const isFinished = currentGen > 0 && conflicts <= targetFitness;
  // 2. Logic: If finished, force 100%. Otherwise, show generation progress.
  const percentage = isFinished
    ? 100
    : Math.min(100, Math.round((currentGen / maxGen) * 100));

  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="watch-container">
      {/* The 'finished' class will be added when the solution is found */}
      <div className={`watch-face ${isFinished ? "finished" : ""}`}>
        <svg className="watch-svg" viewBox="0 0 100 100">
          <circle className="watch-track" cx="50" cy="50" r={radius} />
          <circle
            className="watch-progress"
            cx="50"
            cy="50"
            r={radius}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              transition: isFinished
                ? "stroke-dashoffset 0.8s ease-out"
                : "stroke-dashoffset 0.3s linear",
            }}
          />
        </svg>
        <div className="watch-display">
          <span className="watch-percent">{percentage}%</span>
          <span className="watch-label">
            {isFinished ? "SOLVED" : `GEN ${currentGen}`}
          </span>
        </div>
      </div>
    </div>
  );
};

const Controls = ({ onSettingsChange, conflicts, message, currentGen }) => {
  const [maxGen, setMaxGen] = useState(50);
  const [targetFitness, setTargetFitness] = useState(0);
  const [popSize, setPopSize] = useState(50);
  const [crossoverProbability, setCrossoverProbability] = useState(0.8);
  const [mutationProbability, setMutationProbability] = useState(0.01);

  useEffect(() => {
    onSettingsChange({
      maxGen,
      targetFitness,
      popSize,
      crossoverProbability,
      mutationProbability,
    });
  }, [
    maxGen,
    targetFitness,
    popSize,
    crossoverProbability,
    mutationProbability,
    onSettingsChange,
  ]);

  return (
    <div className="controls">
      <div className="sidebar">
        {/* Max Generations */}
        <div className="input-group">
          <div className="label-col">
            <FontAwesomeIcon icon={faLayerGroup} className="fa-icon" />
            <label>Max Generation</label>
          </div>
          <input
            type="number"
            className="neo-input-badge"
            value={maxGen}
            onChange={(e) => setMaxGen(parseInt(e.target.value) || 0)}
          />
        </div>

        {/* Population Size */}
        <div className="input-group">
          <div className="label-col">
            <FontAwesomeIcon icon={faUsers} className="fa-icon" />
            <label>Population Size</label>
          </div>
          <input
            type="number"
            className="neo-input-badge"
            min="50"
            value={popSize}
            onChange={(e) => setPopSize(parseInt(e.target.value) || 0)}
          />
        </div>

        {/* Target Fitness Slider */}
        <div className="input-group-slider">
          <div className="slider-header">
            <div className="label-col">
              <FontAwesomeIcon icon={faBullseye} className="fa-icon" />
              <label>Target Fitness</label>
            </div>
            <span className="slider-value">{targetFitness}</span>
          </div>
          <input
            type="range"
            id="targetFitness"
            min="0"
            max="10"
            step="1"
            className="neomorphic-slider"
            value={targetFitness}
            onChange={(e) => setTargetFitness(parseInt(e.target.value))}
          />
        </div>

        {/* Crossover Rate */}
        <div className="input-group">
          <div className="label-col">
            <FontAwesomeIcon icon={faScissors} className="fa-icon" />
            <label>Crossover %</label>
          </div>
          <input
            type="number"
            step="0.01"
            className="neo-input-badge"
            value={crossoverProbability}
            onChange={(e) =>
              setCrossoverProbability(parseFloat(e.target.value) || 0)
            }
          />
        </div>

        {/* Mutation Rate */}
        <div className="input-group">
          <div className="label-col">
            <FontAwesomeIcon icon={faDna} className="fa-icon" />
            <label>Mutation %</label>
          </div>
          <input
            type="number"
            step="0.01"
            className="neo-input-badge"
            value={mutationProbability}
            onChange={(e) =>
              setMutationProbability(parseFloat(e.target.value) || 0)
            }
          />
        </div>

        <div className="feedback-section">
          <ProgressWatch
            currentGen={currentGen}
            maxGen={maxGen}
            conflicts={conflicts}
            targetFitness={targetFitness}
          />
          <div className="info-item">
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              className="fa-icon warning"
            />
            <span className="info-label">Conflicts: {conflicts}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Controls;
