// src/components/Square.jsx
import React from 'react';
import './Square.css';

import queenImage from '../assets/pieces/q.png';
import knightImage from '../assets/pieces/k.png';
import rookImage from '../assets/pieces/r.png';
import bishopImage from '../assets/pieces/b.png';

const Square = ({ isDark, piece }) => {
  const squareClass = isDark ? 'square dark' : 'square light';

  const pieceImages = {
    Q: queenImage, 
    K: knightImage,  
    R: rookImage,  
    B: bishopImage, 
  };

  return (
    <div className={squareClass}>
      {piece && pieceImages[piece] ? (
        <img
          src={pieceImages[piece]} 
          alt={piece}
          style={{
            width: '100%', 
            height: '100%',
            objectFit: 'contain', 
          }}
        />
      ) : null}
    </div>
  );
};

export default Square;