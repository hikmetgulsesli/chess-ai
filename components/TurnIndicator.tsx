"use client";

import React from "react";
import { useGameState } from "@/lib/game-state";

export function TurnIndicator() {
  const { turn, status, isCheck, isCheckmate, isStalemate, history } = useGameState();

  const getStatusMessage = () => {
    if (isCheckmate) {
      const winner = turn === "w" ? "Black" : "White";
      return `${winner} wins by checkmate!`;
    }
    if (isStalemate) return "Game drawn by stalemate";
    if (status === "draw") return "Game drawn";
    if (isCheck) return `${turn === "w" ? "White" : "Black"} is in check!`;
    return `${turn === "w" ? "White" : "Black"} to move`;
  };

  const getStatusTitle = () => {
    if (isCheckmate) return "Checkmate!";
    if (isCheck) return "Check!";
    return `Turn ${Math.floor(history.length / 2) + 1}`;
  };

  const statusColor = isCheckmate 
    ? "border-[var(--color-accent-purple)] bg-[rgba(137,87,229,0.15)]"
    : isCheck 
    ? "border-[var(--color-accent-red)] bg-[rgba(218,54,51,0.15)]"
    : "border-[var(--color-border-default)]";

  return (
    <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-[var(--color-border-default)] bg-[var(--color-bg-tertiary)]">
        <div className="flex items-center gap-2 font-semibold text-[var(--color-text-primary)]">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Game Status
        </div>
      </div>
      <div className="p-4">
        <div 
          className={`rounded-lg p-4 text-center border ${statusColor} transition-colors duration-200`}
          role="status"
          aria-live="polite"
          aria-label={getStatusMessage()}
        >
          <div className="font-semibold text-[var(--color-text-primary)] text-lg mb-1">
            {getStatusTitle()}
          </div>
          <div className="text-sm text-[var(--color-text-secondary)]">
            {getStatusMessage()}
          </div>
        </div>
        
        <div className="mt-4 flex gap-2" role="group" aria-label="Turn indicators">
          <div 
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md border text-sm font-medium transition-all duration-200 ${
              turn === "w" 
                ? "bg-[rgba(88,166,255,0.15)] border-[var(--color-accent-blue)] text-[var(--color-text-primary)]" 
                : "bg-[var(--color-bg-tertiary)] border-[var(--color-border-default)] text-[var(--color-text-secondary)]"
            }`}
            aria-current={turn === "w" ? "true" : undefined}
          >
            <span 
              className="w-2.5 h-2.5 rounded-full border border-[var(--color-border-default)]"
              style={{ background: "var(--chess-white-piece)" }}
              aria-hidden="true"
            />
            White
          </div>
          <div 
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md border text-sm font-medium transition-all duration-200 ${
              turn === "b" 
                ? "bg-[rgba(88,166,255,0.15)] border-[var(--color-accent-blue)] text-[var(--color-text-primary)]" 
                : "bg-[var(--color-bg-tertiary)] border-[var(--color-border-default)] text-[var(--color-text-secondary)]"
            }`}
            aria-current={turn === "b" ? "true" : undefined}
          >
            <span 
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: "var(--chess-black-piece)" }}
              aria-hidden="true"
            />
            Black
          </div>
        </div>
      </div>
    </div>
  );
}
