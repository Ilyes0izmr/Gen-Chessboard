import React, { useMemo } from "react";
import Square from "./Square";
import "./Chessboard.css";

const Chessboard = React.memo(({ board, conflictSquares = [] }) => {
  const currentBoard =
    board || Array.from({ length: 8 }, () => Array(8).fill(null));

  // Pre-compute a Set of conflict positions for O(1) lookup per square
  const conflictSet = useMemo(() => {
    const set = new Set();
    for (const [r, c] of conflictSquares) {
      set.add(`${r},${c}`);
    }
    return set;
  }, [conflictSquares]);

  const renderBoard = () => {
    return currentBoard.map((row, rowIndex) => (
      <div key={rowIndex} className="chessboard-row">
        {row.map((piece, colIndex) => {
          const isConflict = conflictSet.has(`${rowIndex},${colIndex}`);

          return (
            <Square
              key={`${rowIndex}-${colIndex}`}
              isDark={(rowIndex + colIndex) % 2 === 0}
              piece={piece}
              isConflict={isConflict}
            />
          );
        })}
      </div>
    ));
  };

  return <div className="chessboard">{renderBoard()}</div>;
});

Chessboard.displayName = "Chessboard";

export default Chessboard;
