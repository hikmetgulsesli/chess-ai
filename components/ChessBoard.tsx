"use client";

import React, { useState, useCallback } from "react";

// Chess pieces using Unicode symbols
const PIECES = {
  white: {
    king: "♔",
    queen: "♕",
    rook: "♖",
    bishop: "♗",
    knight: "♘",
    pawn: "♙",
  },
  black: {
    king: "♚",
    queen: "♛",
    rook: "♜",
    bishop: "♝",
    knight: "♞",
    pawn: "♟",
  },
};

// Initial board setup (0,0 is a8, 7,7 is h1)
const INITIAL_BOARD: (string | null)[][] = [
  [PIECES.black.rook, PIECES.black.knight, PIECES.black.bishop, PIECES.black.queen, PIECES.black.king, PIECES.black.bishop, PIECES.black.knight, PIECES.black.rook],
  [PIECES.black.pawn, PIECES.black.pawn, PIECES.black.pawn, PIECES.black.pawn, PIECES.black.pawn, PIECES.black.pawn, PIECES.black.pawn, PIECES.black.pawn],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [PIECES.white.pawn, PIECES.white.pawn, PIECES.white.pawn, PIECES.white.pawn, PIECES.white.pawn, PIECES.white.pawn, PIECES.white.pawn, PIECES.white.pawn],
  [PIECES.white.rook, PIECES.white.knight, PIECES.white.bishop, PIECES.white.queen, PIECES.white.king, PIECES.white.bishop, PIECES.white.knight, PIECES.white.rook],
];

interface ChessBoardProps {
  className?: string;
}

export function ChessBoard({ className = "" }: ChessBoardProps) {
  const [board] = useState<(string | null)[][]>(INITIAL_BOARD);
  const [selectedSquare, setSelectedSquare] = useState<{ row: number; col: number } | null>(null);

  const handleSquareClick = useCallback((row: number, col: number) => {
    if (selectedSquare?.row === row && selectedSquare?.col === col) {
      setSelectedSquare(null);
    } else {
      setSelectedSquare({ row, col });
    }
  }, [selectedSquare]);

  const isLightSquare = (row: number, col: number): boolean => {
    return (row + col) % 2 === 0;
  };

  const isSelected = (row: number, col: number): boolean => {
    return selectedSquare?.row === row && selectedSquare?.col === col;
  };

  return (
    <div className={`w-full max-w-[560px] ${className}`}>
      <div 
        className="grid grid-cols-8 border-4 border-[var(--color-border-default)] rounded"
        style={{ aspectRatio: "1" }}
      >
        {board.map((row, rowIndex) =>
          row.map((piece, colIndex) => {
            const light = isLightSquare(rowIndex, colIndex);
            const selected = isSelected(rowIndex, colIndex);
            
            return (
              <button
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleSquareClick(rowIndex, colIndex)}
                className={`
                  chess-square
                  ${light ? "light" : "dark"}
                  ${selected ? "selected" : ""}
                `}
                aria-label={`Square ${String.fromCharCode(97 + colIndex)}${8 - rowIndex}`}
              >
                {piece && (
                  <span 
                    className="text-3xl md:text-4xl lg:text-5xl select-none"
                    style={{
                      color: piece === piece.toUpperCase() 
                        ? "var(--chess-white-piece)" 
                        : "var(--chess-black-piece)",
                      textShadow: piece === piece.toUpperCase()
                        ? "0 1px 2px rgba(0,0,0,0.3)"
                        : "0 1px 2px rgba(255,255,255,0.2)",
                    }}
                  >
                    {piece}
                  </span>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
