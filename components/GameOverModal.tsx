"use client";

import React from "react";
import { useGameState, type GameStatus } from "@/lib/game-state";

interface GameOverModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

export function GameOverModal({ isOpen, onClose }: GameOverModalProps) {
  const { status, turn, resetGame } = useGameState();

  if (!isOpen) return null;

  const getWinner = (): string => {
    if (status === "checkmate") {
      // If it's white's turn and checkmate, black won
      return turn === "w" ? "Black" : "White";
    }
    return "";
  };

  const getReason = (): string => {
    switch (status) {
      case "checkmate":
        return "Checkmate";
      case "stalemate":
        return "Stalemate";
      case "draw":
        return "Draw";
      default:
        return "Game Over";
    }
  };

  const getTitle = (): string => {
    if (status === "checkmate") {
      const winner = getWinner();
      return `${winner} Wins!`;
    }
    if (status === "stalemate" || status === "draw") {
      return "Draw!";
    }
    return "Game Over";
  };

  const getIcon = (): string => {
    if (status === "checkmate") {
      return "🏆";
    }
    if (status === "stalemate" || status === "draw") {
      return "🤝";
    }
    return "⚡";
  };

  const handlePlayAgain = () => {
    resetGame();
    onClose?.();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="game-over-title"
    >
      <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-xl p-8 max-w-sm w-full mx-4 shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--color-accent-blue)] to-[var(--color-accent-purple)] flex items-center justify-center text-4xl">
            {getIcon()}
          </div>
        </div>

        {/* Title */}
        <h2 
          id="game-over-title"
          className="text-2xl font-bold text-center text-[var(--color-text-primary)] font-[family-name:var(--font-heading)] mb-2"
        >
          {getTitle()}
        </h2>

        {/* Reason */}
        <p className="text-center text-[var(--color-text-secondary)] mb-6">
          {getReason()}
        </p>

        {/* Play Again Button */}
        <button
          onClick={handlePlayAgain}
          className="w-full py-3 px-4 bg-[var(--color-accent-green)] hover:bg-[#2ea043] text-white font-semibold rounded-lg transition-colors duration-150 flex items-center justify-center gap-2"
          aria-label="Play again"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Play Again
        </button>
      </div>
    </div>
  );
}
