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
    <header className="header">
      <div className="header-left">
        <div className="logo">
          <div className="logo-icon">♟</div>
          Chess AI
        </div>
        <div className="game-info">
          <div className="game-info-item">
            <span>Mode:</span>
            <strong>{gameMode === "pva" ? "PvA" : "PvP"}</strong>
          </div>
          <div className="game-info-item">
            <span>Moves:</span>
            <strong>{moveCount}</strong>
          </div>
        </div>
      </div>
      <div className={`status-badge ${turn === "w" ? "active" : ""}`}>
        {turn === "w" ? "Your Turn" : "AI Turn"}
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
    <div className="player-bar">
      <div className="player-info">
        <div className="player-avatar">{isOpponent ? "🤖" : "👤"}</div>
        <div className="player-details">
          <span className="player-name">{name}</span>
          <span className="player-rating">{rating}</span>
        </div>
      </div>
      <div className={`player-timer ${isActive ? "active" : ""}`}>
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
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">
          <svg className="panel-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Game Mode
        </div>
      </div>
      <div className="panel-content">
        <div className="difficulty-selector">
          <button 
            className={`difficulty-btn ${gameMode === "pvp" ? "active" : ""}`}
            onClick={() => onGameModeChange("pvp")}
          >
            👥 PvP
          </button>
          <button 
            className={`difficulty-btn ${gameMode === "pva" ? "active" : ""}`}
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
  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">
          <svg className="panel-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          AI Difficulty
        </div>
      </div>
      <div className="panel-content">
        <div className="difficulty-selector">
          <button className="difficulty-btn">Easy</button>
          <button className="difficulty-btn active">Medium</button>
          <button className="difficulty-btn">Hard</button>
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
      
      <div className="main-container">
        {/* Board Section */}
        <div className="board-section">
          {/* Opponent Bar */}
          <PlayerBar 
            isOpponent={true} 
            name={gameMode === "pva" ? "AI Opponent" : "Player 2"} 
            rating={gameMode === "pva" ? "Engine" : "Black"}
          />

          {/* Chess Board */}
          <div className="chess-board-container">
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
        <div className="sidebar">
          {/* Game Status */}
          <TurnIndicator />

          {/* Game Mode Selector */}
          <GameModeSelector gameMode={gameMode} onGameModeChange={handleGameModeChange} />

          {/* Difficulty */}
          {gameMode === "pva" && <DifficultySelector />}

          {/* Move History */}
          <div className="panel">
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
