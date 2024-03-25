import React, { useEffect } from "react";
import "../styles/GameStatsBar.css";

const GameStatsBar = ({
  resetTimers,
  FirstPlayerTime,
  SecondPlayerTime,
  setFirstPlayerTime,
  setSecondPlayerTime,
  first_player_wins,
  second_player_wins,
  first_player,
  currentPlayer,
  game_type,
}) => {
 
  useEffect(() => {
    let timer;

    const updateTimer = () => {
      if (currentPlayer == 1) {
        setFirstPlayerTime((prevTime) => prevTime + 1);
      } else if (currentPlayer == 2) {
        setSecondPlayerTime((prevTime) => prevTime + 1);
      }
    };

    timer = setInterval(updateTimer, 100);

    return () => clearInterval(timer);
  }, [currentPlayer]);

  const human_image_path = "./src/images/human.png";
  const ai_image_path = "./src/images/ai.png";

  useEffect(() => {
    if (game_type == "HvsH") {
      document.querySelector(
        ".player-stats:first-child .player-image img"
      ).src = human_image_path;
      document.querySelector(".player-stats:last-child .player-image img").src =
        human_image_path;
    } else if (game_type == "HvsC") {
      if (first_player === 1) {
        document.querySelector(
          ".player-stats:first-child .player-image img"
        ).src = human_image_path;
        document.querySelector(
          ".player-stats:last-child .player-image img"
        ).src = ai_image_path;
      } else {
        document.querySelector(
          ".player-stats:first-child .player-image img"
        ).src = ai_image_path;
        document.querySelector(
          ".player-stats:last-child .player-image img"
        ).src = human_image_path;
      }
    } else if (game_type == "CvsC") {
      document.querySelector(
        ".player-stats:first-child .player-image img"
      ).src = ai_image_path;
      document.querySelector(".player-stats:last-child .player-image img").src =
        ai_image_path;
    }

    return () => {};
  }, []);

  return (
    <div className="TimerBar">
      <div className="player-stats">
        <div className="player-image">
          <img src="" alt="" />
        </div>
        <div className="score-time">
          <span>
            Player 1{" "}
            {currentPlayer === 1
              ? game_type === "CvsC"
                ? "(Him)"
                : "(You)"
              : ""}
          </span>
          <span id="score">{first_player_wins}</span>
          <span id="time">{FirstPlayerTime.toFixed(1)}</span>
        </div>
      </div>

      <div className="player-stats">
        <div className="score-time">
          <span>
            Player 2{" "}
            {currentPlayer === 2
              ? game_type === "CvsC"
                ? "(Him)"
                : "(You)"
              : ""}
          </span>

          <span id="score">{second_player_wins}</span>
          <span id="time">{SecondPlayerTime.toFixed(1)}</span>
        </div>
        <div className="player-image">
          <img src="" alt="" />
        </div>
      </div>
    </div>
  );
};

export default GameStatsBar;
