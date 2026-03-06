"use client";

import React from "react";
import { useGameState } from "@/lib/game-state";

export type GameMode = "pvp" | "pva";

interface GameControlsProps {
  gameMode?: GameMode;
}

export function GameControls({ gameMode = "pva" }: GameControlsProps) {
  const { undoMove, resetGame, isGameOver, history, turn } = useGameState();

  const handleUndo = () => {
    if (gameMode === "pva") {
      // In PvA mode, undo both player and AI moves to get back to player's turn
      undoMove(); // Undo AI move
      undoMove(); // Undo player move
    } else {
      // In PvP mode, just undo the last move
      undoMove();
    }
  };

  // Can only undo if there are moves to undo
  // In PvA mode, can only undo if it's player's turn (white) and there's at least 2 moves
  // In PvP mode, can undo if there's at least 1 move
  const canUndo = gameMode === "pva" 
    ? history.length >= 2 && turn === "w"
    : history.length >= 1;

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">
          <svg className="panel-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Controls
        </div>
      </div>
      <div className="panel-content">
        <div className="controls-grid">
          <button 
            className="btn btn-secondary"
            onClick={handleUndo}
            disabled={!canUndo || isGameOver}
            title={gameMode === "pva" ? "Undo last move (and AI response)" : "Undo last move"}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
            Undo
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => window.location.reload()}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Flip
          </button>
          <button 
            className="btn btn-danger"
            onClick={resetGame}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
            Resign
          </button>
          <button 
            className="btn btn-primary"
            onClick={resetGame}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 4v16m8-8H4" />
            </svg>
            New Game
          </button>
        </div>
      </div>
    </div>
  );
}
