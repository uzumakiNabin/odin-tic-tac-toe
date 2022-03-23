const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const player = (name, sign) => {
    const getName = () => name;
    const getSign = () => sign;
    const mark = (square) => {
        square.textContent = sign;
    }
    return {getName, getSign, mark};
};

const gameboard = () => {
    let board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    const getBoard = () => board;

    const updateBoard = (sign, index) => {
        board[index] = sign;
    }

    return {getBoard, updateBoard};
}

const game = (name1, name2) => {
    const turnField = document.getElementsByClassName('showTurn')[0];
    const winnerField = document.getElementsByClassName('showWinner')[0];

    const player1 = player(name1, 'X');
    const player2 = player(name2, 'O');
    const board = gameboard();

    let turn = player1;
    turnField.textContent = `${player1.getName()}'s turn.`;

    const changeTurn = () => {
        if(turn.getSign() === player1.getSign()){
            turn = player2;
            turnField.textContent = `${player2.getName()}'s turn.`;
        }
        else{
            turn = player1;
            turnField.textContent = `${player1.getName()}'s turn.`;
        }
    };

    const checkWin = () => {
        let currentBoard = board.getBoard();
        let xCounter, oCounter;
        let won = winConditions.some(condition => {
            xCounter = 0;
            oCounter = 0;
            condition.forEach(squareIndex => {
                if(currentBoard[squareIndex] === 'X'){
                    xCounter++;
                }
                if(currentBoard[squareIndex] === 'O'){
                    oCounter++;
                }
            });
            if(xCounter == 3 || oCounter == 3){
                return true;
            }
            else{
                return false;
            }
        });
        if(won && (xCounter == 3)){
            winnerField.textContent = `${player1.getName()} won.`;
            turnField.textContent = "";
            return true;
        }
        else if(won && (oCounter == 3)){
            winnerField.textContent = `${player2.getName()} won`;
            turnField.textContent = "";
            return true;
        }
        if(!won && (currentBoard.indexOf(0) == -1)){
            winnerField.textContent = "It's a tie."
            turnField.textContent = "";
            return true;
        }
        return false;
    }

    const playGame = (htmlTarget, index) => {
        turn.mark(htmlTarget);
        board.updateBoard(turn.getSign(), index);
        if(checkWin()){
            return;
        }
        changeTurn();
    }
    return {playGame, checkWin};
};

const display = (() =>{
    const player1 = document.getElementsByName('player1');
    const playerOneNameInput = document.getElementById('player1name');
    const player2 = document.getElementsByName('player2');
    const playerTwoNameInput = document.getElementById('player2name');
    const start = document.getElementById('start');
    const gameBoardEl = document.getElementsByClassName('gameboard')[0];
    const squares = gameBoardEl.getElementsByClassName('square');
    const winnerField = document.getElementsByClassName('showWinner')[0];
    const restart = document.getElementById('restart');

    let playerOneName, playerTwoName;

    const startGame = () => {
        if(player1[0].checked){
            playerOneName = 'Computer 1';
        }
        else{
            if(playerOneNameInput.value == ""){
                playerOneName = 'Player 1';
            }
            else{
                playerOneName = playerOneNameInput.value;
            }
        }
        if(player2[0].checked){
            playerTwoName = 'Computer 2';
        }
        else{
            if(playerTwoNameInput.value == ""){
                playerTwoName = 'Player 2';
            }
            else{
                playerTwoName = playerTwoNameInput.value;
            }
        }
        const newGame = game(playerOneName, playerTwoName);
        winnerField.textContent = "";
        Array.from(squares).forEach((square, index) => {
            square.textContent = "";
            square.addEventListener('click', e => {
                if(!newGame.checkWin()){
                    newGame.playGame(e.target, index);
                }
            }, {once: true});
        });
    };

    start.addEventListener('click', startGame);

    restart.addEventListener('click', startGame);
})();