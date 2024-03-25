import React, { useState } from "react";
import socket from "./socket";

const PreferencesForm = () => {
  // I used use state to initially make
  // type : human vs computer
  // difficulty : easy
  // first player is 1
  const [formData, setFormData] = useState({
    type: "HvsC",
    difficulty: "easy",
    firstplayer: 1,
  });

  const SendOptions = (event) => {
    event.preventDefault();
    socket.emit("CommitPreferences", JSON.stringify(formData));
  };

  return (
    <div id="form-container">
      <form onSubmit={SendOptions}>
        <label htmlFor="game-type">Type</label>
        <select
          name="game-type"
          id=""
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          value={formData.type} // I added this so useState know what is game type
        >
          <option value="HvsC">Human vs Computer</option>
          <option value="HvsH">Human vs Human</option>
          <option value="CvsC">Computer vs Computer</option>
        </select>

        <label htmlFor="difficulty">Difficulty</label>
        <select
          name="game-difficulty"
          id=""
          onChange={(e) =>
            setFormData({ ...formData, difficulty: e.target.value })
          }
          value={formData.difficulty} // I added this so useState know what is difficulty
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <label htmlFor="first-player">First Player</label>
        <select
          name="first-player"
          id=""
          onChange={(e) =>
            setFormData({ ...formData, firstplayer: e.target.value })
          }
          value={formData.firstplayer}
        >
          <option value="1">Player 1 (Red)</option>
          <option value="2">Player 2 (Yellow)</option>
        </select>

        <button type="submit" id="submit-button">
          Let's play
        </button>
      </form>
    </div>
  );
};

export default PreferencesForm;
