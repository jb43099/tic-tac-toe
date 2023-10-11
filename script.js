const gridContainer = document.querySelector('.grid-container')
const startButton = document.querySelector('.start-game button')

const gameBoard = (function () {
    const grid = Array('0', '1', '2', '3', '4', '5', '6', '7', '8')

    const displayGrid = () => {
        let i = 0
        grid.forEach(cell => {
            const cellDiv = document.createElement('div')
            cellDiv.dataset.cellNumber = `${i}`
            cellDiv.classList.add('cell')
            gridContainer.appendChild(cellDiv)
            i++
        })
    };

    const clearGrid = () => {
        for (let i = 0; i < grid.length + 1; i++) {
            gridContainer.removeChild(gridContainer.firstChild)
        }
    }

    return { grid, displayGrid, clearGrid }
})();

function createPlayer(user, option) {
    const player = user
    const choice = option
    const chosenArray = []

    return { player, choice, chosenArray };
};

const game = (function () {
    const player1 = createPlayer('Player 1', 'X')
    const player2 = createPlayer('Player 2', 'O')
    let currentPlayer = player1

    const togglePlayer = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1
    };


    const checkWinner = () => {
        const winCombos = [
            ['0', '1', '2'], ['3', '4', '5'], ['6', '7', '8'], // Rows
            ['0', '3', '6'], ['1', '4', '7'], ['2', '5', '8'], // Columns
            ['0', '4', '8'], ['2', '4', '6']                // Diagonals
        ]

        for (let combo of winCombos) {
            if (combo.every(cell => currentPlayer.chosenArray.includes(cell))) {
                return true
            }
        }
    };

    const updatePlayerArray = (e) => {
        const cells = Array(9)
        let i = 0
        for (let i = 0; i < 9; i++) {
            cells[i] = document.querySelector(`[data-cell-number="${i}"]`);
        }
        currentPlayer.chosenArray.push(e.target.dataset.cellNumber)
    };

    const handleCellClick = (e) => {
        const selectedCell = e.target
        if (selectedCell.innerText === '') {
            selectedCell.innerText = currentPlayer.choice
            updatePlayerArray(e)
            if (checkWinner() == true) {
                let winningPlayer = currentPlayer
                setTimeout(() => {
                    alert(`${winningPlayer.player} wins!`)
                    gameBoard.clearGrid()
                }, 100)
            }
            togglePlayer()
        }
    };

    const startGame = () => {
        gridContainer.addEventListener('click', handleCellClick)
        player1.chosenArray = []
        player2.chosenArray = []
        currentPlayer = player1
    };

    return { player1, player2, startGame, togglePlayer, currentPlayer }
})();

startButton.addEventListener('click', () => {
    gameBoard.displayGrid()
    game.startGame()
});
