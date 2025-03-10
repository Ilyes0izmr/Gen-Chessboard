export function convertVectorToMatrix(vector) {
  if (!vector || vector.length !== 64) {
    console.error('Invalid vector length:', vector);
    throw new Error('Vector must have exactly 64 elements.');
  }

  const matrix = [];
  for (let i = 0; i < 8; i++) {
    matrix.push(vector.slice(i * 8, (i + 1) * 8)); 
  }
  return matrix;
}
export function convertBoardToVector(board) {
  const vector = new Array(64).fill(null); // Ensure a 64-element array

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const index = row * 8 + col; // Convert (row, col) into 1D index
      vector[index] = board[row][col]; // Assign value from the board
    }
  }

  return vector;
}
export function generateRandomBoard() {
  const rows = 8;
  const cols = 8;
  const board = Array.from({ length: rows }, () => Array(cols).fill(null));

  
  const upperHalfPieces = ['Q', 'Q', 'R', 'B', 'K'];
  placePiecesRandomly(board, 0, 3, upperHalfPieces);

  
  const lowerHalfPieces = ['Q', 'Q', 'R', 'B', 'K'];
  placePiecesRandomly(board, 4, 7, lowerHalfPieces);

  
  if (!board || board.length !== 8 || board.some(row => row.length !== 8)) {
    console.error('Invalid board generated:', board);
    throw new Error('Failed to generate a valid chessboard.');
  }

  return board;
}
function placePiecesRandomly(board, startRow, endRow, pieces) {
  let remainingPieces = [...pieces];
  
  while (remainingPieces.length > 0) {
    const row = Math.floor(Math.random() * (endRow - startRow + 1)) + startRow;
    const col = Math.floor(Math.random() * board[row].length);
  
    if (board[row][col] === null) {
      board[row][col] = remainingPieces.pop();
    }
  }
}