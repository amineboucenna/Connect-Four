import React from "react";
import "../styles/ReplyCard.css";

const ReplyCard = ({ onMenuClick, onYesClick, onNoClick, winner }) => {
  return (
    <div className="replay-card">
      <dir id="message">
        {winner == -1 ? (
          <span>The game ended in tie</span>
        ) : (
          <span>The winner is the Player {winner == 1 ? 1 : 2}</span>
        )}
        <span>Do you want to replay the game?</span>
      </dir>
      <div className="buttons-container">
        <button
          id="menu-button"
          className="replay-card-buttons"
          onClick={onMenuClick}
        >
          Menu
        </button>
        <button
          id="yes-button"
          className="replay-card-buttons"
          onClick={onYesClick}
        >
          Yes
        </button>
        <button
          id="no-button"
          className="replay-card-buttons"
          onClick={onNoClick}
        >
          No
        </button>
      </div>
    </div>
  );
};

export default ReplyCard;
