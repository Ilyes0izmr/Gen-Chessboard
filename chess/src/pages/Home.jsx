import React, { useState, useRef } from "react";
import Chessboard from "../components/Chessboard";
import Controls from "../components/Controls";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faStop } from "@fortawesome/free-solid-svg-icons";
import "./Home.css";

const Home = () => {
  const [board, setBoard] = useState(null);
  const [conflicts, setConflicts] = useState(0);
  const [conflictSquares, setConflictSquares] = useState([]);
  const [message, setMessage] = useState("press start...");
  const [currentGen, setCurrentGen] = useState(0);

  // This ref will hold the current settings from the Controls component
  const controlsDataRef = useRef({
    maxGen: 50,
    targetFitness: 0,
    popSize: 50,
    crossoverProbability: 0.8,
    mutationProbability: 0.01,
  });

  const workerRef = useRef(null);

  const handleStart = () => {
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
    setMessage("press start...");
  };

  return (
    <div className="home-container">
      <div className="main-layout">
        {/* Top: Navbar with Buttons */}
        <div className="navbar-container">
          <div className="navbar-logo"></div>
          <div className="button-group-nav">
            <button className="button-item start" onClick={handleStart}>
              <FontAwesomeIcon icon={faPlay} className="fa-icon" />
            </button>
            <button className="button-item stop" onClick={handleReset}>
              <FontAwesomeIcon icon={faStop} className="fa-icon" />
            </button>
          </div>
        </div>

        <div className="content-area">
          <div className="chessboard-container">
            <div className="chessboard-rim-outlier">
              <Chessboard board={board} conflictSquares={conflictSquares} />
            </div>
          </div>

          <div className="controls-container">
            <Controls
              // We pass a function to update the ref whenever an input changes
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
