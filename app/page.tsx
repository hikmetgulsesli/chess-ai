"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { GameStateProvider, useGameState } from "@/lib/game-state";
import { ChessBoard } from "@/components/ChessBoard";
import { MoveHistory } from "@/components/MoveHistory";
import { GameControls } from "@/components/GameControls";
import { TurnIndicator } from "@/components/TurnIndicator";
import { AISelector } from "@/components/AISelector";
import { Difficulty, GameMode, getBestMove } from "@/lib/ai-engine";

function Header({ 
  gameMode, 
  difficulty, 
  isThinking 
}: { 
  gameMode: GameMode; 
  difficulty: Difficulty; 
  isThinking: boolean;
}) {
  const { history, turn } = useGameState();
  const moveCount = history.length;

  return (
    <header className="header bg-[var(--color-bg-secondary)] border-b border-[var(--color-border-default)] px-6 py-4 flex items-center justify-between">
      <div className="header-left flex items-center gap-4">
        <div className="logo font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--color-text-primary)] flex items-center gap-2">
          <div className="logo-icon w-8 h-8 bg-gradient-to-br from-[var(--color-accent-blue)] to-[var(--color-accent-purple)] rounded-md flex items-center justify-center text-lg">
            ♟
          </div>
          Chess AI
        </div>
        <div className="game-info flex items-center gap-6 text-sm text-[var(--color-text-secondary)]">
          {gameMode === "pva" && (
            <div className="game-info-item flex items-center gap-1">
              <span>Difficulty:</span>
              <strong className="text-[var(--color-text-primary)] capitalize">{difficulty}</strong>
            </div>
          )}
          <div className="game-info-item flex items-center gap-1">
            <span>Moves:</span>
            <strong className="text-[var(--color-text-primary)]">{moveCount}</strong>
          </div>
        </div>
      </div>
      <div className={`status-badge px-3 py-1.5 rounded-md text-xs font-medium uppercase tracking-wide border ${
        turn === "w" 
          ? "bg-[rgba(88,166,255,0.15)] border-[var(--color-accent-blue)] text-[var(--color-accent-blue)]" 
          : "bg-[var(--color-bg-tertiary)] border-[var(--color-border-default)] text-[var(--color-text-secondary)]"
      }`}>
        {isThinking ? "AI Thinking..." : turn === "w" ? "Your Turn" : "AI Turn"}
      </div>
    </header>
  );
}

function PlayerBar({ 
  isOpponent, 
  name, 
  rating,
  isActive
}: { 
  isOpponent: boolean; 
  name: string; 
  rating: string;
  isActive: boolean;
}) {
  return (
    <div className="player-bar bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-lg px-4 py-3 flex items-center justify-between">
      <div className="player-info flex items-center gap-3">
        <div className="player-avatar w-9 h-9 bg-[var(--color-bg-tertiary)] rounded-full flex items-center justify-center text-xl">
          {isOpponent ? "🤖" : "👤"}
        </div>
        <div className="player-details">
          <span className="player-name font-semibold text-sm text-[var(--color-text-primary)]">{name}</span>
          <span className="player-rating text-xs text-[var(--color-text-muted)]">{rating}</span>
        </div>
      </div>
      <div className={`player-timer font-[family-name:var(--font-heading)] text-lg font-semibold px-4 py-2 rounded-md border ${
        isActive 
          ? "bg-[rgba(88,166,255,0.15)] border-[var(--color-accent-blue)] text-[var(--color-accent-blue)]" 
          : "bg-[var(--color-bg-tertiary)] border-[var(--color-border-muted)] text-[var(--color-text-primary)]"
      }`}>
        10:00
      </div>
    </div>
  );
}

function GameContent() {
  const [gameMode, setGameMode] = useState<GameMode>("pva");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [isThinking, setIsThinking] = useState(false);
  const aiTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const shouldMakeAIMove = useRef(false);
  
  const { turn, makeMove, chess, resetGame, isGameOver } = useGameState();

  // Schedule AI move using ref to avoid setState in effect
  useEffect(() => {
    if (gameMode === "pva" && turn === "b" && !isThinking && !isGameOver) {
      shouldMakeAIMove.current = true;
    }
  }, [turn, gameMode, isThinking, isGameOver]);

  // Process AI move in a separate effect that doesn't trigger cascading renders
  useEffect(() => {
    if (!shouldMakeAIMove.current) return;
    shouldMakeAIMove.current = false;
    
    if (gameMode !== "pva" || turn !== "b" || isGameOver) return;
    
    // Use requestAnimationFrame to avoid synchronous setState
    const frameId = requestAnimationFrame(() => {
      setIsThinking(true);
      
      aiTimeoutRef.current = setTimeout(() => {
        const move = getBestMove(chess, difficulty);
        
        if (move) {
          makeMove(move.from, move.to, move.promotion);
        }
        
        setIsThinking(false);
      }, 500);
    });
    
    return () => cancelAnimationFrame(frameId);
  }, [chess, turn, difficulty, gameMode, makeMove, isGameOver]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (aiTimeoutRef.current) {
        clearTimeout(aiTimeoutRef.current);
      }
    };
  }, []);

  // Handle game mode change - reset game when switching modes
  const handleGameModeChange = useCallback((mode: GameMode) => {
    setGameMode(mode);
    resetGame();
    if (aiTimeoutRef.current) {
      clearTimeout(aiTimeoutRef.current);
    }
    setIsThinking(false);
  }, [resetGame]);

  return (
    <>
      <Header gameMode={gameMode} difficulty={difficulty} isThinking={isThinking} />
      
      <div className="main-container flex-1 flex p-6 gap-6 max-w-[1400px] mx-auto w-full">
        {/* Board Section */}
        <div className="board-section flex-1 flex flex-col gap-4">
          {/* Opponent Bar */}
          <PlayerBar 
            isOpponent={true} 
            name={gameMode === "pva" ? "AI Opponent" : "Player 2"} 
            rating={gameMode === "pva" ? `Level: ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}` : "Black"}
            isActive={turn === "b"}
          />

          {/* Chess Board */}
          <div className="chess-board-container bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-xl p-6 flex justify-center shadow-lg">
            <ChessBoard />
          </div>

          {/* Player Bar */}
          <PlayerBar 
            isOpponent={false} 
            name="You" 
            rating="White"
            isActive={turn === "w"}
          />
        </div>

        {/* Sidebar */}
        <div className="sidebar w-80 flex flex-col gap-4">
          {/* Game Status */}
          <TurnIndicator />

          {/* AI Selector */}
          <AISelector
            gameMode={gameMode}
            difficulty={difficulty}
            onGameModeChange={handleGameModeChange}
            onDifficultyChange={setDifficulty}
            isThinking={isThinking}
          />

          {/* Move History */}
          <div className="panel bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-lg overflow-hidden flex flex-col">
            <MoveHistory />
          </div>

          {/* Game Controls */}
          <div className="panel bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-lg overflow-hidden">
            <GameControls />
          </div>
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
