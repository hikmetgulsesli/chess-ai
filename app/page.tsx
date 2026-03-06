"use client";

import React from "react";
import { GameStateProvider, useGameState } from "@/lib/game-state";
import { ChessBoard } from "@/components/ChessBoard";
import { MoveHistory } from "@/components/MoveHistory";
import { GameControls } from "@/components/GameControls";
import { TurnIndicator } from "@/components/TurnIndicator";

function Header() {
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
            <span>Difficulty:</span>
            <strong>Medium</strong>
          </div>
          <div className="game-info-item">
            <span>Moves:</span>
            <strong>{moveCount}</strong>
          </div>
        </div>
      </div>
      <div className={`status-badge ${turn === "w" ? "active" : ""}`}>
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
  return (
    <>
      <Header />
      
      <div className="main-container">
        {/* Board Section */}
        <div className="board-section">
          {/* Opponent Bar */}
          <PlayerBar 
            isOpponent={true} 
            name="Stockfish AI" 
            rating="Level: Medium" 
          />

          {/* Chess Board */}
          <div className="chess-board-container">
            <ChessBoard />
          </div>

          {/* Player Bar */}
          <PlayerBar 
            isOpponent={false} 
            name="You" 
            rating="Human Player" 
          />
        </div>

        {/* Sidebar */}
        <div className="sidebar">
          {/* Game Status */}
          <TurnIndicator />

          {/* Move History */}
          <div className="panel">
            <MoveHistory />
          </div>

          {/* Difficulty */}
          <DifficultySelector />

          {/* Game Controls */}
          <GameControls />
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
