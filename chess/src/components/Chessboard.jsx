// src/components/Chessboard.jsx
import React, { useEffect } from 'react';
import Square from './Square';
import './Chessboard.css';

const Chessboard = ({ board }) => {
  // Log the incoming board prop for debugging
  console.log('Chessboard received board:', board);

  // If no board is provided, render an empty board
  const currentBoard = board || Array.from({ length: 8 }, () => Array(8).fill(null));

  // Use useEffect to detect changes to the board prop
  useEffect(() => {
    console.log('Chessboard prop "board" changed:', board);
  }, [board]);

  // Render the chessboard grid
  const renderBoard = () => {
    return currentBoard.map((row, rowIndex) => (
      <div key={rowIndex} className="chessboard-row">
        {row.map((piece, colIndex) => (
          <Square
            key={`${rowIndex}-${colIndex}`}
            isDark={(rowIndex + colIndex) % 2 === 0}
            piece={piece}
          />
        ))}
      </div>
    ));
  };

  return <div className="chessboard">{renderBoard()}</div>;
};

export default Chessboard;