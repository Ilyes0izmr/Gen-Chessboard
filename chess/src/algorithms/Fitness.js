// src/algorithms/Fitness.js

export function calculateFitness(board) {
  // 1. Get conflicts and the specific squares involved using your Set logic
  const { totalConflicts, conflictSquares } = calculateConflictsWithData(board);

  // 2. Calculate heuristic penalties
  const penalty = calculateBishopPenalty(board) + 
                  calculateRookPenalty(board) + 
                  calculateKnightPenalty(board) + 
                  calculateQueenPenalty(board) +
                  calculateRookQueenPenalty(board) +
                  calculateBishopKnightPenalty(board);
                
  // 3. Return the full object exactly as requested
  return {
    fitness: 1 / (1 + totalConflicts + penalty),
    conflicts: totalConflicts,
    conflictSquares: conflictSquares
  };
}

export function calculateConflictsWithData(board) {
  let totalConflicts = 0;
  const conflictSquares = [];
  const checkedPairs = new Set(); // Using the Set exactly like your original logic

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece) {
        // Pass the Set into the helper to manage global pairs
        const result = findConflictsForPiece(board, row, col, piece, checkedPairs);
        
        totalConflicts += result.count;
        
        if (result.squares.length > 0) {
          conflictSquares.push(...result.squares);
          conflictSquares.push([row, col]); // Highlight the piece that is part of the conflict
        }
      }
    }
  }

  // No "/ 2" here, as the Set logic ensures we only count unique pairs
  return { 
    totalConflicts: totalConflicts, 
    conflictSquares: conflictSquares 
  };
}

export function findConflictsForPiece(board, row, col, piece, checkedPairs) {
  let count = 0;
  let squares = [];

  const movements = {
    Q: [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]],
    R: [[-1, 0], [1, 0], [0, -1], [0, 1]],
    B: [[-1, -1], [-1, 1], [1, -1], [1, 1]],
    K: [[-2, -1], [-2, 1], [2, -1], [2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2]],
  };

  const moves = movements[piece];

  for (const [dx, dy] of moves) {
    let nr = row + dx;
    let nc = col + dy;
    let currentPath = [];

    if (piece === 'K') {
      if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8 && board[nr][nc]) {
        // Create a unique key for this pair to avoid double counting
        const pairKey = [row, col, nr, nc].sort().join(',');
        if (!checkedPairs.has(pairKey)) {
          checkedPairs.add(pairKey);
          count++;
          squares.push([nr, nc]);
        }
      }
    } else {
      // Sliding pieces logic
      while (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
        currentPath.push([nr, nc]);
        if (board[nr][nc]) {
          const pairKey = [row, col, nr, nc].sort().join(',');
          if (!checkedPairs.has(pairKey)) {
            checkedPairs.add(pairKey);
            count++;
            squares.push(...currentPath); 
          }
          break; // Stop sliding after hitting a piece
        }
        nr += dx;
        nc += dy;
      }
    }
  }

  return { count, squares };
}

// --- Penalty Functions (Keep exactly as they were) ---

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
      if (board[row][col] === 'R') colCounts[col]++;
    }
  }
  for (let col = 0; col < 8; col++) {
    if (colCounts[col] > 1) penalty += colCounts[col] - 1;
  }
  return penalty;
}

function calculateKnightPenalty(board) {
  let penalty = 0;
  const knightMoves = [[-2, -1], [-2, 1], [2, -1], [2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2]];
  const checkedKnights = new Set();
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (board[row][col] === 'K') {
        for (const [dx, dy] of knightMoves) {
          const nr = row + dx, nc = col + dy;
          if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8 && board[nr][nc] === 'K') {
            const key = [row, col, nr, nc].sort().join(',');
            if (!checkedKnights.has(key)) {
              checkedKnights.add(key);
              penalty++;
            }
          }
        }
      }
    }
  }
  return penalty;
}

function calculateQueenPenalty(board) {
  let penalty = 0;
  const rowCounts = Array(8).fill(0), colCounts = Array(8).fill(0);
  const mainDiag = Array(15).fill(0), antiDiag = Array(15).fill(0);
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (board[row][col] === 'Q') {
        rowCounts[row]++; colCounts[col]++;
        mainDiag[row - col + 7]++; antiDiag[row + col]++;
      }
    }
  }
  for (let i = 0; i < 15; i++) {
    if (i < 8) {
      if (rowCounts[i] > 1) penalty += rowCounts[i] - 1;
      if (colCounts[i] > 1) penalty += colCounts[i] - 1;
    }
    if (mainDiag[i] > 1) penalty += mainDiag[i] - 1;
    if (antiDiag[i] > 1) penalty += antiDiag[i] - 1;
  }
  return penalty;
}

function calculateRookQueenPenalty(board) {
  let penalty = 0;
  const colCounts = Array(8).fill(0);
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (board[row][col] === 'R' || board[row][col] === 'Q') colCounts[col]++;
    }
  }
  for (let col = 0; col < 8; col++) {
    if (colCounts[col] > 1) penalty += colCounts[col] - 1;
  }
  return penalty;
}

function calculateBishopKnightPenalty(board) {
  let penalty = 0;
  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (board[row][col] === 'B') {
        let hasKnightNeighbor = false;
        for (const [dr, dc] of directions) {
          const nr = row + dr, nc = col + dc;
          if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8 && board[nr][nc] === 'K') {
            hasKnightNeighbor = true; break;
          }
        }
        if (!hasKnightNeighbor) penalty++;
      }
    }
  }
  return penalty;
}