"use client";

import React from "react";
import { Difficulty, GameMode } from "@/lib/ai-engine";
import { Bot, Users, Brain } from "lucide-react";

interface AISelectorProps {
  gameMode: GameMode;
  difficulty: Difficulty;
  onGameModeChange: (mode: GameMode) => void;
  onDifficultyChange: (difficulty: Difficulty) => void;
  isThinking?: boolean;
}

export function AISelector({
  gameMode,
  difficulty,
  onGameModeChange,
  onDifficultyChange,
  isThinking = false,
}: AISelectorProps) {
  return (
    <div className="panel bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-lg overflow-hidden">
      <div className="panel-header bg-[var(--color-bg-tertiary)] px-4 py-3 border-b border-[var(--color-border-default)] flex items-center justify-between">
        <div className="panel-title flex items-center gap-2 font-[family-name:var(--font-heading)] text-sm font-semibold text-[var(--color-text-primary)]">
          <Brain className="w-4 h-4 text-[var(--color-text-secondary)]" />
          Game Mode
        </div>
        {isThinking && (
          <div className="flex items-center gap-2 text-xs text-[var(--color-accent-blue)] animate-pulse">
            <div className="w-2 h-2 bg-[var(--color-accent-blue)] rounded-full animate-bounce" />
            AI thinking...
          </div>
        )}
      </div>

      <div className="panel-content p-4 space-y-4">
        {/* Game Mode Toggle */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">
            Play Against
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => onGameModeChange("pvp")}
              className={`
                flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md
                border transition-all duration-150 font-medium text-sm
                ${
                  gameMode === "pvp"
                    ? "bg-[rgba(88,166,255,0.15)] border-[var(--color-accent-blue)] text-[var(--color-accent-blue)]"
                    : "bg-[var(--color-bg-tertiary)] border-[var(--color-border-default)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]"
                }
              `}
            >
              <Users className="w-4 h-4" />
              Player
            </button>
            <button
              onClick={() => onGameModeChange("pva")}
              className={`
                flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md
                border transition-all duration-150 font-medium text-sm
                ${
                  gameMode === "pva"
                    ? "bg-[rgba(88,166,255,0.15)] border-[var(--color-accent-blue)] text-[var(--color-accent-blue)]"
                    : "bg-[var(--color-bg-tertiary)] border-[var(--color-border-default)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]"
                }
              `}
            >
              <Bot className="w-4 h-4" />
              AI
            </button>
          </div>
        </div>

        {/* Difficulty Selector (only show in PvA mode) */}
        {gameMode === "pva" && (
          <div className="space-y-2">
            <label className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">
              AI Difficulty
            </label>
            <div className="difficulty-selector flex gap-2">
              {(["easy", "medium", "hard"] as Difficulty[]).map((diff) => (
                <button
                  key={diff}
                  onClick={() => onDifficultyChange(diff)}
                  disabled={isThinking}
                  className={`
                    flex-1 py-2 px-3 rounded-md text-xs font-medium capitalize
                    border transition-all duration-150
                    ${
                      difficulty === diff
                        ? "bg-[rgba(88,166,255,0.15)] border-[var(--color-accent-blue)] text-[var(--color-accent-blue)]"
                        : "bg-[var(--color-bg-tertiary)] border-[var(--color-border-default)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]"
                    }
                    ${isThinking ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                >
                  {diff}
                </button>
              ))}
            </div>
            <p className="text-xs text-[var(--color-text-muted)]">
              {difficulty === "easy" && "AI searches 2 moves ahead"}
              {difficulty === "medium" && "AI searches 3 moves ahead"}
              {difficulty === "hard" && "AI searches 4 moves ahead"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
