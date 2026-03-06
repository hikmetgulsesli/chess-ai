"use client";

import React from "react";
import { useGameState } from "@/lib/game-state";

export function PromotionDialog() {
  const { pendingPromotion, completePromotion, cancelPromotion } = useGameState();

  if (!pendingPromotion) return null;

  const pieceColor = pendingPromotion.color;
  const pieceColorClass = pieceColor === "w" ? "var(--chess-white-piece)" : "var(--chess-black-piece)";
  const strokeColor = pieceColor === "w" ? "#000" : "#fff";

  const pieces: { type: "q" | "r" | "b" | "n"; label: string }[] = [
    { type: "q", label: "Queen" },
    { type: "r", label: "Rook" },
    { type: "b", label: "Bishop" },
    { type: "n", label: "Knight" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-xl p-6 shadow-2xl max-w-sm w-full mx-4">
        <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2 text-center">
          Pawn Promotion
        </h3>
        <p className="text-sm text-[var(--color-text-secondary)] mb-6 text-center">
          Choose a piece to promote your pawn to
        </p>

        <div className="grid grid-cols-4 gap-3">
          {pieces.map(({ type, label }) => (
            <button
              key={type}
              onClick={() => completePromotion(type)}
              className="flex flex-col items-center gap-2 p-3 rounded-lg bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)] hover:border-[var(--color-accent-blue)] hover:bg-[var(--color-bg-elevated)] transition-all duration-200 group"
              aria-label={`Promote to ${label}`}
            >
              <div className="w-12 h-12">
                <PieceSVG type={type} color={pieceColorClass} stroke={strokeColor} />
              </div>
              <span className="text-xs text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)]">
                {label}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={cancelPromotion}
          className="w-full mt-4 py-2 px-4 rounded-lg bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border-muted)] transition-all duration-200 text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function PieceSVG({ type, color, stroke }: { type: string; color: string; stroke: string }) {
  const pieceColor = color;
  const strokeColor = stroke;

  switch (type) {
    case "q":
      return (
        <svg viewBox="0 0 45 45" className="w-full h-full" style={{ color: pieceColor }}>
          <path d="M8 12l5.5 5.5L8 23l5.5 5.5L8 34l14.5-6L37 34l-5.5-5.5L37 23l-5.5-5.5L37 12 22.5 18 8 12z" fill={pieceColor} stroke={strokeColor} strokeWidth="1.5" />
          <path d="M8 12l3-5h24l3 5" stroke={strokeColor} strokeWidth="1.5" fill="none" />
          <path d="M11 7l-2-4M22.5 7V3M34 7l2-4" stroke={strokeColor} strokeWidth="1.5" fill="none" />
        </svg>
      );
    case "r":
      return (
        <svg viewBox="0 0 45 45" className="w-full h-full" style={{ color: pieceColor }}>
          <path d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5" stroke={strokeColor} strokeWidth="1.5" fill={pieceColor} />
          <path d="M34 14l-3 22H14l-3-22" fill={pieceColor} stroke={strokeColor} strokeWidth="1.5" />
          <path d="M31 14v-3.5c0-1.5-1-2.5-2.5-2.5h-12c-1.5 0-2.5 1-2.5 2.5V14" fill={pieceColor} stroke={strokeColor} strokeWidth="1.5" />
        </svg>
      );
    case "b":
      return (
        <svg viewBox="0 0 45 45" className="w-full h-full" style={{ color: pieceColor }}>
          <path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.35.49-2.32.47-3-.5 1.35-1.46 3-2 3-2z" fill={pieceColor} stroke={strokeColor} strokeWidth="1.5" />
          <path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z" fill={pieceColor} stroke={strokeColor} strokeWidth="1.5" />
          <path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z" fill={pieceColor} stroke={strokeColor} strokeWidth="1.5" />
        </svg>
      );
    case "n":
      return (
        <svg viewBox="0 0 45 45" className="w-full h-full" style={{ color: pieceColor }}>
          <path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill={pieceColor} stroke={strokeColor} strokeWidth="1.5" />
          <path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3" fill={pieceColor} stroke={strokeColor} strokeWidth="1.5" />
          <circle cx="9.5" cy="25.5" r="0.5" fill={pieceColor} stroke={strokeColor} strokeWidth="1.5" />
        </svg>
      );
    default:
      return null;
  }
}
