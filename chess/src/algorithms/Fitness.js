export function calculateFitness(board) {
  const conflictCount = calculateConflicts(board);
  const penalty = calculateBishopPenalty(board) + 
                  calculateRookPenalty(board) + 
                  calculateKnightPenalty(board) + 
                  calculateQueenPenalty(board) +
                  calculateRookQueenPenalty(board)+
                  calculateBishopKnightPenalty(board);
                
  //console.log(`Total Conflicts: ${conflictCount}, Penalty: ${penalty}`);
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
export function findConflictsForPiece(board, row, col, piece) {
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


function calculateBishopPenalty(board) {
  let penalty = 0;
  const mainDiagonalCounts = Array(15).fill(0);
  const antiDiagonalCounts = Array(15).fill(0);

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (board[row][col] === 'B') {
        mainDiagonalCounts[row - col + 7]++;
        antiDiagonalCounts[row + col]++;
      }
    }
  }

  for (let i = 0; i < 15; i++) {
    if (mainDiagonalCounts[i] > 1) penalty += mainDiagonalCounts[i] - 1;
    if (antiDiagonalCounts[i] > 1) penalty += antiDiagonalCounts[i] - 1;
  }

  return penalty;
}
function calculateRookPenalty(board) {
  let penalty = 0;
  const colCounts = Array(8).fill(0);

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (board[row][col] === 'R') {
        colCounts[col]++;
      }
    }
  }

  for (let col = 0; col < 8; col++) {
    if (colCounts[col] > 1) penalty += colCounts[col] - 1;
  }

  return penalty;
}
function calculateKnightPenalty(board) {
  let penalty = 0;
  const knightMoves = [
    [-2, -1], [-2, 1], [2, -1], [2, 1],
    [-1, -2], [-1, 2], [1, -2], [1, 2],
  ];

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (board[row][col] === 'K') {
        for (const [dx, dy] of knightMoves) {
          const newRow = row + dx;
          const newCol = col + dy;
          if (
            newRow >= 0 && newRow < 8 &&
            newCol >= 0 && newCol < 8 &&
            board[newRow][newCol] === 'K'
          ) {
            penalty++;
          }
        }
      }
    }
  }

  return penalty;
}
function calculateQueenPenalty(board) {
  let penalty = 0;
  const rowCounts = Array(8).fill(0);
  const colCounts = Array(8).fill(0);
  const mainDiagonalCounts = Array(15).fill(0); // Left to Right (\)
  const antiDiagonalCounts = Array(15).fill(0); // Right to Left (/)

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (board[row][col] === 'Q') {
        rowCounts[row]++;
        colCounts[col]++;
        mainDiagonalCounts[row - col + 7]++;
        antiDiagonalCounts[row + col]++;
      }
    }
  }

  for (let i = 0; i < 8; i++) {
    if (rowCounts[i] > 1) penalty += rowCounts[i] - 1;
    if (colCounts[i] > 1) penalty += colCounts[i] - 1;
  }

  for (let i = 0; i < 15; i++) {
    if (mainDiagonalCounts[i] > 1) penalty += mainDiagonalCounts[i] - 1;
    if (antiDiagonalCounts[i] > 1) penalty += antiDiagonalCounts[i] - 1;
  }

  return penalty;
}
function calculateRookQueenPenalty(board) {
  let penalty = 0;
  const colCounts = Array(8).fill(0);

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (board[row][col] === 'R' || board[row][col] === 'Q') {
        colCounts[col]++;
      }
    }
  }

  for (let col = 0; col < 8; col++) {
    if (colCounts[col] > 1) penalty += colCounts[col] - 1;
  }

  return penalty;
}

function calculateBishopKnightPenalty(board) {
  let penalty = 0;
  const directions = [
    [-1, 0], [1, 0], [0, -1], [0, 1] // Up, Down, Left, Right
  ];

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (board[row][col] === 'B') {
        let hasKnightNeighbor = false;

        for (const [dr, dc] of directions) {
          const newRow = row + dr;
          const newCol = col + dc;

          if (
            newRow >= 0 && newRow < 8 &&
            newCol >= 0 && newCol < 8 &&
            board[newRow][newCol] === 'K'
          ) {
            hasKnightNeighbor = true;
            break;
          }
        }

        if (!hasKnightNeighbor) penalty++;
      }
    }
  }

  return penalty;
}


