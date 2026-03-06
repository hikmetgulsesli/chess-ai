"use client";

import React, { useRef, useEffect } from "react";
import { useGameState } from "@/lib/game-state";

export function MoveHistory() {
  const { history } = useGameState();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new moves are added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  // Group moves into pairs (white and black)
  const movePairs: { moveNumber: number; white?: string; black?: string }[] = [];
  
  for (let i = 0; i < history.length; i += 2) {
    movePairs.push({
      moveNumber: Math.floor(i / 2) + 1,
      white: history[i]?.san,
      black: history[i + 1]?.san,
    });
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-[var(--color-border-default)] bg-[var(--color-bg-tertiary)]">
        <div className="flex items-center gap-2 font-semibold text-[var(--color-text-primary)]">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Move History
        </div>
      </div>
      <div className="p-4 flex-1 overflow-hidden">
        <div 
          ref={scrollRef} 
          className="h-full overflow-y-auto font-mono text-sm"
          role="log"
          aria-live="polite"
          aria-label="Chess move history"
          style={{ maxHeight: "200px" }}
        >
          {movePairs.length === 0 ? (
            <div className="text-[var(--color-text-muted)] text-sm text-center py-8">
              No moves yet
            </div>
          ) : (
            <div className="space-y-1">
              {movePairs.map((pair) => (
                <div 
                  key={pair.moveNumber} 
                  className="flex gap-4 py-1 border-b border-[var(--color-border-muted)] last:border-b-0 animate-slide-in"
                  style={{ animationDelay: `${pair.moveNumber * 0.05}s` }}
                >
                  <span className="text-[var(--color-text-muted)] w-8 shrink-0">
                    {pair.moveNumber}.
                  </span>
                  <span className="text-[var(--color-text-primary)] font-medium w-16 shrink-0">
                    {pair.white || "..."}
                  </span>
                  <span className="text-[var(--color-text-primary)] font-medium">
                    {pair.black || ""}
                  </span>
                </div>
              ))}
              {/* Current turn indicator */}
              {history.length % 2 === 0 && history.length > 0 && (
                <div className="flex gap-4 py-1 opacity-50">
                  <span className="text-[var(--color-text-muted)] w-8 shrink-0">
                    {Math.floor(history.length / 2) + 1}.
                  </span>
                  <span className="text-[var(--color-text-primary)] font-medium">...</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
