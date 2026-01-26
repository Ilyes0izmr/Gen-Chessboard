// src/components/Square.jsx
import React from "react";
import "./Square.css";

import queenImage from "../assets/pieces/q.png";
import knightImage from "../assets/pieces/k.png";
import rookImage from "../assets/pieces/r.png";
import bishopImage from "../assets/pieces/b.png";

const Square = ({ isDark, piece, isConflict }) => {
  const squareClass = `square ${isDark ? "dark" : "light"} ${isConflict ? "conflict-glow" : ""}`;
  const pieceImages = {
    Q: queenImage,
    K: knightImage,
    R: rookImage,
    B: bishopImage,
  };

  return (
    <div className={squareClass}>
      {piece && (
        <img
          src={pieceImages[piece]}
          alt={piece}
          className={isConflict ? "piece-in-conflict" : ""}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      )}
    </div>
  );
};

export default Square;
