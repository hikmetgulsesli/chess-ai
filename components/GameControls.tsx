"use client";

import React from "react";
import { useGameState } from "@/lib/game-state";
import { Undo2, RefreshCw, RotateCcw, Flag } from "lucide-react";

interface GameControlsProps {
  gameMode: "pvp" | "pva";
}

export function GameControls({ gameMode }: GameControlsProps) {
  const { undoMove, resetGame, history } = useGameState();

  const handleUndo = () => {
    // In AI mode, undo both player and AI move
    undoMove();
    if (gameMode === "pva") {
      setTimeout(() => undoMove(), 10);
    }
  };

  const handleNewGame = () => {
    resetGame();
  };

  const canUndo = history.length > 0;

  return (
    <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-[var(--color-border-default)] bg-[var(--color-bg-tertiary)]">
        <div className="flex items-center gap-2 font-semibold text-[var(--color-text-primary)]">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Controls
        </div>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 gap-2">
          <button 
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-md font-medium text-sm transition-all border bg-[var(--color-bg-tertiary)] border-[var(--color-border-default)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)] disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-[var(--color-accent-blue)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-secondary)]"
            onClick={handleUndo}
            disabled={!canUndo}
            aria-label="Undo last move (Ctrl+Z)"
            title="Undo last move (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" aria-hidden="true" />
            Undo
          </button>
          <button 
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-md font-medium text-sm transition-all border bg-[var(--color-bg-tertiary)] border-[var(--color-border-default)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-blue)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-secondary)]"
            onClick={() => window.location.reload()}
            aria-label="Flip board"
            title="Flip board"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            Flip
          </button>
          <button 
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-md font-medium text-sm transition-all border bg-[var(--color-accent-red)] border-[var(--color-accent-red)] text-white hover:bg-[#f85149] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-red)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-secondary)]"
            onClick={handleNewGame}
            aria-label="Resign game"
            title="Resign game"
          >
            <Flag className="w-4 h-4" aria-hidden="true" />
            Resign
          </button>
          <button 
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-md font-medium text-sm transition-all border bg-[var(--color-accent-green)] border-[var(--color-accent-green)] text-white hover:bg-[#2ea043] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-green)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-secondary)]"
            onClick={handleNewGame}
            aria-label="Start new game (N)"
            title="Start new game (N)"
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            New Game
          </button>
        </div>
      </div>
    </div>
  );
}
