// src/algorithms/BoardGeneration.js

export function convertVectorToMatrix(vector) {
  if (!vector || vector.length !== 64) {
    console.error('Invalid vector length:', vector);
    throw new Error('Vector must have exactly 64 elements.');
  }

  const matrix = [];
  for (let i = 0; i < 8; i++) {
    matrix.push(vector.slice(i * 8, (i + 1) * 8)); // Extract 8 elements for each row
  }
  return matrix;
}

/**
 * Converts an 8x8 chessboard matrix into a vector representation.
 *
 * @param {Array<Array<string|null>>} board - The 8x8 chessboard matrix.
 * @returns {Array<string|null>} - A vector (1D array) representing the chessboard.
 */
export function convertBoardToVector(board) {
    const vector = [];
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        vector.push(board[row][col]); // Flatten the matrix into a single array
      }
    }
    return vector;
  }
  
 // src/algorithms/BoardGeneration.js

/**
 * Generates a random chessboard with the required piece placement.
 *
 * @returns {Array<Array<string|null>>} - A single chessboard (8x8 matrix).
 */
export function generateRandomBoard() {
  const rows = 8;
  const cols = 8;
  const board = Array.from({ length: rows }, () => Array(cols).fill(null));

  // Pieces for the upper half (rows 0-3)
  const upperHalfPieces = ['Q', 'Q', 'R', 'B', 'K'];
  placePiecesRandomly(board, 0, 3, upperHalfPieces);

  // Pieces for the lower half (rows 4-7)
  const lowerHalfPieces = ['Q', 'Q', 'R', 'B', 'K'];
  placePiecesRandomly(board, 4, 7, lowerHalfPieces);

  // Ensure the board is valid before returning
  if (!board || board.length !== 8 || board.some(row => row.length !== 8)) {
    console.error('Invalid board generated:', board);
    throw new Error('Failed to generate a valid chessboard.');
  }

  return board;
}
  
  /**
   * Places pieces randomly in a given range of rows.
   *
   * @param {Array<Array<string|null>>} board - The chessboard to modify.
   * @param {number} startRow - The starting row index (inclusive).
   * @param {number} endRow - The ending row index (inclusive).
   * @param {Array<string>} pieces - The pieces to place on the board.
   */
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