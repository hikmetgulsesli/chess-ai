import Link from "next/link";
import {
  WhiteKing,
  BlackKing,
  WhiteQueen,
  BlackQueen,
  WhiteRook,
  BlackRook,
  WhiteBishop,
  BlackBishop,
  WhiteKnight,
  BlackKnight,
  WhitePawn,
  BlackPawn,
} from "@/components/Piece";

export default function PiecesPage() {
  const pieces = [
    { name: "King", White: WhiteKing, Black: BlackKing },
    { name: "Queen", White: WhiteQueen, Black: BlackQueen },
    { name: "Rook", White: WhiteRook, Black: BlackRook },
    { name: "Bishop", White: WhiteBishop, Black: BlackBishop },
    { name: "Knight", White: WhiteKnight, Black: BlackKnight },
    { name: "Pawn", White: WhitePawn, Black: BlackPawn },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 
          className="text-4xl font-bold text-[var(--color-text-primary)] mb-8 text-center"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Chess Piece Components
        </h1>
        
        <p className="text-[var(--color-text-secondary)] text-center mb-12 max-w-2xl mx-auto">
          All 12 chess piece variations (6 types × 2 colors) rendered as SVG components 
          with currentColor for theming support. Hover over pieces to see the hover effect.
        </p>

        {/* Dark background showcase */}
        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-xl p-8 mb-8">
          <h2 
            className="text-2xl font-semibold text-[var(--color-text-primary)] mb-6"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            White Pieces (on dark board)
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
            {pieces.map(({ name, White }) => (
              <div 
                key={name} 
                className="flex flex-col items-center gap-3 p-4 bg-[var(--chess-black-square)] rounded-lg hover:bg-[#85a866] transition-colors"
              >
                <div className="w-16 h-16 text-[var(--chess-white-piece)] hover:scale-110 transition-transform cursor-pointer">
                  <White className="w-full h-full drop-shadow-md" />
                </div>
                <span className="text-sm text-[var(--color-text-primary)] font-medium">
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Light background showcase */}
        <div className="bg-[var(--chess-white-square)] border border-[var(--color-border-default)] rounded-xl p-8 mb-8">
          <h2 
            className="text-2xl font-semibold text-[var(--color-bg-primary)] mb-6"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Black Pieces (on light board)
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
            {pieces.map(({ name, Black }) => (
              <div 
                key={name} 
                className="flex flex-col items-center gap-3 p-4 bg-[var(--chess-white-square)] border-2 border-[var(--chess-black-square)] rounded-lg hover:border-[var(--color-accent-blue)] transition-colors"
              >
                <div className="w-16 h-16 text-[var(--chess-black-piece)] hover:scale-110 transition-transform cursor-pointer">
                  <Black className="w-full h-full drop-shadow-md" />
                </div>
                <span className="text-sm text-[var(--color-bg-primary)] font-medium">
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Drag and Drop Demo */}
        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-xl p-8">
          <h2 
            className="text-2xl font-semibold text-[var(--color-text-primary)] mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Drag & Drop Features
          </h2>
          <ul className="space-y-3 text-[var(--color-text-secondary)]">
            <li className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[var(--color-accent-green)]" />
              All pieces are draggable using @dnd-kit/core
            </li>
            <li className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[var(--color-accent-green)]" />
              Visual feedback during drag (opacity change, scale, shadow)
            </li>
            <li className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[var(--color-accent-green)]" />
              Hover states with cursor-pointer on all pieces
            </li>
            <li className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[var(--color-accent-green)]" />
              Keyboard navigation support (arrow keys)
            </li>
            <li className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[var(--color-accent-green)]" />
              Touch device support with proper activation constraints
            </li>
          </ul>
          
          <div className="mt-6 p-4 bg-[var(--color-bg-tertiary)] rounded-lg">
            <p className="text-[var(--color-text-accent)] text-sm">
              <strong>Try it:</strong> Visit the <Link href="/" className="underline hover:text-[var(--color-accent-purple)]">home page</Link> to play with the interactive chess board!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
