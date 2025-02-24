document.addEventListener('DOMContentLoaded', () => {
    const playerGrid = document.getElementById('player-grid');
    const attemptsCount = document.getElementById('attempts-count');
    const gridSize = 9;
    const shipLengths = [5, 4, 3, 3, 2]; // Tamanhos dos navios
    let attempts = 0;

    // Cria a grade 9x9 com números nas bordas
    function createGrid(grid) {
        for (let row = 0; row <= gridSize; row++) {
            for (let col = 0; col <= gridSize; col++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');

                // Adiciona números nas bordas
                if (row === gridSize && col === gridSize) {
                    cell.classList.add('number');
                    cell.textContent = '';
                } else if (row === gridSize) {
                    cell.classList.add('number');
                    cell.textContent = '0'; // Inicializa com 0
                } else if (col === gridSize) {
                    cell.classList.add('number');
                    cell.textContent = '0'; // Inicializa com 0
                } else {
                    cell.dataset.row = row;
                    cell.dataset.col = col;
                    cell.addEventListener('click', () => playerAttack(cell));
                }

                grid.appendChild(cell);
            }
        }
    }

    // Posiciona os navios aleatoriamente
    function placeShips(grid) {
        shipLengths.forEach(length => {
            let placed = false;
            while (!placed) {
                const direction = Math.random() < 0.5 ? 'horizontal' : 'vertical';
                const row = Math.floor(Math.random() * gridSize);
                const col = Math.floor(Math.random() * gridSize);
                if (canPlaceShip(grid, row, col, length, direction)) {
                    placeShip(grid, row, col, length, direction);
                    placed = true;
                }
            }
        });
    }

    // Verifica se é possível posicionar o navio
    function canPlaceShip(grid, row, col, length, direction) {
        if (direction === 'horizontal') {
            if (col + length > gridSize) return false;
            for (let i = 0; i < length; i++) {
                if (grid.children[row * (gridSize + 1) + col + i].classList.contains('ship')) return false;
            }
        } else {
            if (row + length > gridSize) return false;
            for (let i = 0; i < length; i++) {
                if (grid.children[(row + i) * (gridSize + 1) + col].classList.contains('ship')) return false;
            }
        }
        return true;
    }

    // Posiciona o navio na grade
    function placeShip(grid, row, col, length, direction) {
        if (direction === 'horizontal') {
            for (let i = 0; i < length; i++) {
                const cell = grid.children[row * (gridSize + 1) + col + i];
                cell.classList.add('ship');
                updateRowColCount(grid, row, col + i, 1);
            }
        } else {
            for (let i = 0; i < length; i++) {
                const cell = grid.children[(row + i) * (gridSize + 1) + col];
                cell.classList.add('ship');
                updateRowColCount(grid, row + i, col, 1);
            }
        }
    }

    // Atualiza os números nas bordas
    function updateRowColCount(grid, row, col, value) {
        // Atualiza a linha
        const rowCell = grid.children[row * (gridSize + 1) + gridSize];
        rowCell.textContent = parseInt(rowCell.textContent) + value;

        // Atualiza a coluna
        const colCell = grid.children[gridSize * (gridSize + 1) + col];
        colCell.textContent = parseInt(colCell.textContent) + value;
    }

    // Lógica de ataque do jogador
    function playerAttack(cell) {
        if (cell.classList.contains('hit') || cell.classList.contains('miss')) return;

        attempts++;
        attemptsCount.textContent = attempts;

        if (cell.classList.contains('ship')) {
            cell.classList.add('hit'); // Verde para acerto
            updateRowColCount(playerGrid, parseInt(cell.dataset.row), parseInt(cell.dataset.col), -1);
            checkWin();
        } else {
            cell.classList.add('miss'); // Vermelho para erro
        }
    }

    // Verifica se todos os navios foram afundados
    function checkWin() {
        const ships = document.querySelectorAll('.ship:not(.hit)');
        if (ships.length === 0) {
            alert(`Parabéns! Você venceu em ${attempts} tentativas.`);
            resetGame();
        }
    }

    // Reinicia o jogo
    function resetGame() {
        playerGrid.innerHTML = '';
        attempts = 0;
        attemptsCount.textContent = '0';
        createGrid(playerGrid);
        placeShips(playerGrid);
    }

    // Inicializa o jogo
    createGrid(playerGrid);
    placeShips(playerGrid);
});