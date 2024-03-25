import React, { useState, useRef } from "react";
import Homepage from "./Homepage";
import PreferencesForm from "./PreferencesForm";
import Board from "./Board";
import "../styles/App.css";
import socket from "./socket";
import GameStatsBar from "./GameStatsBar";
import ReplyCard from "./ReplayCard";

function App() {
  const [layout, setLayout] = useState("homepage");
  const [board, setBoard] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [firstPlayer, setFirstPlayer] = useState(1);
  const [IsGameOver, setGameOver] = useState(0);

  const [FirstPlayerTime, setFirstPlayerTime] = useState(0.0);
  const [SecondPlayerTime, setSecondPlayerTime] = useState(0.0);

  const [FistPlayerWins, setFistPlayerWins] = useState(0);
  const [SecondPlayerWins, setSecondPlayerWins] = useState(0);

  let mutex = useRef(1);

  socket.on("new_game", (data) => {
    const result = JSON.parse(data);

    setFirstPlayer(result.current_player);
    setCurrentPlayer(result.current_player);
    setBoard(result.board);
    resetTimers();
    setLayout("newgame");
  });

  socket.on("new_humans_game", (data) => {
    const result = JSON.parse(data);
    setFirstPlayer(result.current_player);
    setCurrentPlayer(result.current_player);
    setBoard(result.board);
    resetTimers();
    setLayout("new_humans_game");
  });

  socket.on("new_ai_game", (data) => {
    const result = JSON.parse(data);
    setCurrentPlayer(result.current_player);
    setFirstPlayer(result.current_player);
    setBoard(result.board);
    setLayout("new_ai_game");
    resetTimers();
    socket.emit("aiplaying");
  });

  socket.on("column-full", (data) => {
    const message = JSON.parse(data).message;
    console.warn(message);

    const boardContainer = document.querySelector(".board-container");
    boardContainer.classList.add("shake-horizontal");

    setTimeout(() => {
      boardContainer.classList.remove("shake-horizontal");
    }, 1000);
  });

  socket.on("game-over", (data) => {
    const result = JSON.parse(data);
    setBoard(result.board);
    setCurrentPlayer(0);
    setGameOver(result.game_winner);

    if (result.game_winner == 1) {
      setFistPlayerWins(FistPlayerWins + 1);
    } else if (result.game_winner == 2) {
      setSecondPlayerWins(SecondPlayerWins + 1);
    } else if (result.game_winner == -1) {
      // tie
      setFistPlayerWins(FistPlayerWins + 1);
      setSecondPlayerWins(SecondPlayerWins + 1);
    }
    console.log("winner : ", result.game_winner);
    const Replay = document.getElementsByClassName("replay-card")[0];
    Replay.style.display = "flex";
  });

  socket.on("mutex", () => {
    mutex = 1;
  });

  socket.on("continue-game", (data) => {
    // check the game type by just checking the layout
    if (layout === "newgame") {
      const board = JSON.parse(data);
      setBoard(board);
    } else if (layout === "new_humans_game") {
      setCurrentPlayer(3 - currentPlayer);
      const board = JSON.parse(data);
      console.log("recieved data");
      setBoard(board);
    } else if (layout === "new_ai_game") {
      console.log(layout);

      const board = JSON.parse(data);
      setBoard(board);

      if (mutex === 1) {
        mutex--;
        setCurrentPlayer(3 - currentPlayer);
        socket.emit("aiplaying");
      }
    }
  });

  const handleMenuClick = () => {
    const Replay = document.getElementsByClassName("replay-card")[0];
    Replay.style.display = "none";
    setGameOver(0);
    resetWins();
    setLayout("homepage");
  };

  const resetTimers = () => {
    setFirstPlayerTime(0);
    setSecondPlayerTime(0);
  };

  const resetWins = () => {
    setFistPlayerWins(0);
    setSecondPlayerWins(0);
  };

  const handleYesClick = () => {
    setGameOver(0);
    // set timer to 0 for both players
    resetTimers();
    console.log("A new game started !");
    const Replay = document.getElementsByClassName("replay-card")[0];
    Replay.style.display = "none";
    socket.emit("ReplayGame");
  };

  const handleNoClick = () => {
    const Replay = document.getElementsByClassName("replay-card")[0];
    Replay.style.display = "none";
  };

  return (
    <div className="App">
      {layout === "homepage" && (
        <div>
          <Homepage />
          <PreferencesForm />
        </div>
      )}
      {layout === "newgame" && (
        <>
          <GameStatsBar
            FirstPlayerTime={FirstPlayerTime}
            SecondPlayerTime={SecondPlayerTime}
            setFirstPlayerTime={setFirstPlayerTime}
            setSecondPlayerTime={setSecondPlayerTime}
            first_player_wins={FistPlayerWins}
            second_player_wins={SecondPlayerWins}
            first_player={firstPlayer}
            currentPlayer={currentPlayer}
            game_type={"HvsC"}
            resetTimers={resetTimers}
          />
          <Board
            board={board}
            first_player={firstPlayer}
            current_player={currentPlayer}
            game_type={"HvsC"}
            game_over={IsGameOver}
          />
        </>
      )}
      {layout === "new_humans_game" && (
        <>
          <GameStatsBar
            FirstPlayerTime={FirstPlayerTime}
            SecondPlayerTime={SecondPlayerTime}
            setFirstPlayerTime={setFirstPlayerTime}
            setSecondPlayerTime={setSecondPlayerTime}
            first_player_wins={FistPlayerWins}
            second_player_wins={SecondPlayerWins}
            first_player={firstPlayer}
            currentPlayer={currentPlayer}
            game_type={"HvsH"}
            resetTimers={resetTimers}
          />
          <Board
            board={board}
            first_player={firstPlayer}
            current_player={currentPlayer}
            game_type={"HvsH"}
            game_over={IsGameOver}
          />
        </>
      )}
      {layout === "new_ai_game" && (
        <>
          <GameStatsBar
            FirstPlayerTime={FirstPlayerTime}
            SecondPlayerTime={SecondPlayerTime}
            setFirstPlayerTime={setFirstPlayerTime}
            setSecondPlayerTime={setSecondPlayerTime}
            first_player_wins={FistPlayerWins}
            second_player_wins={SecondPlayerWins}
            first_player={firstPlayer}
            currentPlayer={currentPlayer}
            game_type={"CvsC"}
            resetTimers={resetTimers}
          />
          <Board
            board={board}
            game_type={"CvsC"}
            currentPlayer={currentPlayer}
            first_player={firstPlayer}
            game_over={IsGameOver}
          />
        </>
      )}

      <ReplyCard
        onMenuClick={handleMenuClick}
        onYesClick={handleYesClick}
        onNoClick={handleNoClick}
        winner={IsGameOver}
      />
    </div>
  );
}

export default App;
