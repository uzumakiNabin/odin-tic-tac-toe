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

const gameboard = (() => {
    let board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    const getBoard = () => board;

    const getUnmarkedSquares = () => {
        let unmarkedSquares = [];
        board.forEach((value, index) => {
            if(value === 0){
                unmarkedSquares.push(index);
            }
        });
        return unmarkedSquares;
    }

    const updateBoard = (sign, index) => {
        board[index] = sign;
    }

    const resetBoard = () => {
        board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    }

    return {getBoard, getUnmarkedSquares, updateBoard, resetBoard};
})();

const display = (() =>{
    const playerOneRadio = document.getElementsByName('player1');
    const playerOneNameInput = document.getElementById('player1name');
    const playerTwoRadio = document.getElementsByName('player2');
    const playerTwoNameInput = document.getElementById('player2name');
    const playerOneErrorField = document.getElementById('player1error');
    const playerTwoErrorField = document.getElementById('player2error');
    const startButton = document.getElementById('start');
    const gameContainer = document.getElementsByClassName('gameContainer')[0];
    const gameBoardEl = document.getElementsByClassName('gameboard')[0];
    const turnField = document.getElementsByClassName('showTurn')[0];
    const winnerField = document.getElementsByClassName('showWinner')[0];

    const renderBoard = () => {
        gameBoardEl.innerHTML = "";
        gameboard.getBoard().forEach(value => {
            let square = document.createElement('div');
            square.classList.add('square');
            let squareValue = document.createElement('span');
            squareValue.textContent = value;
            if(value){
                square.appendChild(squareValue);
            }
            gameBoardEl.appendChild(square);
        })
    };

    const getPlayerTypes = () => {
        playerOneErrorField.textContent = "";
        playerTwoErrorField.textContent = "";
        if(playerOneRadio[0].checked){
            game.playerOne.name = 'Computer 1';
            game.playerOne.type = 'computer';
        }
        else if(playerOneRadio[1].checked){
            game.playerOne.type = 'human';
            if(playerOneNameInput.value === ""){
                game.playerOne.name = 'Player 1';
            }
            else{
                game.playerOne.name = playerOneNameInput.value;
            }
        }
        else {
            playerOneErrorField.textContent = "Please select player 1 type.";
            return false;
        }
        if(playerTwoRadio[0].checked){
            game.playerTwo.name = 'Computer 2';
            game.playerTwo.type = 'computer';
        }
        else if(playerTwoRadio[1].checked){
            game.playerTwo.type = 'human'
            if(playerTwoNameInput.value === ""){
                game.playerTwo.name = 'Player 2';
            }
            else{
                game.playerTwo.name = playerTwoNameInput.value;
            }
        }
        else{
            playerTwoErrorField.textContent = "Please select player 2 type.";
            return false;
        }
        return true;
    }

    const showWhosTurn = (player) => {
        if(player.name){
            turnField.textContent = `${player.name}'s turn`;
        }
        else {
            turnField.textContent = '';
        }
    }

    const showWinCondition = (player) => {
        if(player){
            winnerField.textContent = `${player.name} won`;
        }
        else {
            winnerField.textContent = "It's a tie";
        }
    }

    const clearAll = () => {
        turnField.textContent = '';
        winnerField.textContent = '';
    }

    return {startButton, gameContainer, gameBoardEl, renderBoard, getPlayerTypes, showWhosTurn, showWinCondition, clearAll};
})();

const game = (() => {

    let playerOne = {
        name: '',
        sign: 'X',
        type: '',
    };

    let playerTwo = {
        name: '',
        sign: 'O',
        type: '',
    };

    let turn = playerTwo;

    const init = () => {
        display.startButton.addEventListener('click', initEventFunctionWrapper);
    };

    const initEventFunctionWrapper = () => {
        if(display.getPlayerTypes()){
            startGame();
        }
    }

    const resetEventFunctionWrapper = () => {
        display.startButton.value = 'Start game';
        display.startButton.removeEventListener('click', resetEventFunctionWrapper);
        init();
        display.gameContainer.style.display = 'none';
        display.clearAll();
    }

    const startGame = () => {
        display.startButton.value = 'Reset game';
        display.startButton.removeEventListener('click', initEventFunctionWrapper);
        display.startButton.addEventListener('click', resetEventFunctionWrapper);
        gameboard.resetBoard();
        display.gameContainer.style.display = 'flex';
        display.renderBoard();
        playGame();
    };

    const playGame = () => {
        if(!checkWin()){
            changePlayerTurn();
            display.showWhosTurn(turn);
            if(turn.type === 'human'){
                humanPlay(turn.sign);
            }
            else if(turn.type === 'computer'){
                setTimeout(() => {
                    computerPlay(turn.sign)
                }, 1500);
            }
        }
        if(checkWin()){
            display.showWinCondition(turn);
        }
    }

    const changePlayerTurn = () => {
        if(turn.sign === playerOne.sign){
            turn = playerTwo;
        }
        else{
            turn = playerOne;
        }
    }

    const humanPlay = (sign) => {
        let squares = Array.from(display.gameBoardEl.getElementsByClassName('square'));
        squares.forEach(squre => {
            squre.addEventListener('click', e => {
                if(e.target.textContent === ""){
                    let indexOfSquare = squares.indexOf(e.target);
                    gameboard.updateBoard(sign, indexOfSquare);
                    display.renderBoard();
                    playGame();
                }
            }, {once: true});
        })
    }

    const computerPlay = (sign) => {
        const options = gameboard.getUnmarkedSquares();
        let a = Math.floor(Math.random() * options.length);
        gameboard.updateBoard(sign, options[a]);
        display.renderBoard();
        playGame();
    }

    const checkWin = () => {
        let currentBoard = gameboard.getBoard();
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
            return true;
        }
        else if(won && (oCounter == 3)){
            return true;
        }
        if(!won && (currentBoard.indexOf(0) == -1)){
            return true;
        }
        return false;
    }

    init();

    return {playerOne, playerTwo, checkWin};
})();