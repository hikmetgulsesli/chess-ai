"use client";

import React, { useState, useEffect, useCallback } from "react";
import { GameStateProvider, useGameState } from "@/lib/game-state";
import { ChessBoard } from "@/components/ChessBoard";
import { MoveHistory } from "@/components/MoveHistory";
import { GameControls } from "@/components/GameControls";
import { TurnIndicator } from "@/components/TurnIndicator";
import { GameOverModal } from "@/components/GameOverModal";
import { CapturedPieces } from "@/components/CapturedPieces";
import { SoundSettings } from "@/components/SoundSettings";

export type GameMode = "pvp" | "pva";

function Header({ gameMode }: { gameMode: GameMode }) {
  const { history, turn } = useGameState();
  const moveCount = history.length;

  return (
    <header className="bg-[var(--color-bg-secondary)] border-b border-[var(--color-border-default)] px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)] flex items-center gap-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-[var(--color-accent-blue)] to-[var(--color-accent-purple)] rounded-md flex items-center justify-center text-base sm:text-lg">
            ♟
          </div>
          <span className="hidden sm:inline">Chess AI</span>
        </div>
        <div className="hidden sm:flex items-center gap-6 text-sm text-[var(--color-text-secondary)]">
          <div className="flex items-center gap-1">
            <span>Mode:</span>
            <strong className="text-[var(--color-text-primary)] uppercase">{gameMode}</strong>
          </div>
          <div className="flex items-center gap-1">
            <span>Moves:</span>
            <strong className="text-[var(--color-text-primary)]">{moveCount}</strong>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <SoundSettings />
        <div className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-md text-xs font-medium uppercase tracking-wide border ${
          turn === "w" 
            ? "bg-[rgba(88,166,255,0.15)] border-[var(--color-accent-blue)] text-[var(--color-accent-blue)]" 
            : "bg-[var(--color-bg-tertiary)] border-[var(--color-border-default)] text-[var(--color-text-secondary)]"
        }`}>
          {turn === "w" ? "Your Turn" : "AI Turn"}
        </div>
      </div>
    </header>
  );
}

function PlayerBar({ 
  isOpponent, 
  name, 
  rating,
  color
}: { 
  isOpponent: boolean; 
  name: string; 
  rating: string;
  color: "w" | "b";
}) {
  const { turn } = useGameState();
  const isActive = (isOpponent && color === "b") || (!isOpponent && color === "w") ? turn === color : false;

  return (
    <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-lg px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[var(--color-bg-tertiary)] rounded-full flex items-center justify-center text-lg sm:text-xl shrink-0">
          {isOpponent ? "🤖" : "👤"}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-semibold text-sm text-[var(--color-text-primary)] truncate">{name}</span>
          <span className="text-xs text-[var(--color-text-muted)] truncate">{rating}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-3 ml-2">
        <div className="hidden sm:block">
          <CapturedPieces color={color === "w" ? "b" : "w"} />
        </div>
        <div className={`text-base sm:text-lg font-semibold px-2 sm:px-4 py-1 sm:py-2 rounded-md border shrink-0 ${
          isActive 
            ? "bg-[rgba(88,166,255,0.15)] border-[var(--color-accent-blue)] text-[var(--color-accent-blue)]" 
            : "bg-[var(--color-bg-tertiary)] border-[var(--color-border-muted)] text-[var(--color-text-primary)]"
        }`}>
          10:00
        </div>
      </div>
    </div>
  );
}

function GameModeSelector({ 
  gameMode, 
  onGameModeChange 
}: { 
  gameMode: GameMode; 
  onGameModeChange: (mode: GameMode) => void;
}) {
  return (
    <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-[var(--color-border-default)] bg-[var(--color-bg-tertiary)]">
        <div className="flex items-center gap-2 font-semibold text-[var(--color-text-primary)]">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Game Mode
        </div>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 gap-2">
          <button 
            className={`px-4 py-2.5 rounded-md font-medium text-sm transition-all border focus-visible:ring-2 focus-visible:ring-[var(--color-accent-blue)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-secondary)] ${
              gameMode === "pvp"
                ? "bg-[var(--color-accent-blue)] text-white border-[var(--color-accent-blue)]"
                : "bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] border-[var(--color-border-default)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]"
            }`}
            onClick={() => onGameModeChange("pvp")}
            aria-pressed={gameMode === "pvp"}
            aria-label="Player versus Player mode"
          >
            PvP
          </button>
          <button 
            className={`px-4 py-2.5 rounded-md font-medium text-sm transition-all border focus-visible:ring-2 focus-visible:ring-[var(--color-accent-blue)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-secondary)] ${
              gameMode === "pva"
                ? "bg-[var(--color-accent-blue)] text-white border-[var(--color-accent-blue)]"
                : "bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] border-[var(--color-border-default)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]"
            }`}
            onClick={() => onGameModeChange("pva")}
            aria-pressed={gameMode === "pva"}
            aria-label="Player versus AI mode"
          >
            PvA
          </button>
        </div>
      </div>
    </div>
  );
}

function GameContent() {
  const [gameMode, setGameMode] = useState<GameMode>("pva");
  const { resetGame, undoMove, isGameOver } = useGameState();

  const handleGameModeChange = useCallback((mode: GameMode) => {
    setGameMode(mode);
    resetGame();
  }, [resetGame]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Z or Cmd+Z for undo
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        undoMove();
        // In PvA mode, undo twice to undo both player and AI move
        if (gameMode === "pva") {
          setTimeout(() => undoMove(), 10);
        }
      }
      // N for new game
      if (e.key === "n" || e.key === "N") {
        e.preventDefault();
        resetGame();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undoMove, resetGame, gameMode]);

  return (
    <>
      <Header gameMode={gameMode} />
      
      <div className="flex-1 flex flex-col lg:flex-row p-4 sm:p-6 gap-4 sm:gap-6 max-w-[1400px] mx-auto w-full">
        {/* Board Section */}
        <div className="flex-1 flex flex-col gap-3 sm:gap-4 min-w-0">
          {/* Opponent Bar */}
          <PlayerBar 
            isOpponent={true} 
            name={gameMode === "pva" ? "AI Opponent" : "Player 2"} 
            rating={gameMode === "pva" ? "Engine" : "Black"}
            color="b"
          />

          {/* Chess Board */}
          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-xl p-3 sm:p-6 flex justify-center shadow-lg">
            <ChessBoard />
          </div>

          {/* Player Bar */}
          <PlayerBar 
            isOpponent={false} 
            name="You" 
            rating="White"
            color="w"
          />

          {/* Mobile captured pieces */}
          <div className="sm:hidden bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-lg p-3">
            <div className="text-xs text-[var(--color-text-muted)] mb-2">Captured pieces:</div>
            <div className="flex justify-between gap-4">
              <CapturedPieces color="w" />
              <CapturedPieces color="b" />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 flex flex-col gap-4">
          {/* Game Status */}
          <TurnIndicator />

          {/* Game Mode Selector */}
          <GameModeSelector gameMode={gameMode} onGameModeChange={handleGameModeChange} />

          {/* Move History */}
          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-lg overflow-hidden flex flex-col">
            <MoveHistory />
          </div>

          {/* Keyboard shortcuts hint */}
          <div className="text-xs text-[var(--color-text-muted)] px-2">
            <p>Keyboard shortcuts:</p>
            <p><kbd className="bg-[var(--color-bg-tertiary)] px-1 rounded">Ctrl+Z</kbd> Undo</p>
            <p><kbd className="bg-[var(--color-bg-tertiary)] px-1 rounded">N</kbd> New Game</p>
          </div>

          {/* Game Controls */}
          <GameControls gameMode={gameMode} />
        </div>
      </div>

      {/* Game Over Modal */}
      <GameOverModal isOpen={isGameOver} />
    </>
  );
}

export default function Home() {
  return (
    <GameStateProvider>
      <div className="min-h-screen flex flex-col" style={{ background: "var(--color-bg-primary)" }}>
        <GameContent />
      </div>
    </GameStateProvider>
  );
}
