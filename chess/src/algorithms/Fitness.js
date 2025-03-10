export function calculateFitness(board) {
  const conflictCount = calculateConflicts(board);
  const penalty = calculateColumnPenalty(board); 
  console.log(`Total Conflicts: ${conflictCount}, Penalty: ${penalty}`);
  return 1 / (1 + conflictCount + penalty); 
}
export function calculateConflicts(board) {
  let conflictCount = 0;
  const checkedPairs = new Set(); 

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece) {
        conflictCount += findConflictsForPiece(board, row, col, piece, checkedPairs);
      }
    }
  }
  return conflictCount;
}
function findConflictsForPiece(board, row, col, piece) {
  let conflictCount = 0;

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
    K: [ // Knight moves
      [-2, -1], [-2, 1], [2, -1], [2, 1],
      [-1, -2], [-1, 2], [1, -2], [1, 2],
    ],
  };

  if (piece === 'K') { 
    // Knights jump directly to their positions
    for (const [dx, dy] of movements.K) {
      const newRow = row + dx;
      const newCol = col + dy;
      if (
        newRow >= 0 && newRow < 8 &&
        newCol >= 0 && newCol < 8 &&
        board[newRow][newCol]
      ) {
        conflictCount++;
      }
    }
  } else {
   
    for (const [dx, dy] of movements[piece]) {
      let newRow = row + dx;
      let newCol = col + dy;

      while (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
        if (board[newRow][newCol]) {
          conflictCount++;
          break; 
        }
        newRow += dx;
        newCol += dy;
      }
    }
  }

  return conflictCount;
}
function calculateColumnPenalty(board) {
  let penalty = 0;

  for (let i = 0; i < 8; i++) {
    let queenCountInColumn = 0;
    let queenCountInRow = 0;

    for (let j = 0; j <8; j++) {
       
      if (board[j][i] === 'Q') {
        queenCountInColumn++;
      }

      if (board[i][j] === 'Q') {
        queenCountInRow++;
      }
    }

    if (queenCountInColumn > 1) {
      penalty += queenCountInColumn - 1;
    }
    if (queenCountInRow > 1) {
      penalty += queenCountInRow - 1;
    }
  }
  return penalty;
}