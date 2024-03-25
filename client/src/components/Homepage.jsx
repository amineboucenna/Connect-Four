import React, { useEffect } from "react";
import "../styles/homepage.css";
import socket from "./socket";
const Homepage = () => {

  useEffect(() => {
  

    socket.on("connect", () => {
      console.log("Connected to server");
    });


    const new_game_btn = document.getElementById("new-game-button");
    new_game_btn.hidden = true;
    const form_container = document.getElementById("form-container");
    form_container.hidden = true;

    setTimeout(() => {
      new_game_btn.style.display = "block";
    }, 0); // change from 0 to 2500 after you finish amine 


    new_game_btn.addEventListener("click", () => {
      form_container.hidden = false;
      form_container.style.display = "flex";
    });

  },[]);

  return (
    <div className="home-page-container">
      <div id="welcome-container">
        <p className="welcome" id="welcome-message">Welcome to Connect 4 game...</p>
        <p className="welcome" id="welcome-message-2">For a new game, press this tiny little button</p>

        <button id="new-game-button">New game</button>
      </div>
    </div>
  );
};

export default Homepage;
