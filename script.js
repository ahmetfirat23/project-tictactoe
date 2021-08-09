const Player = (sign, color, name) => {
  let moves = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
  let moveCount = 0;

  function makeMove(moveInfo, otherPlayer) {
    moves[moveInfo[0]][moveInfo[1]] = 1;
    displayController.showTurnInfo(otherPlayer);
    moveCount++;
    if (moveCount >= 3) {
      return moves;
    }
  }

  function resetMoves() {
    moves = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
  }

  return { name, color, sign, makeMove, resetMoves };
};

const Computer = (sign, color, name) => {
  let moves = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
  let moveCount = 0;

  function makeMove(board, otherPlayer) {
    let moveInfo = findBestMove(board, playerMaximizer);
    moves[moveInfo[0]][moveInfo[1]] = 1;
    displayController.showTurnInfo(otherPlayer);
    moveCount++;
    return [moves, moveInfo];
  }

  function resetMoves() {
    moves = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
  }

  const playerMaximizer = sign == "X" ? true : false;

  function isMoveLeft(board) {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] == 0) {
          return true;
        }
      }
    }
    return false;
  }

  function evaluate(board) {
    for (let row = 0; row < 3; row++) {
      if (board[row][0] == board[row][1] && board[row][1] == board[row][2]) {
        if (board[row][0] == "X") {
          return 10;
        } else if (board[row][0] == "O") {
          return -10;
        }
      }
    }

    for (let column = 0; column < 3; column++) {
      if (
        board[0][column] == board[1][column] &&
        board[1][column] == board[2][column]
      ) {
        if (board[0][column] == "X") {
          return 10;
        } else if (board[0][column] == "O") {
          return -10;
        }
      }
    }

    if (
      (board[0][0] == board[1][1] && board[1][1] == board[2][2]) ||
      (board[0][2] && board[1][1] && board[1][1] == board[2][0])
    ) {
      if (board[1][1] == "X") {
        return 10;
      } else if (board[1][1] == "O") {
        return -10;
      }
    }

    return 0;
  }

  function minimax(board, depth, isMaximizer) {
    let score = evaluate(board);
    if (score == 10 || score == -10) {
      return score;
    }
    if (isMoveLeft(board) == false) {
      return 0;
    }
    if (isMaximizer) {
      let best = -1000;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (board[i][j] == 0) {
            board[i][j] = "X";
            best = Math.max(best, minimax(board, depth + 1, false));
            board[i][j] = 0;
          }
        }
      }
      best -= depth;
      return best;
    } else {
      let best = 1000;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (board[i][j] == 0) {
            board[i][j] = "O";
            best = Math.min(best, minimax(board, depth + 1, true));
            board[i][j] = 0;
          }
        }
      }
      best += depth;
      return best;
    }
  }

  function findBestMove(board, playerMaximizer) {
    let bestValue = playerMaximizer ? -1000 : +1000;
    let bestMove = [-1, -1];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] == 0) {
          board[i][j] = sign;
          let moveValue = minimax(board, 0, playerMaximizer);
          board[i][j] = 0;
          if (
            (playerMaximizer && moveValue > bestValue) ||
            (!playerMaximizer && moveValue < bestValue)
          ) {
            bestMove[0] = i;
            bestMove[1] = j;
            bestValue = moveValue;
          }
        }
      }
    }
    return bestMove;
  }

  return { name, color, sign, makeMove, resetMoves };
};

const GameController = () => {
  const victoryConditions = [
    [
      [1, 0, 0],
      [1, 0, 0],
      [1, 0, 0],
    ],
    [
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 0],
    ],
    [
      [0, 0, 1],
      [0, 0, 1],
      [0, 0, 1],
    ],
    [
      [1, 1, 1],
      [0, 0, 0],
      [0, 0, 0],
    ],
    [
      [0, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    [
      [0, 0, 0],
      [0, 0, 0],
      [1, 1, 1],
    ],
    [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ],
    [
      [0, 0, 1],
      [0, 1, 0],
      [1, 0, 0],
    ],
  ];
  const playerOneColorButtons = document.querySelectorAll(
    "input[type='radio']"
  );

  let playerOne = Player("X", "blue");
  let playerTwo = Player("O", "red");

  let boardArray;
  let moveInfo;
  let currentArray;

  let currentPlayer;
  let otherPlayer;
  let AI;

  let playerOneMoved = false;

  function start() {
    document
      .querySelector("#start-button")
      .addEventListener("click", onStartClick);
    playerOneColorButtons.forEach((element) =>
      element.addEventListener("change", setPlayerColor)
    );
    document
      .querySelector("#change-settings-button")
      .addEventListener("click", () => {
        window.location.reload();
      });
    document
      .querySelector("#play-again-button")
      .addEventListener("click", () => {
        onStartClick();
        playerOne.resetMoves();
        playerTwo.resetMoves();
      });
  }

  function setPlayerColor(event) {
    if (event.target.name == "player-one-color") {
      playerOne.color = event.target.value;
    } else {
      playerTwo.color = event.target.value;
    }
  }

  function onStartClick() {
    AI = document.querySelector("#ai").checked;
    if (AI) {
      playerTwo = Computer("O", playerTwo.color);
    }
    namePlayers();
    displayController.showGame(playerOne, playerTwo);
    displayController.showTurnInfo(playerOne);
    displayController.clearBoard();
    startGame();
  }

  function namePlayers() {
    const nameInputs = document.querySelectorAll("input[type='text']");
    playerOne.name = nameInputs[0].value;
    playerTwo.name = nameInputs[1].value;
  }

  function startGame() {
    boardArray = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
    currentPlayer = playerOne;
    otherPlayer = playerTwo;
    document.querySelectorAll(".game-square").forEach((gameSquare) => {
      gameSquare.addEventListener("click", onBoardClick);
    });
  }

  function onBoardClick(event) {
    moveInfo = getMoveInfo(event.target);
    if (boardArray[moveInfo[0]][moveInfo[1]] == 0) {
      boardArray[moveInfo[0]][moveInfo[1]] = currentPlayer.sign;
      currentArray = currentPlayer.makeMove(moveInfo, otherPlayer);
      displayController.displayMove(event.target.id, currentPlayer);
      if (victoryCheck(currentArray)) {
        endGame(currentPlayer);
        return;
      } else if (
        boardArray.every((array) => array.every((boardSign) => boardSign != 0))
      ) {
        drawEndGame();
        return;
      }
      nextPlayer();

      if (AI && currentPlayer == playerTwo) {
        let aiInfo = playerTwo.makeMove(boardArray, otherPlayer);
        currentArray = aiInfo[0];
        moveInfo = aiInfo[1];
        boardArray[moveInfo[0]][moveInfo[1]] = currentPlayer.sign;
        displayController.displayMove(
          "_" + (moveInfo[0] + 1) + "-" + (moveInfo[1] + 1),
          currentPlayer
        );
        if (victoryCheck(currentArray)) {
          endGame(currentPlayer);
          return;
        } else if (
          boardArray.every((array) =>
            array.every((boardSign) => boardSign == currentPlayer.sign)
          )
        ) {
          drawEndGame();
          return;
        }
        nextPlayer();
      }
    }
  }

  /*function aiRandomMove() {
    let i = Math.floor(Math.random() * 3);
    let j = Math.floor(Math.random() * 3);
    while (boardArray[i][j] != 0) {
      i = Math.floor(Math.random() * 3);
      j = Math.floor(Math.random() * 3);
    }
    moveInfo = [i, j];
    boardArray[moveInfo[0]][moveInfo[1]] = currentPlayer.sign;
    currentArray = currentPlayer.makeMove(moveInfo, otherPlayer);
    displayController.displayMove("_" + (i + 1) + "-" + (j + 1), currentPlayer);
    if (victoryCheck(currentArray)) {
      endGame(currentPlayer);
      return;
    } else if (
      boardArray.every((array) =>
        array.every((boardSign) => boardSign == currentPlayer.sign)
      )
    ) {
      drawEndGame();
      return;
    }
    nextPlayer();
  }*/

  function nextPlayer() {
    let temp = currentPlayer;
    currentPlayer = otherPlayer;
    otherPlayer = temp;
  }

  function getMoveInfo(square) {
    return square.id
      .substring(1)
      .split("-")
      .map((number) => Number(number - 1));
  }

  function victoryCheck(array) {
    if (array) {
      for (let k = 0; k < victoryConditions.length; k++) {
        let victoryCondition = victoryConditions[k];
        let match = 0;
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            if (victoryCondition[i][j] == 1) {
              if (array[i][j] == 1) {
                match++;
              }
            }
          }
        }
        if (match >= 3) {
          return true;
        }
      }
      return false;
    }
    return false;
  }

  function endGame(player) {
    displayController.showEnding(player);
  }

  function drawEndGame() {
    displayController.showDrawEnding();
  }

  return { start };
};

const displayController = (() => {
  const colors = {
    red: "#c94136",
    blue: "#0071bc",
    green: "#518e30",
    yellow: "#efb31d",
  };

  const playerOneIngame = document.querySelector("#player-one-ingame");
  const playerTwoIngame = document.querySelector("#player-two-ingame");

  const showGame = (playerOne, playerTwo) => {
    const playerOneInfo = document.querySelector(
      "#player-one-ingame .player-info"
    );
    const playerTwoInfo = document.querySelector(
      "#player-two-ingame .player-info"
    );
    document.querySelector("#login-screen").style.display = "none";
    document.querySelector("#ending-screen").style.display = "none";
    document.querySelector("#game-display").style.display = "flex";
    playerOneInfo.style.color = colors[playerOne.color];
    playerTwoInfo.style.color = colors[playerTwo.color];
    document
      .querySelector("#player-one-ingame img")
      .setAttribute("src", `${playerOne.color}.png`);
    document
      .querySelector("#player-two-ingame img")
      .setAttribute("src", `${playerTwo.color}.png`);
    playerOneInfo.firstElementChild.textContent =
      playerOneInfo.firstElementChild.textContent.replace(
        "Player One",
        playerOne.name.substring(0, 15)
      );
    playerTwoInfo.firstElementChild.textContent =
      playerTwoInfo.firstElementChild.textContent.replace(
        "Player Two",
        playerTwo.name.substring(0, 15)
      );
  };

  const showTurnInfo = (player) => {
    if (player.sign == "X") {
      playerOneIngame.lastElementChild.style.visibility = "visible";
      playerTwoIngame.lastElementChild.style.visibility = "hidden";
    } else {
      playerOneIngame.lastElementChild.style.visibility = "hidden";
      playerTwoIngame.lastElementChild.style.visibility = "visible";
    }
  };

  const clearBoard = () => {
    document.querySelectorAll(".game-square").forEach((gameSquare) => {
      gameSquare.textContent = "";
    });
  };

  const displayMove = (moveId, player) => {
    document.querySelector(`#${moveId}`).textContent = player.sign;
  };

  const showEnding = (player) => {
    let winnerPlayer = document.querySelector("#winner-player");
    document.querySelector("#game-display").style.display = "none";
    document.querySelector("#ending-screen").style.display = "flex";
    winnerPlayer.style.color = player.color;
    winnerPlayer.querySelector("#win-message").textContent = "Wins!";
    winnerPlayer.querySelector("#win-message").style.fontSize = 96;
    winnerPlayer.firstElementChild.setAttribute("src", `${player.color}.png`);
    winnerPlayer.querySelector("#winner-name").textContent = player.name;
  };

  const showDrawEnding = () => {
    document.querySelector("#game-display").style.display = "none";
    document.querySelector("#ending-screen").style.display = "flex";
    document.querySelector("#win-message").textContent = "It's a draw!";
    document.querySelector("#win-message").style.fontSize = 108;
    document.querySelector("#winner-player img").setAttribute("src", "");
    document.querySelector("#winner-name").textContent = "";
  };

  return {
    showGame,
    showTurnInfo,
    clearBoard,
    displayMove,
    showEnding,
    showDrawEnding,
  };
})();

const gc = GameController();
gc.start();
