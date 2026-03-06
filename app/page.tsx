"use client";

import React, { useState } from "react";
import { GameStateProvider, useGameState } from "@/lib/game-state";
import { ChessBoard } from "@/components/ChessBoard";
import { MoveHistory } from "@/components/MoveHistory";
import { GameControls, GameMode } from "@/components/GameControls";
import { TurnIndicator } from "@/components/TurnIndicator";

function Header({ gameMode }: { gameMode: GameMode }) {
  const { history, turn } = useGameState();
  const moveCount = history.length;

  return (
    <header className="bg-[var(--color-bg-secondary)] border-b border-[var(--color-border-default)] px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--color-text-primary)] flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-[var(--color-accent-blue)] to-[var(--color-accent-purple)] rounded-md flex items-center justify-center text-lg">
            ♟
          </div>
          Chess AI
        </div>
        <div className="flex items-center gap-6 text-sm text-[var(--color-text-secondary)]">
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
      <div className={`px-3 py-1.5 rounded-md text-xs font-medium uppercase tracking-wide border ${
        turn === "w" 
          ? "bg-[rgba(88,166,255,0.15)] border-[var(--color-accent-blue)] text-[var(--color-accent-blue)]" 
          : "bg-[var(--color-bg-tertiary)] border-[var(--color-border-default)] text-[var(--color-text-secondary)]"
      }`}>
        {turn === "w" ? "Your Turn" : "AI Thinking"}
      </div>
    </header>
  );
}

function PlayerBar({ 
  isOpponent, 
  name, 
  rating 
}: { 
  isOpponent: boolean; 
  name: string; 
  rating: string;
}) {
  const { turn } = useGameState();
  const isActive = isOpponent ? turn === "b" : turn === "w";

  return (
    <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-lg px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-[var(--color-bg-tertiary)] rounded-full flex items-center justify-center text-xl">
          {isOpponent ? "🤖" : "👤"}
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-sm text-[var(--color-text-primary)]">{name}</span>
          <span className="text-xs text-[var(--color-text-muted)]">{rating}</span>
        </div>
      </div>
      <div className={`font-[family-name:var(--font-heading)] text-lg font-semibold px-4 py-2 rounded-md border ${
        isActive 
          ? "bg-[rgba(88,166,255,0.15)] border-[var(--color-accent-blue)] text-[var(--color-accent-blue)]" 
          : "bg-[var(--color-bg-tertiary)] border-[var(--color-border-muted)] text-[var(--color-text-primary)]"
      }`}>
        10:00
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
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Game Mode
        </div>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 gap-2">
          <button 
            className={`px-4 py-2.5 rounded-md font-medium text-sm transition-all border ${
              gameMode === "pvp"
                ? "bg-[var(--color-accent-blue)] text-white border-[var(--color-accent-blue)]"
                : "bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] border-[var(--color-border-default)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]"
            }`}
            onClick={() => onGameModeChange("pvp")}
          >
            👥 PvP
          </button>
          <button 
            className={`px-4 py-2.5 rounded-md font-medium text-sm transition-all border ${
              gameMode === "pva"
                ? "bg-[var(--color-accent-blue)] text-white border-[var(--color-accent-blue)]"
                : "bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] border-[var(--color-border-default)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]"
            }`}
            onClick={() => onGameModeChange("pva")}
          >
            🤖 PvA
          </button>
        </div>
      </div>
    </div>
  );
}

function DifficultySelector() {
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");

  return (
    <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-[var(--color-border-default)] bg-[var(--color-bg-tertiary)]">
        <div className="flex items-center gap-2 font-semibold text-[var(--color-text-primary)]">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          AI Difficulty
        </div>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-3 gap-2">
          <button 
            className={`px-3 py-2 rounded-md font-medium text-sm transition-all border ${
              difficulty === "easy"
                ? "bg-[var(--color-accent-green)] text-white border-[var(--color-accent-green)]"
                : "bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] border-[var(--color-border-default)] hover:bg-[var(--color-bg-elevated)]"
            }`}
            onClick={() => setDifficulty("easy")}
          >
            Easy
          </button>
          <button 
            className={`px-3 py-2 rounded-md font-medium text-sm transition-all border ${
              difficulty === "medium"
                ? "bg-[var(--color-accent-yellow)] text-black border-[var(--color-accent-yellow)]"
                : "bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] border-[var(--color-border-default)] hover:bg-[var(--color-bg-elevated)]"
            }`}
            onClick={() => setDifficulty("medium")}
          >
            Medium
          </button>
          <button 
            className={`px-3 py-2 rounded-md font-medium text-sm transition-all border ${
              difficulty === "hard"
                ? "bg-[var(--color-accent-red)] text-white border-[var(--color-accent-red)]"
                : "bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] border-[var(--color-border-default)] hover:bg-[var(--color-bg-elevated)]"
            }`}
            onClick={() => setDifficulty("hard")}
          >
            Hard
          </button>
        </div>
      </div>
    </div>
  );
}

function GameContent() {
  const [gameMode, setGameMode] = useState<GameMode>("pva");
  const { resetGame } = useGameState();

  const handleGameModeChange = (mode: GameMode) => {
    setGameMode(mode);
    resetGame();
  };

  return (
    <>
      <Header gameMode={gameMode} />
      
      <div className="flex-1 flex p-6 gap-6 max-w-[1400px] mx-auto w-full">
        {/* Board Section */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Opponent Bar */}
          <PlayerBar 
            isOpponent={true} 
            name={gameMode === "pva" ? "AI Opponent" : "Player 2"} 
            rating={gameMode === "pva" ? "Stockfish Engine" : "Black"}
          />

          {/* Chess Board */}
          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-xl p-6 flex justify-center shadow-lg">
            <ChessBoard />
          </div>

          {/* Player Bar */}
          <PlayerBar 
            isOpponent={false} 
            name="You" 
            rating="White" 
          />
        </div>

        {/* Sidebar */}
        <div className="w-80 flex flex-col gap-4">
          {/* Game Status */}
          <TurnIndicator />

          {/* Game Mode Selector */}
          <GameModeSelector gameMode={gameMode} onGameModeChange={handleGameModeChange} />

          {/* Difficulty */}
          {gameMode === "pva" && <DifficultySelector />}

          {/* Move History */}
          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-lg overflow-hidden flex flex-col">
            <MoveHistory />
          </div>

          {/* Game Controls */}
          <GameControls gameMode={gameMode} />
        </div>
      </div>
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
