import React, { useState, useEffect, useRef } from "react";
import socket from "./socket";
import "../styles/board.css";

const Board = ({
  board,
  first_player,
  game_type,
  current_player,
  game_over,
}) => {
  const [cursorVisible, setCursorVisible] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [cursorClass, setCursorClass] = useState(
    current_player === 1
      ? "circle red custom-cursor"
      : "circle yellow custom-cursor"
  );

  const cpt = useRef(0);

  useEffect(() => {
    if (cpt === 0 && first_player == 2 && game_type == "HvsC") {
      socket.emit("amove");
      cpt.current = cpt.current + 1;
    }
  }, [first_player, game_type]);

  const handleMouseEnter = () => {
    setCursorVisible(true);
  };

  const handleMouseLeave = () => {
    setCursorVisible(false);
  };

  useEffect(() => {
    const mouseMove = (event) => {
      if (cursorVisible) {
        setCursorPosition({ x: event.clientX, y: event.clientY });
        setCursorClass(
          current_player === 1
            ? "circle red custom-cursor"
            : "circle yellow custom-cursor"
        );
      }
    };

    window.addEventListener("mousemove", mouseMove);

    return () => {
      window.removeEventListener("mousemove", mouseMove);
    };
  }, [cursorVisible, current_player]);

  const Playmove = (columnIndex) => {
    console.log("player wanted to play : ", columnIndex);
    if (game_type === "HvsC") {
      socket.emit("PlayMove", columnIndex);
    } else {
      if (game_type != "CvsC") {
        const data = JSON.stringify({
          column: columnIndex,
          current_player: current_player,
        });
        socket.emit("PlayMoveHuman", data);
      }
    }
  };

  const handleKeyPress = (event) => {
    const columnIndex = parseInt(event.key);
    if (
      game_over == 0 &&
      !isNaN(columnIndex) &&
      columnIndex >= 1 &&
      columnIndex <= 7 &&
      game_type != "CvsC"
    ) {
      Playmove(columnIndex - 1);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <div className="board-container">
      {board.map((row, rowIndex) => (
        <React.Fragment key={rowIndex}>
          {row.map((cell, columnIndex) => (
            <div
              onClick={() => {
                game_over == 0
                  ? Playmove(columnIndex)
                  : console.log("Game over");
              }}
              key={columnIndex}
              className={`circle ${
                cell === 1 ? "red" : cell === 2 ? "yellow" : ""
              }`}
              data-column={columnIndex}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            ></div>
          ))}
        </React.Fragment>
      ))}
      {cursorVisible && (
        <div
          className={cursorClass}
          style={{
            top: cursorPosition.y,
            left: cursorPosition.x,
          }}
        ></div>
      )}
    </div>
  );
};

export default Board;
