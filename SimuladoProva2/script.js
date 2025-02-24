document.addEventListener('DOMContentLoaded', () => {
    const playerGrid = document.getElementById('player-grid');
    const computerGrid = document.getElementById('computer-grid');
    const gridSize = 10;
    const shipLengths = [5, 4, 3, 3, 2]; // Tamanhos dos navios

    // Cria as grades para o jogador e o computador
    function createGrid(grid, isPlayer) {
        for (let i = 0; i < gridSize * gridSize; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.index = i;
            if (isPlayer) {
                cell.addEventListener('click', () => playerAttack(cell));
            }
            grid.appendChild(cell);
        }
    }

    // Posiciona os navios aleatoriamente
    function placeShips(grid, isPlayer) {
        shipLengths.forEach(length => {
            let placed = false;
            while (!placed) {
                const direction = Math.random() < 0.5 ? 'horizontal' : 'vertical';
                const row = Math.floor(Math.random() * gridSize);
                const col = Math.floor(Math.random() * gridSize);
                if (canPlaceShip(grid, row, col, length, direction)) {
                    placeShip(grid, row, col, length, direction, isPlayer);
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
                if (grid.children[row * gridSize + col + i].classList.contains('ship')) return false;
            }
        } else {
            if (row + length > gridSize) return false;
            for (let i = 0; i < length; i++) {
                if (grid.children[(row + i) * gridSize + col].classList.contains('ship')) return false;
            }
        }
        return true;
    }

    // Posiciona o navio na grade
    function placeShip(grid, row, col, length, direction, isPlayer) {
        if (direction === 'horizontal') {
            for (let i = 0; i < length; i++) {
                const cell = grid.children[row * gridSize + col + i];
                if (isPlayer) cell.classList.add('ship');
            }
        } else {
            for (let i = 0; i < length; i++) {
                const cell = grid.children[(row + i) * gridSize + col];
                if (isPlayer) cell.classList.add('ship');
            }
        }
    }

    // Lógica de ataque do jogador
    function playerAttack(cell) {
        if (cell.classList.contains('hit') || cell.classList.contains('miss')) return;
        if (cell.classList.contains('ship')) {
            cell.classList.add('hit');
            checkWin('player');
        } else {
            cell.classList.add('miss');
        }
        computerAttack();
    }

    // Lógica de ataque do computador
    function computerAttack() {
        let attacked = false;
        while (!attacked) {
            const index = Math.floor(Math.random() * gridSize * gridSize);
            const cell = playerGrid.children[index];
            if (!cell.classList.contains('hit') && !cell.classList.contains('miss')) {
                if (cell.classList.contains('ship')) {
                    cell.classList.add('hit');
                    checkWin('computer');
                } else {
                    cell.classList.add('miss');
                }
                attacked = true;
            }
        }
    }

    // Verifica se há um vencedor
    function checkWin(winner) {
        const ships = document.querySelectorAll(`.${winner === 'player' ? '#computer-grid' : '#player-grid'} .ship`);
        const hits = document.querySelectorAll(`.${winner === 'player' ? '#computer-grid' : '#player-grid'} .hit`);
        if (ships.length === hits.length) {
            alert(`${winner === 'player' ? 'Jogador' : 'Computador'} venceu!`);
            resetGame();
        }
    }

    // Reinicia o jogo
    function resetGame() {
        playerGrid.innerHTML = '';
        computerGrid.innerHTML = '';
        createGrid(playerGrid, true);
        createGrid(computerGrid, false);
        placeShips(playerGrid, true);
        placeShips(computerGrid, false);
    }

    // Inicializa o jogo
    createGrid(playerGrid, true);
    createGrid(computerGrid, false);
    placeShips(playerGrid, true);
    placeShips(computerGrid, false);
});