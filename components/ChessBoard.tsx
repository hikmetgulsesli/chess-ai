"use client";

import React, { useCallback, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  useSensors,
  useSensor,
  PointerSensor,
  TouchSensor,
} from "@dnd-kit/core";
import { useGameState } from "@/lib/game-state";
import { ChessPiece } from "./ChessPiece";

function toAlgebraic(row: number, col: number): string {
  const file = String.fromCharCode(97 + col);
  const rank = 8 - row;
  return `${file}${rank}`;
}

function fromAlgebraic(square: string): { row: number; col: number } {
  const col = square.charCodeAt(0) - 97;
  const row = 8 - parseInt(square[1]);
  return { row, col };
}

interface ChessBoardProps {
  className?: string;
}

interface ActivePiece {
  square: string;
  type: string;
  color: "w" | "b";
}

export function ChessBoard({ className = "" }: ChessBoardProps) {
  const {
    board,
    turn,
    validMoves,
    selectedSquare,
    selectSquare,
    makeMove,
    isCheck,
    isGameOver,
  } = useGameState();

  const [activePiece, setActivePiece] = useState<ActivePiece | null>(null);
  const [illegalMoveTarget, setIllegalMoveTarget] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    })
  );

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      // Disable interactions when game is over
      if (isGameOver) return;
      
      const square = event.active.id.toString().replace("piece-", "");
      const { row, col } = fromAlgebraic(square);
      const piece = board[row]?.[col];

      if (piece && piece.color === turn) {
        setActivePiece({ square, type: piece.type, color: piece.color });
        selectSquare(square);
      }
    },
    [board, turn, selectSquare, isGameOver]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActivePiece(null);

      // Disable interactions when game is over
      if (isGameOver) {
        selectSquare(null);
        return;
      }

      if (!over) {
        selectSquare(null);
        return;
      }

      const sourceSquare = active.id.toString().replace("piece-", "");
      const targetSquare = over.id.toString().replace("square-", "");

      if (sourceSquare === targetSquare) {
        return;
      }

      const success = makeMove(sourceSquare, targetSquare);

      if (!success) {
        setIllegalMoveTarget(targetSquare);
        setTimeout(() => setIllegalMoveTarget(null), 300);
      }
    },
    [makeMove, selectSquare, isGameOver]
  );

  const handleSquareClick = useCallback(
    (row: number, col: number) => {
      // Disable interactions when game is over
      if (isGameOver) return;
      
      const square = toAlgebraic(row, col);
      selectSquare(square);
    },
    [selectSquare, isGameOver]
  );

  const isLightSquare = (row: number, col: number): boolean => (row + col) % 2 === 0;
  const isSelected = (row: number, col: number): boolean => selectedSquare === toAlgebraic(row, col);
  const isValidMoveTarget = (row: number, col: number): boolean => validMoves.includes(toAlgebraic(row, col));
  const isIllegalMove = (row: number, col: number): boolean => illegalMoveTarget === toAlgebraic(row, col);

  const getKingSquare = (): string | null => {
    if (!isCheck) return null;
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row]?.[col];
        if (piece && piece.type === "k" && piece.color === turn) {
          return toAlgebraic(row, col);
        }
      }
    }
    return null;
  };

  const kingSquare = getKingSquare();

  return (
    <div className={`w-full max-w-[560px] ${className}`}>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div
          className="grid grid-cols-8 border-4 border-[var(--color-border-default)] rounded overflow-hidden"
          style={{ aspectRatio: "1" }}
        >
          {board.map((row, rowIndex) =>
            row.map((piece, colIndex) => {
              const light = isLightSquare(rowIndex, colIndex);
              const selected = isSelected(rowIndex, colIndex);
              const validMove = isValidMoveTarget(rowIndex, colIndex);
              const illegalMove = isIllegalMove(rowIndex, colIndex);
              const square = toAlgebraic(rowIndex, colIndex);
              const isKingInCheck = kingSquare === square;

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  id={`square-${square}`}
                  onClick={() => handleSquareClick(rowIndex, colIndex)}
                  className={`
                    relative flex items-center justify-center
                    transition-all duration-150
                    ${light ? "bg-[var(--chess-white-square)]" : "bg-[var(--chess-black-square)]"}
                    ${selected ? "ring-2 ring-[var(--color-accent-blue)] ring-inset z-10" : ""}
                    ${isKingInCheck ? "ring-4 ring-[var(--color-accent-red)] ring-inset animate-pulse" : ""}
                    ${illegalMove ? "bg-red-400/50" : !isGameOver ? "hover:brightness-105 cursor-pointer" : "cursor-default"}
                    ${isGameOver ? "opacity-90" : ""}
                  `}
                  role={isGameOver ? "presentation" : "button"}
                  tabIndex={isGameOver ? -1 : 0}
                  aria-label={`Square ${square}${piece ? `, ${piece.color === "w" ? "white" : "black"} ${piece.type}` : ""}${isKingInCheck ? ", in check" : ""}`}
                  onKeyDown={(e) => {
                    if (!isGameOver && (e.key === "Enter" || e.key === " ")) {
                      handleSquareClick(rowIndex, colIndex);
                    }
                  }}
                >
                  {validMove && !piece && (
                    <div className="absolute w-1/4 h-1/4 rounded-full bg-[var(--color-accent-blue)]/50" />
                  )}
                  {validMove && piece && (
                    <div className="absolute inset-0 border-4 border-[var(--color-accent-blue)]/50 rounded-full" />
                  )}
                  {piece && (
                    <ChessPiece
                      type={piece.type}
                      color={piece.color}
                      square={square}
                      disabled={piece.color !== turn || isGameOver}
                    />
                  )}
                </div>
              );
            })
          )}
        </div>

        <DragOverlay dropAnimation={null}>
          {activePiece ? (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{
                transform: "scale(1.15)",
                filter: "drop-shadow(0 10px 20px rgba(0, 0, 0, 0.5))",
              }}
            >
              <PieceSVG type={activePiece.type} color={activePiece.color} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

function PieceSVG({ type, color }: { type: string; color: "w" | "b" }) {
  const pieceColor = color === "w" ? "var(--chess-white-piece)" : "var(--chess-black-piece)";
  const strokeColor = color === "w" ? "#000" : "#fff";
  const pieceClassName = "w-4/5 h-4/5";

  switch (type) {
    case "k":
      return (
        <svg viewBox="0 0 45 45" className={pieceClassName} style={{ color: pieceColor }}>
          <path d="M22.5 11.63V6M20 8h5" stroke={strokeColor} strokeWidth="1.5" fill="none" />
          <path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill={pieceColor} stroke={strokeColor} strokeWidth="1.5" />
          <path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-1-7 2.5-7 2.5V14h-14v7.5s-3-3.5-7-2.5c-3 6 6 10.5 6 10.5v7" fill={pieceColor} stroke={strokeColor} strokeWidth="1.5" />
        </svg>
      );
    case "q":
      return (
        <svg viewBox="0 0 45 45" className={pieceClassName} style={{ color: pieceColor }}>
          <path d="M8 12l5.5 5.5L8 23l5.5 5.5L8 34l14.5-6L37 34l-5.5-5.5L37 23l-5.5-5.5L37 12 22.5 18 8 12z" fill={pieceColor} stroke={strokeColor} strokeWidth="1.5" />
          <path d="M8 12l3-5h24l3 5" stroke={strokeColor} strokeWidth="1.5" fill="none" />
          <path d="M11 7l-2-4M22.5 7V3M34 7l2-4" stroke={strokeColor} strokeWidth="1.5" fill="none" />
        </svg>
      );
    case "r":
      return (
        <svg viewBox="0 0 45 45" className={pieceClassName} style={{ color: pieceColor }}>
          <path d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5" stroke={strokeColor} strokeWidth="1.5" fill={pieceColor} />
          <path d="M34 14l-3 22H14l-3-22" fill={pieceColor} stroke={strokeColor} strokeWidth="1.5" />
          <path d="M31 14v-3.5c0-1.5-1-2.5-2.5-2.5h-12c-1.5 0-2.5 1-2.5 2.5V14" fill={pieceColor} stroke={strokeColor} strokeWidth="1.5" />
        </svg>
      );
    case "b":
      return (
        <svg viewBox="0 0 45 45" className={pieceClassName} style={{ color: pieceColor }}>
          <path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.35.49-2.32.47-3-.5 1.35-1.46 3-2 3-2z" fill={pieceColor} stroke={strokeColor} strokeWidth="1.5" />
          <path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z" fill={pieceColor} stroke={strokeColor} strokeWidth="1.5" />
          <path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z" fill={pieceColor} stroke={strokeColor} strokeWidth="1.5" />
        </svg>
      );
    case "n":
      return (
        <svg viewBox="0 0 45 45" className={pieceClassName} style={{ color: pieceColor }}>
          <path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill={pieceColor} stroke={strokeColor} strokeWidth="1.5" />
          <path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3" fill={pieceColor} stroke={strokeColor} strokeWidth="1.5" />
          <circle cx="9.5" cy="25.5" r="0.5" fill={pieceColor} stroke={strokeColor} strokeWidth="1.5" />
        </svg>
      );
    case "p":
      return (
        <svg viewBox="0 0 45 45" className={pieceClassName} style={{ color: pieceColor }}>
          <path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill={pieceColor} stroke={strokeColor} strokeWidth="1.5" />
        </svg>
      );
    default:
      return null;
  }
}
