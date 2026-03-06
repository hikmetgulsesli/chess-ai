"use client";

import React from "react";
import { useGameState } from "@/lib/game-state";

export function TurnIndicator() {
  const { turn, status, isCheck } = useGameState();

  const getStatusMessage = () => {
    if (status === "checkmate") {
      return `${turn === "w" ? "Black" : "White"} wins by checkmate!`;
    }
    if (status === "stalemate") {
      return "Game drawn by stalemate";
    }
    if (status === "draw") {
      return "Game drawn";
    }
    if (isCheck) {
      return `${turn === "w" ? "White" : "Black"} is in check!`;
    }
    return `${turn === "w" ? "White" : "Black"} to move`;
  };

  const getStatusTitle = () => {
    if (status === "checkmate") return "Checkmate";
    if (status === "stalemate") return "Stalemate";
    if (status === "draw") return "Draw";
    if (isCheck) return "Check!";
    return "Game in Progress";
  };

  return (
    <div className="game-status">
      <div className="game-status-title">{getStatusTitle()}</div>
      <div className="game-status-message">{getStatusMessage()}</div>
    </div>
  );
}
