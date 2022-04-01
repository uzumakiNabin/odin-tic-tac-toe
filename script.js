//array of wind conditions
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
    //initialize board as array with all 0's
    let board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    const getBoard = () => board;

    //return unmarked boards for ai
    const getUnmarkedSquares = () => {
        let unmarkedSquares = [];
        board.forEach((value, index) => {
            if(value === 0){
                unmarkedSquares.push(index);
            }
        });
        return unmarkedSquares;
    }

    //update board array according to player marking
    const updateBoard = (sign, index) => {
        board[index] = sign;
    }

    //reset board to initial state
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

    //display game board according to current state of main board array
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

    //get types for both player from radio selection, if nothing selected, raise error
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

    //function to display who's turn it is to play
    const showWhosTurn = (player) => {
        if(player.name){
            turnField.textContent = `${player.name}'s turn`;
        }
        else {
            turnField.textContent = '';
        }
    }

    //function to display if player won game or it's a tie
    const showWinCondition = (player) => {
        if(player){
            winnerField.textContent = `${player.name} won`;
        }
        else {
            winnerField.textContent = "It's a tie";
        }
        turnField.textContent = '';
    }

    //clear turn information and winner information
    const clearAll = () => {
        turnField.textContent = '';
        winnerField.textContent = '';
    }

    const toggleSelectionFields = () => {
        playerOneRadio.forEach(radio => {
            radio.disabled = !radio.disabled;
        })
        playerOneNameInput.disabled = !playerOneNameInput.disabled;
        playerTwoRadio.forEach(radio => {
            radio.disabled = !radio.disabled;
        })
        playerTwoNameInput.disabled = !playerTwoNameInput.disabled;
    }

    return {startButton, gameContainer, gameBoardEl, renderBoard, getPlayerTypes, showWhosTurn, showWinCondition, clearAll, toggleSelectionFields};
})();

const game = (() => {
    //initalize two players
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

    //player one goes first
    let turn = playerOne;

    //function to initialize game by making 'start game' button loaded with click function
    const init = () => {
        display.startButton.addEventListener('click', initEventFunctionWrapper);
    };

    //wrapper function for 'start game' button so we can remove the event listener later
    const initEventFunctionWrapper = () => {
        if(display.getPlayerTypes()){
            startGame();
        }
    }

    //wrapper function for 'reset game' button so we can remove event listener later
    const resetEventFunctionWrapper = () => {
        display.startButton.value = 'Start game';
        display.toggleSelectionFields();
        display.startButton.removeEventListener('click', resetEventFunctionWrapper);
        init();
        display.gameContainer.style.display = 'none';
        display.clearAll();
    }

    //if all player type is selected, initialize gameboard and start playing
    const startGame = () => {
        display.startButton.value = 'Reset game';
        display.startButton.removeEventListener('click', initEventFunctionWrapper);
        display.startButton.addEventListener('click', resetEventFunctionWrapper);
        display.toggleSelectionFields();
        gameboard.resetBoard();
        display.gameContainer.style.display = 'flex';
        display.renderBoard();
        turn = playerOne;
        playGame();
    };

    //play game turn by turn
    const playGame = () => {
        if(!checkWin()){
            display.showWhosTurn(turn);
            firstPlay = false;
            if(turn.type === 'human'){
                humanPlay(turn.sign);
            }
            else if(turn.type === 'computer'){
                setTimeout(() => {
                    computerPlay(turn.sign)
                }, 1500);                       //delay computer play by 1.5 seconds
            }
            return;
        }
        if(checkWin() === true){
            changePlayerTurn();
            display.showWinCondition(turn);
        }
        else if(checkWin() === 'tie'){
            display.showWinCondition('');
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

    //function for human player
    const humanPlay = (sign) => {
        let squares = Array.from(display.gameBoardEl.getElementsByClassName('square'));
        squares.forEach(squre => {
            squre.addEventListener('click', e => {
                if(e.target.textContent === ""){
                    let indexOfSquare = squares.indexOf(e.target);
                    gameboard.updateBoard(sign, indexOfSquare);
                    display.renderBoard();
                    changePlayerTurn();
                    playGame();
                }
            }, {once: true});
        })
    }

    //logic for computer to (counter)play
    const computerPlay = (sign) => {
        const options = gameboard.getUnmarkedSquares();
        const currentBoard = gameboard.getBoard();
        let mine = [], opponent = [];
        let counter = 0;
        currentBoard.forEach((value, index) => {
            if(value != sign && value != 0){
                opponent.push(index);
            }
            else if(value === sign && value != 0){
                mine.push(index);
            }
        });

        let indexToMark = -1;

        winConditions.forEach(condition => {
            condition.forEach(value => {
                if(opponent.includes(value)){
                    counter++;
                }
            })
            if(counter === 2){
                condition.forEach(value => {
                    if(!opponent.includes(value) && options.includes(value) && (indexToMark < 0)){
                        indexToMark = value;
                    }
                })
                counter = 0;
            }
            else{
                counter = 0;
            }
        })

        if(indexToMark < 0){
            winConditions.forEach(condition => {
                condition.forEach(value => {
                    if(mine.includes(value)){
                        counter++;
                    }
                })
                if(counter === 2){
                    condition.forEach(value => {
                        if(!mine.includes(value) && options.includes(value) && (indexToMark < 0)){
                            indexToMark = value;
                        }
                    })
                    counter = 0;
                }
                else{
                    counter = 0;
                }
            })
        }

        if(indexToMark < 0){
            indexToMark = options[Math.floor(Math.random() * options.length)];
        }
        gameboard.updateBoard(sign, indexToMark);
        display.renderBoard();
        changePlayerTurn();
        playGame();
    }

    //compare current game board array against win conditions to check win condition
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

            return 'tie';
        }
        return false;
    }

    //start
    init();

    return {playerOne, playerTwo, checkWin};
})();