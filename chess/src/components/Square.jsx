// src/components/Square.jsx
import React from 'react';
import './Square.css';

import queenImage from '../assets/pieces/q.png';
import knightImage from '../assets/pieces/k.png';
import rookImage from '../assets/pieces/r.png';
import bishopImage from '../assets/pieces/b.png';

const Square = ({ isDark, piece }) => {
  const squareClass = isDark ? 'square dark' : 'square light';

  // Map piece names to imported images
  const pieceImages = {
    Q: queenImage, // Queen
    K: knightImage,  // knight
    R: rookImage,  // Rook
    B: bishopImage, // Bishop
  };

  return (
    <div className={squareClass}>
      {piece && pieceImages[piece] ? (
        <img
          src={pieceImages[piece]} // Use the imported image
          alt={piece}
          style={{
            width: '100%', // Scale the image to fit the square
            height: '100%',
            objectFit: 'contain', // Ensure the image fits without distortion
          }}
        />
      ) : null}
    </div>
  );
};

export default Square;