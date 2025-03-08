// src/algorithms/Fitness.js
/**
 * Calculate the fitness of a chessboard based on the number of conflicts.
 *
 * @param {Array<Array<string|null>>} board - The 8x8 chessboard matrix.
 * @returns {number} - The fitness score of the board.
 */
export function calculateFitness(board) {
    const conflictCount = calculateConflicts(board);
    console.log(`Total Conflicts: ${conflictCount}`);
    return 1 / (1 + conflictCount); // Fitness formula: Fi = 1 / (1 + conflict_nbr)
}
  
/**
   * Calculate the total number of unique conflicts between pieces on the chessboard.
   *
   * @param {Array<Array<string|null>>} board - The 8x8 chessboard matrix.
   * @returns {number} - The total number of unique conflicts on the board.
   */
export function calculateConflicts(board) {
    const conflicts = new Set(); // Use a set to track unique conflicts
  
    // Check for conflicts between pieces
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        const piece = board[row][col];
        if (piece) {
          const pieceConflicts = findConflictsForPiece(board, row, col, piece);
          pieceConflicts.forEach((conflict) => conflicts.add(conflict));
        }
      }
    }
  
    //console.log(`Unique Conflicts: ${Array.from(conflicts).join(', ')}`);
    return conflicts.size; // Total number of unique conflicts
}
  
/**
   * Find all unique conflicts caused by a specific piece on the board.
   *
   * @param {Array<Array<string|null>>} board - The 8x8 chessboard matrix.
   * @param {number} row - The row index of the piece.
   * @param {number} col - The column index of the piece.
   * @param {string} piece - The type of piece ('Q', 'R', 'B', 'K').
   * @returns {Set<string>} - A set of unique conflicts caused by the piece.
   */
function findConflictsForPiece(board, row, col, piece) {
    const conflicts = new Set(); // Track unique conflicts for this piece
  
    // Define movement patterns for each piece
    const movements = {
      Q: [
        [-1, 0], [1, 0], [0, -1], [0, 1], // Horizontal and vertical
        [-1, -1], [-1, 1], [1, -1], [1, 1], // Diagonals
      ],
      R: [
        [-1, 0], [1, 0], [0, -1], [0, 1], // Horizontal and vertical
      ],
      B: [
        [-1, -1], [-1, 1], [1, -1], [1, 1], // Diagonals
      ],
      K: [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1],
      ],
    };
  
    // Check all possible moves for the piece
    const moves = movements[piece];
    for (const [dx, dy] of moves) {
      let newRow = row + dx;
      let newCol = col + dy;
  
      // Check bounds and conflicts
      while (newRow >= 0 && newRow < board.length && newCol >= 0 && newCol < board.length) {
        if (board[newRow][newCol]) {
          // Add the conflict as a sorted pair to ensure uniqueness
          const conflict = [row * 8 + col, newRow * 8 + newCol].sort((a, b) => a - b).join('-');
          conflicts.add(conflict);
          break; // Stop checking this direction once a conflict is found
        }
        newRow += dx;
        newCol += dy;
      }
    }
  
    //console.log(`Conflicts for piece at (${row}, ${col}): ${Array.from(conflicts).join(', ')}`);
    return conflicts;
}