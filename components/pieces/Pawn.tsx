"use client";

import React from "react";

interface PieceProps {
  className?: string;
}

export function WhitePawn({ className = "" }: PieceProps) {
  return (
    <svg
      viewBox="0 0 45 45"
      className={className}
      fill="currentColor"
      aria-label="White Pawn"
    >
      <g>
        <path
          d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="22.5" cy="15" r="2.5" fill="currentColor" opacity="0.3" />
      </g>
    </svg>
  );
}

export function BlackPawn({ className = "" }: PieceProps) {
  return (
    <svg
      viewBox="0 0 45 45"
      className={className}
      fill="currentColor"
      aria-label="Black Pawn"
    >
      <g>
        <path
          d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <ellipse cx="22.5" cy="15" rx="2" ry="3" fill="currentColor" opacity="0.3" />
      </g>
    </svg>
  );
}
