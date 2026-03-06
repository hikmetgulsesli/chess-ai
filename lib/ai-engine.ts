// AI Engine for Chess Game using chess.js
// Implements minimax algorithm with alpha-beta pruning

import { Chess } from "chess.js";

export type Difficulty = "easy" | "medium" | "hard";
export type GameMode = "pvp" | "pva";

// Piece values for evaluation
const PIECE_VALUES: Record<string, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000,
};

// Position bonus tables (from white's perspective, flip for black)
const PAWN_TABLE = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [50, 50, 50, 50, 50, 50, 50, 50],
  [10, 10, 20, 30, 30, 20, 10, 10],
  [5, 5, 10, 25, 25, 10, 5, 5],
  [0, 0, 0, 20, 20, 0, 0, 0],
  [5, -5, -10, 0, 0, -10, -5, 5],
  [5, 10, 10, -20, -20, 10, 10, 5],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

const KNIGHT_TABLE = [
  [-50, -40, -30, -30, -30, -30, -40, -50],
  [-40, -20, 0, 0, 0, 0, -20, -40],
  [-30, 0, 10, 15, 15, 10, 0, -30],
  [-30, 5, 15, 20, 20, 15, 5, -30],
  [-30, 0, 15, 20, 20, 15, 0, -30],
  [-30, 5, 10, 15, 15, 10, 5, -30],
  [-40, -20, 0, 5, 5, 0, -20, -40],
  [-50, -40, -30, -30, -30, -30, -40, -50],
];

const BISHOP_TABLE = [
  [-20, -10, -10, -10, -10, -10, -10, -20],
  [-10, 0, 0, 0, 0, 0, 0, -10],
  [-10, 0, 5, 10, 10, 5, 0, -10],
  [-10, 5, 5, 10, 10, 5, 5, -10],
  [-10, 0, 10, 10, 10, 10, 0, -10],
  [-10, 10, 10, 10, 10, 10, 10, -10],
  [-10, 5, 0, 0, 0, 0, 5, -10],
  [-20, -10, -10, -10, -10, -10, -10, -20],
];

const ROOK_TABLE = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [5, 10, 10, 10, 10, 10, 10, 5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [0, 0, 0, 5, 5, 0, 0, 0],
];

const QUEEN_TABLE = [
  [-20, -10, -10, -5, -5, -10, -10, -20],
  [-10, 0, 0, 0, 0, 0, 0, -10],
  [-10, 0, 5, 5, 5, 5, 0, -10],
  [-5, 0, 5, 5, 5, 5, 0, -5],
  [0, 0, 5, 5, 5, 5, 0, -5],
  [-10, 5, 5, 5, 5, 5, 0, -10],
  [-10, 0, 5, 0, 0, 0, 0, -10],
  [-20, -10, -10, -5, -5, -10, -10, -20],
];

const KING_MIDDLE_GAME = [
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-20, -30, -30, -40, -40, -30, -30, -20],
  [-10, -20, -20, -20, -20, -20, -20, -10],
  [20, 20, 0, 0, 0, 0, 20, 20],
  [20, 30, 10, 0, 0, 10, 30, 20],
];

// Get search depth based on difficulty
export function getSearchDepth(difficulty: Difficulty): number {
  switch (difficulty) {
    case "easy":
      return 2;
    case "medium":
      return 3;
    case "hard":
      return 4;
    default:
      return 3;
  }
}

// Get position table for a piece type
function getPositionTable(pieceType: string): number[][] {
  switch (pieceType) {
    case "p": return PAWN_TABLE;
    case "n": return KNIGHT_TABLE;
    case "b": return BISHOP_TABLE;
    case "r": return ROOK_TABLE;
    case "q": return QUEEN_TABLE;
    case "k": return KING_MIDDLE_GAME;
    default: return Array(8).fill(Array(8).fill(0));
  }
}

// Evaluate a single piece
function evaluatePiece(piece: { type: string; color: "w" | "b" }, row: number, col: number): number {
  const baseValue = PIECE_VALUES[piece.type] || 0;
  const positionTable = getPositionTable(piece.type);
  
  // For white, use table as-is. For black, flip vertically
  const positionRow = piece.color === "w" ? row : 7 - row;
  const positionBonus = positionTable[positionRow][col];
  
  const value = baseValue + positionBonus;
  return piece.color === "w" ? value : -value;
}

// Evaluate the board position
// Positive = white advantage, Negative = black advantage
export function evaluateBoard(chess: Chess): number {
  // Check for game-ending positions
  if (chess.isCheckmate()) {
    return chess.turn() === "w" ? -100000 : 100000;
  }
  if (chess.isStalemate() || chess.isDraw()) {
    return 0;
  }
  
  let score = 0;
  const board = chess.board();
  
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece) {
        score += evaluatePiece(piece, row, col);
      }
    }
  }
  
  // Bonus for being in check (discourages moves into check)
  if (chess.isCheck()) {
    score += chess.turn() === "w" ? -50 : 50;
  }
  
  return score;
}

// Get all valid moves for the current position
function getAllMoves(chess: Chess): { from: string; to: string; promotion?: string }[] {
  const moves = chess.moves({ verbose: true });
  return moves.map((m) => ({
    from: m.from,
    to: m.to,
    promotion: m.promotion,
  }));
}

// Minimax algorithm with alpha-beta pruning
export function minimax(
  chess: Chess,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean
): { score: number; move?: { from: string; to: string; promotion?: string } } {
  // Base case: leaf node or game over
  if (depth === 0 || chess.isGameOver()) {
    return { score: evaluateBoard(chess) };
  }
  
  const moves = getAllMoves(chess);
  
  // No valid moves - stalemate or checkmate
  if (moves.length === 0) {
    return { score: evaluateBoard(chess) };
  }
  
  // Shuffle moves slightly for variety
  const shuffledMoves = [...moves].sort(() => Math.random() - 0.5);
  
  let bestMove = shuffledMoves[0];
  
  if (isMaximizing) {
    let maxEval = -Infinity;
    
    for (const move of shuffledMoves) {
      const chessCopy = new Chess(chess.fen());
      chessCopy.move(move);
      const eval_ = minimax(chessCopy, depth - 1, alpha, beta, false).score;
      
      if (eval_ > maxEval) {
        maxEval = eval_;
        bestMove = move;
      }
      
      alpha = Math.max(alpha, eval_);
      if (beta <= alpha) break; // Alpha-beta pruning
    }
    
    return { score: maxEval, move: bestMove };
  } else {
    let minEval = Infinity;
    
    for (const move of shuffledMoves) {
      const chessCopy = new Chess(chess.fen());
      chessCopy.move(move);
      const eval_ = minimax(chessCopy, depth - 1, alpha, beta, true).score;
      
      if (eval_ < minEval) {
        minEval = eval_;
        bestMove = move;
      }
      
      beta = Math.min(beta, eval_);
      if (beta <= alpha) break; // Alpha-beta pruning
    }
    
    return { score: minEval, move: bestMove };
  }
}

// Get the best move for the AI
export function getBestMove(
  chess: Chess,
  difficulty: Difficulty
): { from: string; to: string; promotion?: string } | null {
  const depth = getSearchDepth(difficulty);
  const isMaximizing = chess.turn() === "w";
  const result = minimax(chess, depth, -Infinity, Infinity, isMaximizing);
  return result.move || null;
}
