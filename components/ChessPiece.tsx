"use client";

import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

interface ChessPieceProps {
  type: string;
  color: "w" | "b";
  square: string;
  disabled?: boolean;
}

export function ChessPiece({ type, color, square, disabled = false }: ChessPieceProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `piece-${square}`,
    disabled: disabled,
    data: { square, type, color },
  });

  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
        transition: isDragging ? undefined : "transform 0.2s ease-out",
        zIndex: isDragging ? 50 : 10,
      }
    : {
        transition: "transform 0.2s ease-out, opacity 0.2s ease-out",
        zIndex: 10,
      };

  const pieceColor = color === "w" ? "var(--chess-white-piece)" : "var(--chess-black-piece)";
  const strokeColor = color === "w" ? "#000" : "#fff";

  const getPieceSVG = () => {
    switch (type) {
      case "k":
        return (
          <svg viewBox="0 0 45 45" className="w-4/5 h-4/5" style={{ color: pieceColor }} aria-hidden="true">
            <path d="M22.5 11.63V6M20 8h5" stroke={strokeColor} strokeWidth="1.5" fill="none" />
            <path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill={pieceColor} stroke={strokeColor} strokeWidth="1.5" />
            <path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-1-7 2.5-7 2.5V14h-14v7.5s-3-3.5-7-2.5c-3 6 6 10.5 6 10.5v7" fill={pieceColor} stroke={strokeColor} strokeWidth="1.5" />
          </svg>
        );
      case "q":
        return (
          <svg viewBox="0 0 45 45" className="w-4/5 h-4/5" style={{ color: pieceColor }} aria-hidden="true">
            <path d="M8 12l5.5 5.5L8 23l5.5 5.5L8 34l14.5-6L37 34l-5.5-5.5L37 23l-5.5-5.5L37 12 22.5 18 8 12z" fill={pieceColor} stroke={strokeColor} strokeWidth="1.5" />
            <path d="M8 12l3-5h24l3 5" stroke={strokeColor} strokeWidth="1.5" fill="none" />
            <path d="M11 7l-2-4M22.5 7V3M34 7l2-4" stroke={strokeColor} strokeWidth="1.5" fill="none" />
          </svg>
        );
      case "r":
        return (
          <svg viewBox="0 0 45 45" className="w-4/5 h-4/5" style={{ color: pieceColor }} aria-hidden="true">
            <path d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5" stroke={strokeColor} strokeWidth="1.5" fill={pieceColor} />
            <path d="M34 14l-3 22H14l-3-22" fill={pieceColor} stroke={strokeColor} strokeWidth="1.5" />
            <path d="M31 14v-3.5c0-1.5-1-2.5-2.5-2.5h-12c-1.5 0-2.5 1-2.5 2.5V14" fill={pieceColor} stroke={strokeColor} strokeWidth="1.5" />
          </svg>
        );
      case "b":
        return (
          <svg viewBox="0 0 45 45" className="w-4/5 h-4/5" style={{ color: pieceColor }} aria-hidden="true">
            <path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.35.49-2.32.47-3-.5 1.35-1.46 3-2 3-2z" fill={pieceColor} stroke={strokeColor} strokeWidth="1.5" />
            <path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z" fill={pieceColor} stroke={strokeColor} strokeWidth="1.5" />
            <path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z" fill={pieceColor} stroke={strokeColor} strokeWidth="1.5" />
          </svg>
        );
      case "n":
        return (
          <svg viewBox="0 0 45 45" className="w-4/5 h-4/5" style={{ color: pieceColor }} aria-hidden="true">
            <path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill={pieceColor} stroke={strokeColor} strokeWidth="1.5" />
            <path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3" fill={pieceColor} stroke={strokeColor} strokeWidth="1.5" />
            <circle cx="9.5" cy="25.5" r="0.5" fill={pieceColor} stroke={strokeColor} strokeWidth="1.5" />
          </svg>
        );
      case "p":
        return (
          <svg viewBox="0 0 45 45" className="w-4/5 h-4/5" style={{ color: pieceColor }} aria-hidden="true">
            <path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill={pieceColor} stroke={strokeColor} strokeWidth="1.5" />
          </svg>
        );
      default:
        return null;
    }
  };

  const pieceName = {
    k: "King",
    q: "Queen",
    r: "Rook",
    b: "Bishop",
    n: "Knight",
    p: "Pawn",
  }[type];

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`
        w-full h-full flex items-center justify-center
        cursor-grab active:cursor-grabbing
        transition-all duration-200 ease-out
        ${disabled ? "cursor-default" : "hover:scale-105"}
        ${isDragging ? "opacity-50 scale-110" : "opacity-100"}
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-blue)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-secondary)]
      `}
      style={style}
      role="img"
      aria-label={`${color === "w" ? "White" : "Black"} ${pieceName}`}
      tabIndex={disabled ? -1 : 0}
    >
      {getPieceSVG()}
    </div>
  );
}
