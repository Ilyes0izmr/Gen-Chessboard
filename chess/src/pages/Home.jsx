import React, { useState, useRef } from "react";
import Chessboard from "../components/Chessboard";
import Controls from "../components/Controls";
import "./Home.css";

const Home = () => {
  const [board, setBoard] = useState(null);
  const [conflicts, setConflicts] = useState(0);
  const [conflictSquares, setConflictSquares] = useState([]);
  const [message, setMessage] = useState("press start...");

  const workerRef = useRef(null);

  const handleStart = (params) => {
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
        conflictSquares: workerPaths,
        message: workerMsg,
      } = e.data;

      if (type === "PROGRESS") {
        setBoard(matrix);
        setConflicts(workerConflicts);
        setConflictSquares(workerPaths || []);
      } else if (type === "MESSAGE") {
        setMessage(workerMsg);
      } else if (type === "FINISHED") {
        workerRef.current = null;
      }
    };

    workerRef.current.onerror = (err) => {
      console.error("Worker Error:", err);
      setMessage("Error: AI thread crashed.");
    };

    workerRef.current.postMessage(params);
  };

  const handleReset = () => {
    if (workerRef.current) workerRef.current.terminate();
    workerRef.current = null;
    setBoard(null);
    setConflicts(0);
    setConflictSquares([]);
    setMessage("press start...");
  };

  return (
    <div className="home-container">
      <div className="main-layout">
        <div className="chessboard-container">
          <div className="chessboard-rim-outlier">
            <Chessboard board={board} conflictSquares={conflictSquares} />
          </div>
        </div>
        <div className="controls-container">
          <Controls
            onStart={handleStart}
            onStop={handleReset}
            conflicts={conflicts}
            message={message}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
