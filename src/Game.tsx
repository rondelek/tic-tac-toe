import { useState, useEffect } from "react";
import Square from "./Square";

type Scores = {
  [key: string]: number;
};

const INITIAL_GAME_STATE = ["", "", "", "", "", "", "", "", ""];
const INITIAL_SCORES: Scores = { X: 0, O: 0 };
const WINNING_COMBOS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export default function Game() {
  const [gameState, setgameState] = useState(INITIAL_GAME_STATE);
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [scores, setScores] = useState(INITIAL_SCORES);
  const [alert, setAlert] = useState<any>(undefined);
  const [computer, setComputer] = useState(false);

  useEffect(() => {
    if (alert !== undefined) {
      window.alert(alert);
    }
  }, [alert]);

  useEffect(() => {
    const storedScores = localStorage.getItem("scores");
    if (storedScores) {
      setScores(JSON.parse(storedScores));
    }
  }, []);

  useEffect(() => {
    if (gameState === INITIAL_GAME_STATE) {
      return;
    }
    checkForWinner();
  }, [gameState]);

  const playAgainstComputer = () => {
    setComputer(!computer);
  };

  const changeScores = () => {
    const newPlayerScore = scores[currentPlayer] + 1;
    const newScores = { ...scores };
    newScores[currentPlayer] = newPlayerScore;
    setScores(newScores);
    localStorage.setItem("scores", JSON.stringify(newScores));
  };

  const resetBoard = () => {
    setgameState(INITIAL_GAME_STATE);
  };

  const handleWin = () => {
    setAlert(`Congrats player ${currentPlayer}! You won!`);
    changeScores();
    resetBoard();
  };

  const handleDraw = () => {
    setAlert("It's a draw!");
    resetBoard();
  };

  const checkForWinner = () => {
    let roundWon = false;

    for (let i = 0; i < WINNING_COMBOS.length; i++) {
      const winCombo = WINNING_COMBOS[i];

      let a = gameState[winCombo[0]];
      let b = gameState[winCombo[1]];
      let c = gameState[winCombo[2]];

      if ([a, b, c].includes("")) {
        continue;
      }

      if (a === b && b === c) {
        roundWon = true;
        setTimeout(() => handleWin(), 500);
        break;
      }

      if (!gameState.includes("")) {
        setTimeout(() => handleDraw(), 500);
        return;
      }
    }
    changePlayer();
  };

  const playComputer = () => {
    const newGameState = [...gameState];
    const indexesOfEmptyStrings = [];
    for (let i = 0; i < newGameState.length; i++) {
      if (newGameState[i] === "") {
        indexesOfEmptyStrings.push(i);
      }
    }
    const emptyIndex =
      indexesOfEmptyStrings[
        Math.floor(Math.random() * indexesOfEmptyStrings.length)
      ];
    newGameState[emptyIndex] = "O";
    setgameState(newGameState);
  };

  const changePlayer = () => {
    if (computer && currentPlayer === "X") {
      setTimeout(() => {
        playComputer();
      }, 500);
    }
    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
  };

  const handleCellClick = (event: any) => {
    const cellIndex = Number(event.target.getAttribute("data-cell-index"));

    const currentState = gameState[cellIndex];
    if (currentState) {
      return;
    }

    const newValues = [...gameState];
    newValues[cellIndex] = currentPlayer;
    setgameState(newValues);
  };

  return (
    <div className="h-full font-display text-slate-800 bg-gradient-to-r from-cyan-500 to-blue-500 py-8 px-4">
      <h1 className="text-center text-5xl text-slate-200 mb-4">Tic Tac Toe</h1>
      {computer ? (
        <p className="text-center text-slate-200 mb-4">
          playing against the computer
        </p>
      ) : (
        <p className="text-transparent mb-4">.</p>
      )}
      <div>
        <div className="grid grid-cols-3 w-96 mx-auto gap-3">
          {gameState.map((player, index) => (
            <Square
              key={index}
              onClick={handleCellClick}
              {...{ index, player }}
            />
          ))}
        </div>
        <div className="flex justify-center items-center gap-7">
          <div className="text-ms mt-4">
            <p className="text-white mt-2">
              Next player: <span>{currentPlayer}</span>
            </p>
            <p className="text-white mt-2">
              Player X wins: <span>{scores["X"]}</span>
            </p>
            <p className="text-white mt-2">
              Player O wins: <span>{scores["O"]}</span>
            </p>
          </div>
          <button
            onClick={playAgainstComputer}
            className="bg-slate-200 hover:bg-slate-300 py-3 px-2 rounded-2xl"
          >
            Play against the computer
          </button>
        </div>
      </div>
    </div>
  );
}
