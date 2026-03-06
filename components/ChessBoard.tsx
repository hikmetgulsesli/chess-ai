"use client";

import React, { useState, useCallback } from "react";
import { DndContext, DragEndEvent, DragStartEvent, DragOverlay, useSensors, useSensor, PointerSensor, TouchSensor, KeyboardSensor } from "@dnd-kit/core";
import { Piece, PieceType, PieceColor } from "./Piece";
import { WhiteKing, BlackKing, WhiteQueen, BlackQueen, WhiteRook, BlackRook, WhiteBishop, BlackBishop, WhiteKnight, BlackKnight, WhitePawn, BlackPawn } from "./pieces";

// Board position type
interface BoardPiece {
  type: PieceType;
  color: PieceColor;
}

// Initial board setup
const INITIAL_BOARD: (BoardPiece | null)[][] = [
  [
    { type: "rook", color: "black" },
    { type: "knight", color: "black" },
    { type: "bishop", color: "black" },
    { type: "queen", color: "black" },
    { type: "king", color: "black" },
    { type: "bishop", color: "black" },
    { type: "knight", color: "black" },
    { type: "rook", color: "black" },
  ],
  Array(8).fill(null).map(() => ({ type: "pawn", color: "black" })),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null).map(() => ({ type: "pawn", color: "white" })),
  [
    { type: "rook", color: "white" },
    { type: "knight", color: "white" },
    { type: "bishop", color: "white" },
    { type: "queen", color: "white" },
    { type: "king", color: "white" },
    { type: "bishop", color: "white" },
    { type: "knight", color: "white" },
    { type: "rook", color: "white" },
  ],
];

// Convert row/col to algebraic notation
function toAlgebraic(row: number, col: number): string {
  const file = String.fromCharCode(97 + col);
  const rank = 8 - row;
  return `${file}${rank}`;
}

interface ChessBoardProps {
  className?: string;
}

export function ChessBoard({ className = "" }: ChessBoardProps) {
  const [board, setBoard] = useState<(BoardPiece | null)[][]>(INITIAL_BOARD);
  const [selectedSquare, setSelectedSquare] = useState<{ row: number; col: number } | null>(null);
  const [activePiece, setActivePiece] = useState<BoardPiece | null>(null);

  // Configure sensors for drag detection
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Minimum distance before drag starts
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {})
  );

  // Helper function to move a piece on the board
  const movePiece = useCallback((from: { row: number; col: number }, to: { row: number; col: number }) => {
    setBoard(currentBoard => {
      const newBoard = currentBoard.map(row => [...row]);
      newBoard[to.row][to.col] = newBoard[from.row][from.col];
      newBoard[from.row][from.col] = null;
      return newBoard;
    });
  }, []);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const square = active.id.toString().replace("piece-", "");
    const col = square.charCodeAt(0) - 97;
    const row = 8 - parseInt(square[1]);
    const piece = board[row][col];
    if (piece) {
      setActivePiece(piece);
      setSelectedSquare({ row, col });
    }
  }, [board]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    setActivePiece(null);

    if (!over) {
      setSelectedSquare(null);
      return;
    }

    const sourceSquare = active.id.toString().replace("piece-", "");
    const targetSquare = over.id.toString().replace("square-", "");

    if (sourceSquare === targetSquare) {
      // Clicked on same square - toggle selection
      const col = sourceSquare.charCodeAt(0) - 97;
      const row = 8 - parseInt(sourceSquare[1]);
      if (selectedSquare?.row === row && selectedSquare?.col === col) {
        setSelectedSquare(null);
      }
      return;
    }

    // Move piece (basic implementation - no validation yet)
    const sourceCol = sourceSquare.charCodeAt(0) - 97;
    const sourceRow = 8 - parseInt(sourceSquare[1]);
    const targetCol = targetSquare.charCodeAt(0) - 97;
    const targetRow = 8 - parseInt(targetSquare[1]);

    movePiece({ row: sourceRow, col: sourceCol }, { row: targetRow, col: targetCol });
    setSelectedSquare(null);
  }, [selectedSquare, movePiece]);

  const handleSquareClick = useCallback((row: number, col: number) => {
    const piece = board[row][col];
    
    if (selectedSquare) {
      // If we have a selected piece and click another square, try to move
      if (selectedSquare.row !== row || selectedSquare.col !== col) {
        movePiece(selectedSquare, { row, col });
      }
      setSelectedSquare(null);
    } else if (piece) {
      // Select the piece
      setSelectedSquare({ row, col });
    }
  }, [board, selectedSquare, movePiece]);

  const isLightSquare = (row: number, col: number): boolean => {
    return (row + col) % 2 === 0;
  };

  const isSelected = (row: number, col: number): boolean => {
    return selectedSquare?.row === row && selectedSquare?.col === col;
  };

  return (
    <div className={`w-full max-w-[560px] ${className}`}>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div 
          className="grid grid-cols-8 border-4 border-[var(--color-border-default)] rounded"
          style={{ aspectRatio: "1" }}
        >
          {board.map((row, rowIndex) =>
            row.map((piece, colIndex) => {
              const light = isLightSquare(rowIndex, colIndex);
              const selected = isSelected(rowIndex, colIndex);
              const square = toAlgebraic(rowIndex, colIndex);
              
              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  id={`square-${square}`}
                  onClick={() => handleSquareClick(rowIndex, colIndex)}
                  className={`
                    chess-square relative
                    ${light ? "bg-[var(--chess-white-square)]" : "bg-[var(--chess-black-square)]"}
                    ${selected ? "ring-2 ring-[var(--color-accent-blue)] ring-inset" : ""}
                    flex items-center justify-center
                    cursor-pointer
                    hover:brightness-105
                    transition-all duration-150
                  `}
                  role="button"
                  tabIndex={0}
                  aria-label={`Square ${square}${piece ? `, ${piece.color} ${piece.type}` : ""}`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleSquareClick(rowIndex, colIndex);
                    }
                  }}
                >
                  {piece && (
                    <Piece
                      type={piece.type}
                      color={piece.color}
                      square={square}
                      disabled={false}
                    />
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Drag overlay for visual feedback */}
        <DragOverlay dropAnimation={null}>
          {activePiece ? (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{
                color: activePiece.color === "white" 
                  ? "var(--chess-white-piece)" 
                  : "var(--chess-black-piece)",
                transform: "scale(1.15)",
                filter: "drop-shadow(0 10px 20px rgba(0, 0, 0, 0.5))",
              }}
            >
              {/* Render the appropriate SVG piece using existing components */}
              <PieceSVGRenderer type={activePiece.type} color={activePiece.color} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

// Helper component to render the correct SVG based on type/color
// Uses the existing piece components to ensure consistency
function PieceSVGRenderer({ type, color }: { type: PieceType; color: PieceColor }) {
  const pieceClassName = "w-4/5 h-4/5";
  
  switch (type) {
    case "king":
      return color === "white" 
        ? <WhiteKing className={pieceClassName} />
        : <BlackKing className={pieceClassName} />;
    case "queen":
      return color === "white"
        ? <WhiteQueen className={pieceClassName} />
        : <BlackQueen className={pieceClassName} />;
    case "rook":
      return color === "white"
        ? <WhiteRook className={pieceClassName} />
        : <BlackRook className={pieceClassName} />;
    case "bishop":
      return color === "white"
        ? <WhiteBishop className={pieceClassName} />
        : <BlackBishop className={pieceClassName} />;
    case "knight":
      return color === "white"
        ? <WhiteKnight className={pieceClassName} />
        : <BlackKnight className={pieceClassName} />;
    case "pawn":
      return color === "white"
        ? <WhitePawn className={pieceClassName} />
        : <BlackPawn className={pieceClassName} />;
  }
}
