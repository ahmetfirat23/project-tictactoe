const Player = (sign, color, name) => {
  this.name = name;
  this.color = color;
  this.sign = sign;

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

  const playerOne = Player("X", "blue");
  const playerTwo = Player("O", "red");

  let boardArray;
  let moveInfo;
  let currentArray;

  let currentPlayer;
  let otherPlayer;

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
        window.location.reload(false);
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
      boardArray[moveInfo[0]][moveInfo[1]] = 1;
      currentArray = currentPlayer.makeMove(moveInfo, otherPlayer);
      displayController.displayMove(event.target.id, currentPlayer);
      if (victoryCheck(currentArray)) {
        endGame(currentPlayer);
        return;
      } else if (
        boardArray.every((array) => array.every((number) => number == 1))
      ) {
        drawEndGame();
        return;
      }
      console.log(boardArray);
      nextPlayer();
    }
  }

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
      console.log();
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
    document.querySelector("#winner-player img").setAttribute("src","");
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
