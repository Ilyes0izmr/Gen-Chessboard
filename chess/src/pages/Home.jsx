// src/pages/Home.jsx
import React, { useState } from 'react';
import Chessboard from '../components/Chessboard';
import Controls from '../components/Controls';
import { runGeneticAlgorithm } from '../algorithms/GeneticAlgorithm';
import { sleep } from '../utils/helpers'; // Import the sleep utility
import './Home.css';

const Home = () => {
  // State for the chessboard
  const [board, setBoard] = useState(null); // Start with no board

  // Handler for starting the algorithm
  const handleStart = async ({
    maxGen,
    targetFitness,
    popSize,
    crossoverProbability,
    mutationProbability,
  }) => {
    console.log('Starting algorithm with:', {
      maxGen,
      targetFitness,
      popSize,
      crossoverProbability,
      mutationProbability,
    });

    try {
      // Run the genetic algorithm
      await runGeneticAlgorithm({
        maxGenerations: maxGen,
        targetConflicts: targetFitness,
        populationSize: popSize,
        crossoverProbability, // Pass crossover probability
        mutationProbability, // Pass mutation probability
        onGenerationComplete: async (generation, bestBoardSoFar) => {
          console.log(`Generation ${generation} complete. Best board so far:`, bestBoardSoFar);

          // Update the board state and wait for the UI to re-render
          setBoard((prevBoard) => {
            console.log('Updating board state:', bestBoardSoFar);
            return JSON.parse(JSON.stringify(bestBoardSoFar)); // Create a deep copy to force re-render
          });
          await sleep(200); // Add a delay of 200ms to make updates visible
        },
      });
    } catch (error) {
      console.error('Error running genetic algorithm:', error);
    }
  };

  // Handler for resetting the board
  const handleReset = () => {
    console.log('Resetting board...');
    setBoard(null); // Reset the board state (triggers re-render with an empty board)
  };

  return (
    <div className="home-container">
      <h1>Chess Genetic Algorithm</h1>
      <div className="main-layout">
        {/* Pass the board state to Chessboard */}
        <div className="chessboard-container">
          <Chessboard board={board} />
        </div>
        {/* Pass onStart and onReset as props */}
        <div className="controls-container">
          <Controls onStart={handleStart} onReset={handleReset} />
        </div>
      </div>
    </div>
  );
};

export default Home;