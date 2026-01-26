// src/components/Chessboard.jsx
import React, { useEffect } from "react";
import Square from "./Square";
import "./Chessboard.css";

const Chessboard = ({ board, conflictSquares = [] }) => {
  const currentBoard =
    board || Array.from({ length: 8 }, () => Array(8).fill(null));

  const renderBoard = () => {
    return currentBoard.map((row, rowIndex) => (
      <div key={rowIndex} className="chessboard-row">
        {row.map((piece, colIndex) => {
          // Check if this specific square is in the conflict list
          const isConflict = conflictSquares.some(
            ([r, c]) => r === rowIndex && c === colIndex,
          );

          return (
            <Square
              key={`${rowIndex}-${colIndex}`}
              isDark={(rowIndex + colIndex) % 2 === 0}
              piece={piece}
              isConflict={isConflict} // Pass this to the square
            />
          );
        })}
      </div>
    ));
  };

  return <div className="chessboard">{renderBoard()}</div>;
};

export default Chessboard;
