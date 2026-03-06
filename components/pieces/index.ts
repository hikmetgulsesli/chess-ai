"use client";

// Export all piece components from parent directory
export {
  Piece,
  type PieceType,
  type PieceColor,
} from "../Piece";

// Re-export PieceProps with alias
export type { PieceProps } from "../Piece";

// Export individual SVG pieces
export { WhiteKing, BlackKing } from "./King";
export { WhiteQueen, BlackQueen } from "./Queen";
export { WhiteRook, BlackRook } from "./Rook";
export { WhiteBishop, BlackBishop } from "./Bishop";
export { WhiteKnight, BlackKnight } from "./Knight";
export { WhitePawn, BlackPawn } from "./Pawn";
