import Square from "./Square";
import "./Chessboard.css";

const Chessboard = ({ board, conflictSquares = [] }) => {
  const currentBoard =
    board || Array.from({ length: 8 }, () => Array(8).fill(null));

  const renderBoard = () => {
    return currentBoard.map((row, rowIndex) => (
      <div key={rowIndex} className="chessboard-row">
        {row.map((piece, colIndex) => {
          const isConflict = conflictSquares.some(
            ([r, c]) => r === rowIndex && c === colIndex,
          );

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
};

export default Chessboard;
