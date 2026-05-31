export function convertVectorToMatrix(vector) {
  if (!vector || vector.length !== 64) {
    console.error('Invalid vector length:', vector);
    throw new Error('Vector must have exactly 64 elements.');
  }

  return Array.from({ length: 8 }, (_, i) => vector.slice(i * 8, (i + 1) * 8));
}

export function convertBoardToVector(board) {
  if (!board || board.length !== 8 || board.some(row => row.length !== 8)) {
    console.error('Invalid board structure:', board);
    throw new Error('Board must be 8x8.');
  }
  return board.flat();
}

/**
 * Build a flat array of piece characters from a config object.
 * e.g. { Q: 3, R: 2, B: 1, K: 0 } → ['Q','Q','Q','R','R','B']
 */
function buildPieceList(pieceConfig) {
  const pieces = [];
  for (const [type, count] of Object.entries(pieceConfig)) {
    for (let i = 0; i < count; i++) {
      pieces.push(type);
    }
  }
  return pieces;
}

/**
 * Generate a random 8×8 board with the given piece configuration.
 * Pieces are split evenly: upper half gets total/2, lower half gets total/2.
 * @param {Object} pieceConfig - e.g. { Q: 4, R: 2, B: 2, K: 2 }
 */
export function generateRandomBoard(pieceConfig) {
  const board = Array.from({ length: 8 }, () => Array(8).fill(null));

  const allPieces = buildPieceList(pieceConfig);
  const half = allPieces.length / 2;

  // Shuffle all pieces first, then split into upper/lower halves
  shuffleArray(allPieces);
  const upperPieces = allPieces.slice(0, half);
  const lowerPieces = allPieces.slice(half);

  // Upper and lower half piece distributions
  placePiecesRandomly(board, 0, 3, upperPieces);
  placePiecesRandomly(board, 4, 7, lowerPieces);

  return board;
}

function placePiecesRandomly(board, startRow, endRow, pieces) {
  const positions = [];
  
  for (let row = startRow; row <= endRow; row++) {
    for (let col = 0; col < 8; col++) {
      positions.push([row, col]);
    }
  }

  shuffleArray(positions); // Randomize possible positions
  
  for (const piece of pieces) {
    const [row, col] = positions.pop();
    board[row][col] = piece;
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
}
