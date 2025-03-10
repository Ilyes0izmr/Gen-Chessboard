import React, { useState } from 'react';
import Chessboard from '../components/Chessboard';
import Controls from '../components/Controls';
import { runGeneticAlgorithm } from '../algorithms/GeneticAlgorithm';
import { sleep } from '../utils/helpers'; // Import the sleep utility
import './Home.css';

const Home = () => {
  // State for the chessboard
  const [board, setBoard] = useState(null); // Start with no board
  const [conflicts, setConflicts] = useState(0); // Start with 0 conflicts
  const [message, setMessage] = useState(""); // State for dynamic messages

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
        onGenerationComplete: async (generation, bestBoardSoFar, bestConflicts) => {
          console.log(`Generation ${generation} complete. Best board so far:`, bestBoardSoFar, `Conflicts:`, bestConflicts);

          // Update the board state and conflicts value
          setBoard((prevBoard) => {
            console.log('Updating board state:', bestBoardSoFar);
            return JSON.parse(JSON.stringify(bestBoardSoFar)); // Create a deep copy to force re-render
          });
          setConflicts(bestConflicts); // Update conflicts value
          await sleep(200); // Add a delay of 200ms to make updates visible
        },
        onMessageUpdate: (newMessage) => {
          setMessage(newMessage); // Update the message dynamically
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
    setConflicts(0); // Reset conflicts value
    setMessage(""); // Clear the message
  };

  return (
    <div className="home-container">
      <h1>Chess Genetic Algorithm</h1>
      <div className="main-layout">
        {/* Pass the board state to Chessboard */}
        <div className="chessboard-container">
          <Chessboard board={board} />
        </div>
        {/* Pass onStart, onReset, conflicts, and message as props */}
        <div className="controls-container">
          <Controls onStart={handleStart} onStop={handleReset} conflicts={conflicts} message={message} />
        </div>
      </div>
    </div>
  );
};

export default Home;