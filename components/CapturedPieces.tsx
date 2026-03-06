"use client";

import React, { useMemo } from "react";
import { useGameState } from "@/lib/game-state";

const PIECE_SYMBOLS: Record<string, string> = {
  k: "♔",
  q: "♕",
  r: "♖",
  b: "♗",
  n: "♘",
  p: "♙",
};

const PIECE_VALUES: Record<string, number> = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
  k: 0,
};

interface CapturedPiecesProps {
  color: "w" | "b";
}

export function CapturedPieces({ color }: CapturedPiecesProps) {
  const { capturedPieces } = useGameState();

  const { pieces, advantage } = useMemo(() => {
    const piecesOfColor = capturedPieces.filter((p) => p.color === color);
    const grouped = piecesOfColor.reduce((acc, piece) => {
      acc[piece.type] = (acc[piece.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalValue = piecesOfColor.reduce((sum, p) => sum + (PIECE_VALUES[p.type] || 0), 0);
    
    // Calculate material advantage
    const opponentPieces = capturedPieces.filter((p) => p.color !== color);
    const opponentValue = opponentPieces.reduce((sum, p) => sum + (PIECE_VALUES[p.type] || 0), 0);
    const advantage = totalValue - opponentValue;

    return { pieces: grouped, advantage };
  }, [capturedPieces, color]);

  const pieceOrder = ["q", "r", "b", "n", "p"];

  if (Object.keys(pieces).length === 0) {
    return (
      <div 
        className="flex items-center justify-center h-8 text-xs text-[var(--color-text-muted)]"
        aria-label={`No pieces captured by ${color === "w" ? "white" : "black"}`}
      >
        No captured pieces
      </div>
    );
  }

  return (
    <div 
      className="flex items-center gap-2 flex-wrap"
      aria-label={`Captured pieces for ${color === "w" ? "white" : "black"}`}
    >
      <div className="flex items-center gap-1">
        {pieceOrder.map((type) => {
          const count = pieces[type] || 0;
          if (count === 0) return null;
          
          return (
            <div key={type} className="flex items-center">
              <span 
                className={`text-lg ${color === "w" ? "text-[var(--chess-white-piece)]" : "text-[var(--chess-black-piece)]"}`}
                aria-hidden="true"
              >
                {PIECE_SYMBOLS[type]}
              </span>
              {count > 1 && (
                <span className="text-xs text-[var(--color-text-muted)] ml-0.5">
                  ×{count}
                </span>
              )}
            </div>
          );
        })}
      </div>
      
      {advantage > 0 && (
        <span 
          className="text-xs font-medium text-[var(--color-accent-green)] ml-1"
          aria-label={`Material advantage: +${advantage}`}
        >
          +{advantage}
        </span>
      )}
    </div>
  );
}
