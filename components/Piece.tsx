"use client";

import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

// Import all piece SVGs
import { WhiteKing, BlackKing } from "./pieces/King";
import { WhiteQueen, BlackQueen } from "./pieces/Queen";
import { WhiteRook, BlackRook } from "./pieces/Rook";
import { WhiteBishop, BlackBishop } from "./pieces/Bishop";
import { WhiteKnight, BlackKnight } from "./pieces/Knight";
import { WhitePawn, BlackPawn } from "./pieces/Pawn";

export type PieceType = "king" | "queen" | "rook" | "bishop" | "knight" | "pawn";
export type PieceColor = "white" | "black";

export interface PieceProps {
  type: PieceType;
  color: PieceColor;
  square: string; // algebraic notation, e.g., "e4"
  className?: string;
  disabled?: boolean;
}

const pieceComponents = {
  king: { white: WhiteKing, black: BlackKing },
  queen: { white: WhiteQueen, black: BlackQueen },
  rook: { white: WhiteRook, black: BlackRook },
  bishop: { white: WhiteBishop, black: BlackBishop },
  knight: { white: WhiteKnight, black: BlackKnight },
  pawn: { white: WhitePawn, black: BlackPawn },
};

const pieceColors = {
  white: "var(--chess-white-piece)",
  black: "var(--chess-black-piece)",
};

export function Piece({ type, color, square, className = "", disabled = false }: PieceProps) {
  const PieceSVG = pieceComponents[type][color];
  
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `piece-${square}`,
    data: {
      type,
      color,
      square,
    },
    disabled,
  });

  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
        zIndex: 50,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        color: pieceColors[color],
        cursor: disabled ? "default" : "grab",
        opacity: isDragging ? 0.5 : 1,
        transform: isDragging ? `${style?.transform || ""} scale(1.1)` : style?.transform,
        transition: "opacity 0.15s ease, transform 0.15s ease",
        filter: isDragging ? "drop-shadow(0 10px 20px rgba(0, 0, 0, 0.4))" : "none",
      }}
      className={`
        w-full h-full flex items-center justify-center
        hover:scale-105 transition-transform duration-150
        ${isDragging ? "scale-110" : ""}
        ${className}
      `}
      {...listeners}
      {...attributes}
      role="img"
      aria-label={`${color} ${type} at ${square}`}
    >
      <PieceSVG className="w-4/5 h-4/5" />
    </div>
  );
}

// Re-export piece types for convenience
export { WhiteKing, BlackKing, WhiteQueen, BlackQueen };
export { WhiteRook, BlackRook, WhiteBishop, BlackBishop };
export { WhiteKnight, BlackKnight, WhitePawn, BlackPawn };
