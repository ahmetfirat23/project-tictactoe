const Player = (sign, moves, color, name) => {
  this.name = name;
  this.color = color;
  this.sign = sign;
  this.moves = moves;

  function makeMove(moveInfo) {}

  return { name, color, sign, moves, makeMove };
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

  const playerOne = Player("X", [[], [], []], "blue");
  const playerTwo = Player("O", [[], [], []], "red");

  let boardArray;
  let moveInfo;

  let currentPlayer;
  let otherPlayer;

  function start() {
    playerOneColorButtons.forEach((element) =>
      element.addEventListener("change", setPlayerColor)
    );
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
    startGame();
  }

  function namePlayers() {
    const nameInputs = document.querySelectorAll("input[type='text']");
    playerOne.name = nameInputs[0].value;
    playerTwo.name = nameInputs[1].value;
  }

  function startGame() {
    boardArray = [];
    currentPlayer = playerOne;
    otherPlayer = playerTwo;
  }

  function getMoveInfo(square) {
    return square.id.substring(1).split("-");
  }

  return { start, onStartClick };
};

const displayController = (() => {
  const colors = {
    red: "#c94136",
    blue: "#0071bc",
    green: "#518e30",
    yellow: "#efb31d",
  };
  
  const playerOneIngame = document.querySelector(
    "#player-one-ingame"
  );
  const playerTwoIngame = document.querySelector(
    "#player-two-ingame"
  );

  const showGame = (playerOne, playerTwo) => {
    const playerOneInfo = document.querySelector(
        "#player-one-ingame .player-info"
      );
      const playerTwoInfo = document.querySelector(
        "#player-two-ingame .player-info"
      );
    document.querySelector("#login-screen").style.display = "none";
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
        playerOne.name.substring(0,15)
      );
    playerTwoInfo.firstElementChild.textContent =
      playerTwoInfo.firstElementChild.textContent.replace(
        "Player Two",
        playerTwo.name.substring(0,15)
      );
  };

  const showTurnInfo = (player) => {
    if(player.sign == 'X'){
        playerOneIngame.lastElementChild.style.visibility = "visible";
        playerTwoIngame.lastElementChild.style.visibility = "hidden";
        console.log()
    }
    else{
        playerOneIngame.lastElementChild.visibility = "hidden";
        playerTwoIngame.lastElementChild.visibility = "visible";
    }
  };

  return { showGame, showTurnInfo };
})();
const gc = GameController();

document
  .querySelector("#start-button")
  .addEventListener("click", gc.onStartClick);

gc.start();
