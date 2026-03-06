import { ChessBoard } from "@/components/ChessBoard";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] flex flex-col">
      {/* Header */}
      <header className="bg-[var(--color-bg-secondary)] border-b border-[var(--color-border-default)] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 
            className="text-2xl font-bold text-[var(--color-text-primary)] flex items-center gap-2"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            <span className="w-8 h-8 bg-gradient-to-br from-[var(--color-accent-blue)] to-[var(--color-accent-purple)] rounded-md flex items-center justify-center text-lg">
              ♟
            </span>
            Chess AI
          </h1>
        </div>
        <div 
          className="px-3 py-1.5 bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)] rounded-md text-xs font-medium uppercase tracking-wider"
          style={{ 
            background: "rgba(88, 166, 255, 0.15)",
            borderColor: "var(--color-accent-blue)",
            color: "var(--color-accent-blue)"
          }}
        >
          Your Turn
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-xl p-6 md:p-8 shadow-lg">
          <ChessBoard />
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 text-center text-sm text-[var(--color-text-muted)] border-t border-[var(--color-border-default)]">
        Next.js 15 + Tailwind CSS + shadcn/ui • Powered by Stockfish
      </footer>
    </div>
  );
}
