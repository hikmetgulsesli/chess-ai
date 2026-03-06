"use client";

import React from "react";
import { useGameState } from "@/lib/game-state";

const PROMOTION_PIECES: { type: "q" | "r" | "b" | "n"; symbol: string; name: string }[] = [
  { type: "q", symbol: "♛", name: "Queen" },
  { type: "r", symbol: "♜", name: "Rook" },
  { type: "b", symbol: "♝", name: "Bishop" },
  { type: "n", symbol: "♞", name: "Knight" },
];

export function PromotionDialog() {
  const { pendingPromotion, completePromotion, cancelPromotion } = useGameState();

  if (!pendingPromotion) return null;

  const color = pendingPromotion.color;
  const pieces = PROMOTION_PIECES.map((p) => ({
    ...p,
    symbol: color === "w" ? p.symbol.replace("♛", "♕").replace("♜", "♖").replace("♝", "♗").replace("♞", "♘") : p.symbol,
  }));

  return (
    <div className="promotion-overlay">
      <div className="promotion-dialog">
        <h3 className="promotion-title">Choose Promotion Piece</h3>
        <div className="promotion-pieces">
          {pieces.map((piece) => (
            <button
              key={piece.type}
              className="promotion-piece-btn"
              onClick={() => completePromotion(piece.type)}
              aria-label={`Promote to ${piece.name}`}
            >
              <span className="promotion-symbol">{piece.symbol}</span>
              <span className="promotion-name">{piece.name}</span>
            </button>
          ))}
        </div>
        <button className="promotion-cancel" onClick={cancelPromotion}>
          Cancel
        </button>
      </div>
    </div>
  );
}
