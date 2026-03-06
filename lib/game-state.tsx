"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { Chess, type Square } from "chess.js";

export type GameStatus = "playing" | "check" | "checkmate" | "stalemate" | "draw";

export interface Move {
  from: string;
  to: string;
  promotion?: string;
  san: string;
  flags?: string;
}

export interface PendingPromotion {
  from: string;
  to: string;
  color: "w" | "b";
}

export interface CastlingRights {
  whiteKingside: boolean;
  whiteQueenside: boolean;
  blackKingside: boolean;
  blackQueenside: boolean;
}

export interface GameState {
  // Chess.js instance (internal)
  chess: Chess;
  // Board state as 2D array for rendering (null = empty square)
  board: ({ type: string; color: "w" | "b" } | null)[][];
  // Current turn
  turn: "w" | "b";
  // Game status
  status: GameStatus;
  // Move history
  history: Move[];
  // Valid moves for currently selected square
  validMoves: string[];
  // Selected square (for click-to-move)
  selectedSquare: string | null;
  // Is white in check?
  isCheck: boolean;
  // Is checkmate?
  isCheckmate: boolean;
  // Is stalemate?
  isStalemate: boolean;
  // Is game over?
  isGameOver: boolean;
  // Pending promotion (when pawn reaches last rank)
  pendingPromotion: PendingPromotion | null;
  // En passant target square (if available)
  enPassantTarget: string | null;
  // Castling rights
  castlingRights: CastlingRights;
  // Special moves available from selected square
  specialMoves: {
    castling: { to: string; side: "kingside" | "queenside" }[];
    enPassant: { to: string; captureSquare: string }[];
  };
}

export interface GameActions {
  // Make a move (from algebraic notation like "e2e4" or "e2-e4" or {from, to})
  makeMove: (from: string, to: string, promotion?: string) => boolean;
  // Select a square (for click-to-move)
  selectSquare: (square: string | null) => void;
  // Get valid moves for a square
  getValidMoves: (square: string) => string[];
  // Undo last move
  undoMove: () => Move | null;
  // Reset game
  resetGame: () => void;
  // Load position from FEN
  loadFen: (fen: string) => boolean;
  // Get FEN of current position
  getFen: () => string;
  // Check if a move is legal
  isLegalMove: (from: string, to: string) => boolean;
  // Complete pending promotion with chosen piece
  completePromotion: (piece: "q" | "r" | "b" | "n") => boolean;
  // Cancel pending promotion
  cancelPromotion: () => void;
}

const GameStateContext = createContext<(GameState & GameActions) | null>(null);

export function useGameState() {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error("useGameState must be used within a GameStateProvider");
  }
  return context;
}

interface GameStateProviderProps {
  children: React.ReactNode;
  initialFen?: string;
}

export function GameStateProvider({ children, initialFen }: GameStateProviderProps) {
  // Initialize chess.js instance
  const [chess, setChess] = useState(() => new Chess(initialFen));
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [validMoves, setValidMoves] = useState<string[]>([]);
  const [pendingPromotion, setPendingPromotion] = useState<PendingPromotion | null>(null);

  // Get board state as 2D array
  const board = useMemo(() => {
    return chess.board();
  }, [chess]);

  // Get current turn
  const turn = chess.turn();

  // Get game status
  const status: GameStatus = useMemo(() => {
    if (chess.isCheckmate()) return "checkmate";
    if (chess.isStalemate()) return "stalemate";
    if (chess.isDraw()) return "draw";
    if (chess.isCheck()) return "check";
    return "playing";
  }, [chess]);

  // Get move history
  const history = useMemo(() => {
    const moves = chess.history({ verbose: true });
    return moves.map((move) => ({
      from: move.from,
      to: move.to,
      promotion: move.promotion,
      san: move.san,
      flags: move.flags,
    }));
  }, [chess]);

  // Get en passant target from FEN
  const enPassantTarget = useMemo(() => {
    const fen = chess.fen();
    const parts = fen.split(" ");
    const ep = parts[3];
    return ep !== "-" ? ep : null;
  }, [chess]);

  // Get castling rights from FEN
  const castlingRights: CastlingRights = useMemo(() => {
    const fen = chess.fen();
    const parts = fen.split(" ");
    const rights = parts[2];
    return {
      whiteKingside: rights.includes("K"),
      whiteQueenside: rights.includes("Q"),
      blackKingside: rights.includes("k"),
      blackQueenside: rights.includes("q"),
    };
  }, [chess]);

  // Check if a move is a pawn promotion
  const isPawnPromotion = useCallback((from: string, to: string): boolean => {
    const piece = chess.get(from as Square);
    if (!piece || piece.type !== "p") return false;
    
    const targetRank = to.charAt(1);
    // White pawn reaching rank 8 or black pawn reaching rank 1
    return (piece.color === "w" && targetRank === "8") || 
           (piece.color === "b" && targetRank === "1");
  }, [chess]);

  // Get special moves for a square
  const getSpecialMoves = useCallback((square: string | null) => {
    if (!square) {
      return { castling: [], enPassant: [] };
    }

    const piece = chess.get(square as Square);
    if (!piece) {
      return { castling: [], enPassant: [] };
    }

    const moves = chess.moves({ square: square as Square, verbose: true });
    const castling: { to: string; side: "kingside" | "queenside" }[] = [];
    const enPassant: { to: string; captureSquare: string }[] = [];

    for (const move of moves) {
      // Check for castling (flags contain 'k' for kingside or 'q' for queenside)
      if (move.flags.includes("k")) {
        castling.push({ to: move.to, side: "kingside" });
      } else if (move.flags.includes("q")) {
        castling.push({ to: move.to, side: "queenside" });
      }
      
      // Check for en passant (flags contain 'e')
      if (move.flags.includes("e")) {
        // The capture square is the square where the pawn being captured is
        const captureRank = move.color === "w" ? "5" : "4";
        const captureSquare = move.to.charAt(0) + captureRank;
        enPassant.push({ to: move.to, captureSquare });
      }
    }

    return { castling, enPassant };
  }, [chess]);

  // Get special moves for current selection
  const specialMoves = useMemo(() => {
    return getSpecialMoves(selectedSquare);
  }, [selectedSquare, getSpecialMoves]);

  // Get valid moves for a square
  const getValidMoves = useCallback(
    (square: string): string[] => {
      try {
        return chess.moves({ square: square as Square, verbose: true }).map((m) => m.to);
      } catch {
        return [];
      }
    },
    [chess]
  );

  // Make a move
  const makeMove = useCallback(
    (from: string, to: string, promotion?: string): boolean => {
      try {
        // Check if this is a pawn promotion move
        if (!promotion && isPawnPromotion(from, to)) {
          const piece = chess.get(from as Square);
          setPendingPromotion({
            from,
            to,
            color: piece!.color,
          });
          setSelectedSquare(null);
          setValidMoves([]);
          return true; // Return true to indicate the move is valid but needs promotion piece
        }

        const move = chess.move({ from, to, promotion: promotion || "q" });
        if (move) {
          // Create new Chess instance to trigger re-render
          setChess(new Chess(chess.fen()));
          setSelectedSquare(null);
          setValidMoves([]);
          setPendingPromotion(null);
          return true;
        }
        return false;
      } catch {
        return false;
      }
    },
    [chess, isPawnPromotion]
  );

  // Complete pending promotion
  const completePromotion = useCallback(
    (piece: "q" | "r" | "b" | "n"): boolean => {
      if (!pendingPromotion) return false;
      
      try {
        const move = chess.move({
          from: pendingPromotion.from,
          to: pendingPromotion.to,
          promotion: piece,
        });
        
        if (move) {
          setChess(new Chess(chess.fen()));
          setPendingPromotion(null);
          setSelectedSquare(null);
          setValidMoves([]);
          return true;
        }
        return false;
      } catch {
        return false;
      }
    },
    [chess, pendingPromotion]
  );

  // Cancel pending promotion
  const cancelPromotion = useCallback(() => {
    setPendingPromotion(null);
    setSelectedSquare(null);
    setValidMoves([]);
  }, []);

  // Select a square (for click-to-move)
  const selectSquare = useCallback(
    (square: string | null) => {
      if (square === null) {
        setSelectedSquare(null);
        setValidMoves([]);
        return;
      }

      // If we already have a selected square, try to make a move
      if (selectedSquare && selectedSquare !== square) {
        const success = makeMove(selectedSquare, square);
        if (success) {
          return;
        }
        // If move failed, check if clicking on own piece to change selection
        const piece = chess.get(square as Square);
        if (piece && piece.color === turn) {
          setSelectedSquare(square);
          setValidMoves(getValidMoves(square));
          return;
        }
        // Otherwise clear selection
        setSelectedSquare(null);
        setValidMoves([]);
        return;
      }

      // Select new square if it has a piece of current turn
      const piece = chess.get(square as Square);
      if (piece && piece.color === turn) {
        setSelectedSquare(square);
        setValidMoves(getValidMoves(square));
      } else {
        setSelectedSquare(null);
        setValidMoves([]);
      }
    },
    [chess, selectedSquare, turn, makeMove, getValidMoves]
  );

  // Check if a move is legal
  const isLegalMove = useCallback(
    (from: string, to: string): boolean => {
      try {
        const moves = chess.moves({ square: from as Square, verbose: true });
        return moves.some((m) => m.to === to);
      } catch {
        return false;
      }
    },
    [chess]
  );

  // Undo last move
  const undoMove = useCallback((): Move | null => {
    const undone = chess.undo();
    if (undone) {
      setChess(new Chess(chess.fen()));
      setSelectedSquare(null);
      setValidMoves([]);
      setPendingPromotion(null);
      return {
        from: undone.from,
        to: undone.to,
        promotion: undone.promotion,
        san: undone.san,
        flags: undone.flags,
      };
    }
    return null;
  }, [chess]);

  // Reset game
  const resetGame = useCallback(() => {
    setChess(new Chess());
    setSelectedSquare(null);
    setValidMoves([]);
    setPendingPromotion(null);
  }, []);

  // Load FEN
  const loadFen = useCallback((fen: string): boolean => {
    try {
      const newChess = new Chess(fen);
      setChess(newChess);
      setSelectedSquare(null);
      setValidMoves([]);
      setPendingPromotion(null);
      return true;
    } catch {
      return false;
    }
  }, []);

  // Get FEN
  const getFen = useCallback((): string => {
    return chess.fen();
  }, [chess]);

  const value: GameState & GameActions = {
    chess,
    board,
    turn,
    status,
    history,
    validMoves,
    selectedSquare,
    isCheck: chess.isCheck(),
    isCheckmate: chess.isCheckmate(),
    isStalemate: chess.isStalemate(),
    isGameOver: chess.isGameOver(),
    pendingPromotion,
    enPassantTarget,
    castlingRights,
    specialMoves,
    makeMove,
    selectSquare,
    getValidMoves,
    undoMove,
    resetGame,
    loadFen,
    getFen,
    isLegalMove,
    completePromotion,
    cancelPromotion,
  };

  return <GameStateContext.Provider value={value}>{children}</GameStateContext.Provider>;
}
