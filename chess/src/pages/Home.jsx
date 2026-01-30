import React, { useState, useRef } from "react";
import Chessboard from "../components/Chessboard";
import Controls from "../components/Controls";
import Navbar from "../components/Navbar";
import "./Home.css";

const Home = () => {
  const [board, setBoard] = useState(null);
  const [conflicts, setConflicts] = useState(0);
  const [conflictSquares, setConflictSquares] = useState([]);
  const [message, setMessage] = useState("press start please ...");
  const [currentGen, setCurrentGen] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const controlsDataRef = useRef({
    maxGen: 50,
    targetFitness: 0,
    popSize: 50,
    crossoverProbability: 0.8,
    mutationProbability: 0.01,
  });

  const workerRef = useRef(null);

  const handleStart = () => {
    setIsRunning(true);
    if (workerRef.current) workerRef.current.terminate();

    workerRef.current = new Worker(
      new URL("../utils/genetic.worker.js", import.meta.url),
      { type: "module" },
    );

    workerRef.current.onmessage = (e) => {
      const {
        type,
        matrix,
        conflicts: workerConflicts,
        generation: workerGen,
        conflictSquares: workerPaths,
        message: workerMsg,
      } = e.data;
      if (type === "PROGRESS") {
        setBoard(matrix);
        setConflicts(workerConflicts);
        setConflictSquares(workerPaths || []);
        setCurrentGen(workerGen);
      } else if (type === "MESSAGE") {
        setMessage(workerMsg);
      } else if (type === "FINISHED") {
        workerRef.current = null;
        setIsRunning(false);
      }
    };

    // We send the data stored in the ref
    workerRef.current.postMessage(controlsDataRef.current);
  };

  const handleReset = () => {
    if (workerRef.current) workerRef.current.terminate();
    workerRef.current = null;
    setBoard(null);
    setConflicts(0);
    setConflictSquares([]);
    setCurrentGen(0);
    setIsRunning(false);
    setMessage("press start...");
  };

  return (
    <div className="home-container">
      <div className="main-layout">
        {/* Render the new Navbar component */}
        <Navbar
          onStart={handleStart}
          onReset={handleReset}
          statusMessage={message}
          isRunning={isRunning}
        />

        <div className="content-area">
          <div className="chessboard-container">
            <div className="chessboard-rim-outlier">
              <Chessboard board={board} conflictSquares={conflictSquares} />
            </div>
          </div>

          <div className="controls-container">
            <Controls
              onSettingsChange={(newData) => {
                controlsDataRef.current = newData;
              }}
              conflicts={conflicts}
              message={message}
              currentGen={currentGen}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
