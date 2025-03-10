const boardElement = document.getElementById('board');
const statusElement = document.getElementById('status');
let board = Array(7).fill().map(() => Array(7).fill(null)); // Matriz 7x7
let currentPlayer = 'blue'; // Azul começa
let lastMove = null; // Última jogada

// Cria o tabuleiro
function createBoard() {
  for (let row = 0; row < 7; row++) {
    for (let col = 0; col < 7; col++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.addEventListener('click', handleCellClick);
      boardElement.appendChild(cell);
    }
  }
}

// Lida com o clique em uma célula
function handleCellClick(event) {
  const row = parseInt(event.target.dataset.row);
  const col = parseInt(event.target.dataset.col);

  // Verifica se a célula está vazia
  if (board[row][col] === null && isValidMove(row, col)) {
    board[row][col] = currentPlayer;
    event.target.classList.add(currentPlayer);
    lastMove = { row, col };

    // Verifica se há um vencedor
    if (checkWin(row, col)) {
      statusElement.textContent = `Jogador ${currentPlayer.toUpperCase()} venceu!`;
      boardElement.removeEventListener('click', handleCellClick);
      return;
    }

    // Alterna o jogador
    currentPlayer = currentPlayer === 'blue' ? 'red' : 'blue';
    statusElement.textContent = `Vez do Jogador ${currentPlayer.toUpperCase()}`;
  }
}

// Verifica se o movimento é válido
function isValidMove(row, col) {
  if (lastMove === null) return true; // Primeira jogada
  const { row: lastRow, col: lastCol } = lastMove;
  return Math.abs(row - lastRow) <= 1 && Math.abs(col - lastCol) <= 1;
}

// Verifica se há um vencedor
function checkWin(row, col) {
  const directions = [
    [1, 0], [0, 1], [1, 1], [1, -1] // Horizontal, Vertical, Diagonal
  ];

  for (const [dx, dy] of directions) {
    let count = 1;
    // Verifica em uma direção
    for (let i = 1; i < 4; i++) {
      const newRow = row + dx * i;
      const newCol = col + dy * i;
      if (newRow >= 0 && newRow < 7 && newCol >= 0 && newCol < 7 && board[newRow][newCol] === currentPlayer) {
        count++;
      } else {
        break;
      }
    }
    // Verifica na direção oposta
    for (let i = 1; i < 4; i++) {
      const newRow = row - dx * i;
      const newCol = col - dy * i;
      if (newRow >= 0 && newRow < 7 && newCol >= 0 && newCol < 7 && board[newRow][newCol] === currentPlayer) {
        count++;
      } else {
        break;
      }
    }
    if (count >= 4) return true;
  }
  return false;
}

// Inicializa o jogo
createBoard();