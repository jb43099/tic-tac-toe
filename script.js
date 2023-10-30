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
        while (gridContainer.firstChild) {
            gridContainer.removeChild(gridContainer.firstChild);
        }
        startButton.style.display = 'inline';
        const turnDiv = document.querySelector('.turn-div')
        if (turnDiv) { turnDiv.remove() }
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

    const displayTurn = () => {
        const turnContainer = document.querySelector('.turn-container')
        const turnDiv = document.createElement('div')
        turnDiv.classList.add('turn-div')
        turnDiv.innerText = `${currentPlayer.choice} turn`
        turnContainer.appendChild(turnDiv)
    }

    const updateTurn = (nextPlayer, selectedCell) => {
        if (selectedCell.innerText !== '') return
        const turnDiv = document.querySelector('.turn-div')
        turnDiv.innerText = `${nextPlayer.choice} turn`
    }

    const checkWinner = () => {
        const winCombos = [
            ['0', '1', '2'], ['3', '4', '5'], ['6', '7', '8'], // Rows
            ['0', '3', '6'], ['1', '4', '7'], ['2', '5', '8'], // Columns
            ['0', '4', '8'], ['2', '4', '6']                // Diagonals
        ]
        let gridChosen = []
        gridChosen = gridChosen.concat(player1.chosenArray, player2.chosenArray)
        const turnDiv = document.querySelector('.turn-div')

        for (let combo of winCombos) {
            if (combo.every(cell => currentPlayer.chosenArray.includes(cell))) {
                let winningPlayer = currentPlayer
                turnDiv.innerText = `${winningPlayer.player} wins!`
                gridContainer.style.pointerEvents = 'none'
                setTimeout(() => {
                    // alert(`${winningPlayer.player} wins!`)
                    gameBoard.clearGrid()
                }, 2500)
                return true
            }
            if (!(combo.every(cell => currentPlayer.chosenArray.includes(cell))) && gridChosen.length == 9) {
                turnDiv.innerText = `Draw!`
                gridContainer.style.pointerEvents = 'none'
                setTimeout(() => {
                    // alert(`Draw!`)
                    gameBoard.clearGrid()
                }, 2500)
                return false
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
        const nextPlayer = currentPlayer == player1 ? player2 : player1
        const selectedCell = e.target
        updateTurn(nextPlayer, selectedCell)
        if (selectedCell.innerText === '') {
            selectedCell.innerText = currentPlayer.choice
            updatePlayerArray(e)
            checkWinner()
            togglePlayer()
        }
    };

    const startGame = () => {
        gridContainer.addEventListener('click', handleCellClick)
        player1.chosenArray = []
        player2.chosenArray = []
        currentPlayer = player1
        gridContainer.style.pointerEvents = 'auto'
    };

    return { startGame, displayTurn }
})();

startButton.addEventListener('click', () => {
    gameBoard.displayGrid()
    game.startGame()
    game.displayTurn()
    startButton.style.display = 'none'
});

document.addEventListener('dblclick', (e) => {
    e.preventDefault();
})