const boardElement = document.getElementById('board');
const statusElement = document.getElementById('status');
let board = Array(7).fill().map(() => Array(7).fill(null));
let currentPlayer = 'azul';
let lastMove = null;
let gameEnded = false; //Estado do jogo
let vitorias = {
    azul: 0,
    vermelho: 0
};
// Cria o tabuleiro
function tabuleiro() {
    atualizarContadorVitorias();
    for (let row = 0; row < 7; row++) {
        for (let col = 0; col < 7; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener('click', movimento);
            boardElement.appendChild(cell);
        }
    }
}

// Lida com o clique em uma célula
function movimento(event) {
    if (gameEnded) return;
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);

    if (board[row][col] === null && movValido(row, col)) {
        board[row][col] = currentPlayer;
        event.target.classList.add(currentPlayer);
        lastMove = { row, col };

        if (verificaVitoria(row, col)) {
            gameEnded = true;
            vitorias[currentPlayer] += 1;
            atualizarContadorVitorias();
            vencedor = currentPlayer;
            const msgVitoria = document.createElement('h1');
            msgVitoria.textContent = `Jogador ${currentPlayer.toUpperCase()} venceu!`;
            document.body.appendChild(msgVitoria);

            const tempoEspera = 5000;
            let tempoRestante = tempoEspera / 1000; 

            // Aguarda 5 segundos e então reinicia o jogo automaticamente
            const intervalo = setInterval(() => {
                tempoRestante -= 1; // Decrementa o tempo restante
                msgVitoria.textContent = `Jogador ${vencedor.toUpperCase()} venceu! Reiniciando em ${tempoRestante}...`;

                // Quando o tempo acabar, reinicia o jogo e limpa o intervalo
                if (tempoRestante <= 0) {
                    clearInterval(intervalo); // Para o contador
                    resetGame();
                    msgVitoria.remove(); // Remove a mensagem de vitória
                }
            }, 1000);
        } else if (verificaEmpate(row, col)) {
            gameEnded = true
            const msgEmpate = document.createElement('p');
            msgEmpate.textContent = 'O jogo terminou em empate!';
            document.body.appendChild(msgEmpate);
            
            setTimeout(() => {
                msgEmpate.remove();
                resetGame();
            }, 5000);
        }

        // Alterna o jogador
        currentPlayer = currentPlayer === 'azul' ? 'vermelho' : 'azul';
        statusElement.textContent = `Vez do Jogador ${currentPlayer.toUpperCase()}`;

        // Destaca as células válidas para a próxima jogada
        movValidos();
    }
}

function verificaEmpate(row, col) {
    
    for (let row = 0; row < 7; row++) {
        for (let col = 0; col < 7; col++) {
            if (board[row][col] === null) {
                return false; // Ainda há espaços vazios, então não é empate
            }
        }
    }
    return true; // Todas as células estão preenchidas
}

function atualizarContadorVitorias() {
    // Verifica se o elemento de contador já existe
    let contadorVitorias = document.getElementById('contador-vitorias');
    if (!contadorVitorias) {
        // Se não existir, cria um novo elemento
        contadorVitorias = document.createElement('div');
        contadorVitorias.id = 'contador-vitorias';
        contadorVitorias.style.marginTop = '20px';
        contadorVitorias.style.fontSize = '1.2em';
        document.body.appendChild(contadorVitorias);
    }

    // Atualiza o conteúdo do contador
    contadorVitorias.innerHTML = `
        Vitórias - Azul: ${vitorias.azul} | Vermelho: ${vitorias.vermelho}
    `;
}

// Verifica se o tabuleiro é válido
function movValido(row, col) {
    // Se for a primeira jogada, qualquer célula é válida
    if (lastMove === null) return true;

    const { row: lastRow, col: lastCol } = lastMove;

    // Verifica se a célula está vazia
    if (board[row][col] !== null) return false;

    // Verifica se a célula clicada é adjacente à última jogada
    const isAdjacent = Math.abs(row - lastRow) <= 1 && Math.abs(col - lastCol) <= 1;

    // Se a célula for adjacente, o tabuleiro é válido
    if (isAdjacent) return true;

    // Se não for adjacente, verifica se ainda há células adjacentes disponíveis
    const adjacentCells = [
        { row: lastRow - 1, col: lastCol - 1 }, // Diagonal superior esquerda
        { row: lastRow - 1, col: lastCol },     // Acima
        { row: lastRow - 1, col: lastCol + 1 }, // Diagonal superior direita
        { row: lastRow, col: lastCol - 1 },     // Esquerda
        { row: lastRow, col: lastCol + 1 },     // Direita
        { row: lastRow + 1, col: lastCol - 1 }, // Diagonal inferior esquerda
        { row: lastRow + 1, col: lastCol },     // Abaixo
        { row: lastRow + 1, col: lastCol + 1 }  // Diagonal inferior direita
    ];

    // Verifica se há pelo menos uma célula adjacente disponível
    const hasAvailableAdjacentCells = adjacentCells.some(({ row, col }) =>
        row >= 0 && row < 7 && col >= 0 && col < 7 && board[row][col] === null
    );

    // Se ainda houver células adjacentes disponíveis, o tabuleiro é inválido
    if (hasAvailableAdjacentCells) return false;

    // Se não houver células adjacentes disponíveis, o tabuleiro é válido
    return true;
}

// Verifica se há um vencedor
function verificaVitoria(row, col) {
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

// Reinicia o jogo
function resetGame() {
    gameEnded = false

    // Limpa o tabuleiro visual
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.classList.remove('azul', 'vermelho', 'highlight');
    });

    // Reinicia a matriz do tabuleiro
    board = Array(7).fill().map(() => Array(7).fill(null));

    // Reinicia as variáveis do jogo
    currentPlayer = 'azul';
    lastMove = null;

    // Atualiza a mensagem de status
    statusElement.textContent = 'Jogador Azul começa!';

    // Reativa os eventos de clique
    boardElement.addEventListener('click', movimento);

    // Destaca as células válidas no início do jogo
    movValidos();
}

// Destaca as células válidas para a próxima jogada
function movValidos() {
    // Remove o destaque de todas as células
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.classList.remove('highlight');
    });

    // Se for a primeira jogada, todas as células são válidas
    if (lastMove === null) {
        cells.forEach(cell => {
            cell.classList.add('highlight');
        });
        return;
    }

    const { row: lastRow, col: lastCol } = lastMove;

    // Verifica as células adjacentes à última jogada
    const adjacentCells = [
        { row: lastRow - 1, col: lastCol - 1 }, // Diagonal superior esquerda
        { row: lastRow - 1, col: lastCol },     // Acima
        { row: lastRow - 1, col: lastCol + 1 }, // Diagonal superior direita
        { row: lastRow, col: lastCol - 1 },     // Esquerda
        { row: lastRow, col: lastCol + 1 },     // Direita
        { row: lastRow + 1, col: lastCol - 1 }, // Diagonal inferior esquerda
        { row: lastRow + 1, col: lastCol },     // Abaixo
        { row: lastRow + 1, col: lastCol + 1 }  // Diagonal inferior direita
    ];

    // Destaca as células adjacentes válidas
    adjacentCells.forEach(({ row, col }) => {
        if (row >= 0 && row < 7 && col >= 0 && col < 7 && board[row][col] === null) {
            const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
            cell.classList.add('highlight');
        }
    });

    // Se não houver células adjacentes válidas, destaca todas as células vazias
    const hasValidAdjacentCells = adjacentCells.some(({ row, col }) =>
        row >= 0 && row < 7 && col >= 0 && col < 7 && board[row][col] === null
    );

    if (!hasValidAdjacentCells) {
        cells.forEach(cell => {
            if (board[cell.dataset.row][cell.dataset.col] === null) {
                cell.classList.add('highlight');
            }
        });
    }
    
}

// Inicializa o jogo
tabuleiro();