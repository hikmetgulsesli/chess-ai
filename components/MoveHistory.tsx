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
      <div className="panel-header px-4 py-3 border-b border-[var(--color-border-default)] bg-[var(--color-bg-tertiary)]">
        <div className="panel-title flex items-center gap-2 font-semibold text-[var(--color-text-primary)]">
          <svg className="panel-icon w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Move History
        </div>
      </div>
      <div className="panel-content flex-1 overflow-hidden bg-[var(--color-bg-secondary)]">
        <div 
          ref={scrollRef}
          className="move-history h-full overflow-y-auto max-h-[300px]"
        >
          {movePairs.length === 0 ? (
            <div className="text-[var(--color-text-muted)] text-sm text-center py-8">
              No moves yet
            </div>
          ) : (
            <div className="divide-y divide-[var(--color-border-muted)]">
              {movePairs.map((pair) => (
                <div 
                  key={pair.moveNumber} 
                  className="move-row grid grid-cols-3 gap-2 px-3 py-2 hover:bg-[var(--color-bg-tertiary)] transition-colors"
                >
                  <span className="move-number text-[var(--color-text-muted)] text-sm font-mono">
                    {pair.moveNumber}.
                  </span>
                  <span className="move-white text-[var(--color-text-primary)] text-sm font-mono font-medium">
                    {pair.white || "..."}
                  </span>
                  <span className="move-black text-[var(--color-text-primary)] text-sm font-mono font-medium">
                    {pair.black || ""}
                  </span>
                </div>
              ))}
            </div>
          )}
          {/* Current turn indicator */}
          {history.length % 2 === 0 && history.length > 0 && (
            <div className="move-row grid grid-cols-3 gap-2 px-3 py-2 opacity-50">
              <span className="move-number text-[var(--color-text-muted)] text-sm font-mono">
                {Math.floor(history.length / 2) + 1}.
              </span>
              <span className="move-white text-[var(--color-text-primary)] text-sm font-mono">...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
