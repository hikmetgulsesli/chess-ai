"use client";

import React from "react";

interface PieceProps {
  className?: string;
}

export function WhiteRook({ className = "" }: PieceProps) {
  return (
    <svg
      viewBox="0 0 45 45"
      className={className}
      fill="currentColor"
      aria-label="White Rook"
    >
      <g>
        <path
          d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="currentColor"
        />
        <path
          d="M34 14l-3 22H14l-3-22"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M31 14v-3.5c0-1.5-1-2.5-2.5-2.5h-12c-1.5 0-2.5 1-2.5 2.5V14"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 26h21M12 22h21M12 18h21M12 30h21"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          fill="none"
          opacity="0.3"
        />
      </g>
    </svg>
  );
}

export function BlackRook({ className = "" }: PieceProps) {
  return (
    <svg
      viewBox="0 0 45 45"
      className={className}
      fill="currentColor"
      aria-label="Black Rook"
    >
      <g>
        <path
          d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="currentColor"
        />
        <path
          d="M34 14l-3 22H14l-3-22"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M31 14v-3.5c0-1.5-1-2.5-2.5-2.5h-12c-1.5 0-2.5 1-2.5 2.5V14"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect x="15" y="16" width="15" height="12" rx="1" fill="currentColor" opacity="0.2" />
      </g>
    </svg>
  );
}
