import React, { useState } from 'react';
import Chessboard from '../components/Chessboard';
import Controls from '../components/Controls';
import { runGeneticAlgorithm } from '../algorithms/GeneticAlgorithm';
import { sleep } from '../utils/helpers'; 
import './Home.css';

const Home = () => {
 
  const [board, setBoard] = useState(null);
  const [conflicts, setConflicts] = useState(0); 
  const [message, setMessage] = useState("press start..."); 

 
  const handleStart = async ({maxGen,targetFitness,popSize,crossoverProbability,mutationProbability,}) => {
    console.log('Starting algorithm with:', {
      maxGen,
      targetFitness,
      popSize,
      crossoverProbability,
      mutationProbability,
    });

    try {
      
      await runGeneticAlgorithm({
        maxGenerations: maxGen,
        targetConflicts: targetFitness,
        populationSize: popSize,
        crossoverProbability,
        mutationProbability, 
        onGenerationComplete: async (generation, bestBoardSoFar, bestConflicts) => {
         console.log(`Generation ${generation}`);

         
          setBoard((prevBoard) => {
            //console.log('Updating board state:', bestBoardSoFar);
            return JSON.parse(JSON.stringify(bestBoardSoFar)); 
          });
          setConflicts(bestConflicts); 
          await sleep(0); 
        },
        onMessageUpdate: (newMessage) => {
          setMessage(newMessage); 
        },
      });
    } catch (error) {
      console.error('Error running genetic algorithm:', error);
    }
  };

  
  const handleReset = () => {
    console.log('Resetting board...');
    setBoard(null); 
    setConflicts(0); 
    setMessage("press start..."); 
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