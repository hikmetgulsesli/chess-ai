"use client";

import React from "react";
import { useGameState } from "@/lib/game-state";
import { Volume2, VolumeX } from "lucide-react";

export function SoundSettings() {
  const { soundEnabled, toggleSound } = useGameState();

  return (
    <button
      onClick={toggleSound}
      className="flex items-center gap-2 px-3 py-2 rounded-md bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)] transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-[var(--color-accent-blue)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-secondary)]"
      aria-label={soundEnabled ? "Mute sound effects" : "Enable sound effects"}
      aria-pressed={soundEnabled}
      title={soundEnabled ? "Sound effects on" : "Sound effects off"}
    >
      {soundEnabled ? (
        <Volume2 className="w-4 h-4" aria-hidden="true" />
      ) : (
        <VolumeX className="w-4 h-4" aria-hidden="true" />
      )}
      <span className="text-sm font-medium">{soundEnabled ? "Sound On" : "Muted"}</span>
    </button>
  );
}
