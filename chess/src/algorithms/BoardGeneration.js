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

export function generateRandomBoard() {
  const board = Array.from({ length: 8 }, () => Array(8).fill(null));

  // Upper and lower half piece distributions
  placePiecesRandomly(board, 0, 3, ['Q', 'Q', 'R', 'B', 'K']);
  placePiecesRandomly(board, 4, 7, ['Q', 'Q', 'R', 'B', 'K']);

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
