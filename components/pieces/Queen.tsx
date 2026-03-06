"use client";

import React from "react";

interface PieceProps {
  className?: string;
}

export function WhiteQueen({ className = "" }: PieceProps) {
  return (
    <svg
      viewBox="0 0 45 45"
      className={className}
      fill="currentColor"
      aria-label="White Queen"
    >
      <g>
        <path
          d="M8 12l5.5 5.5L8 23l5.5 5.5L8 34l14.5-6L37 34l-5.5-5.5L37 23l-5.5-5.5L37 12 22.5 18 8 12z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 12l3-5h24l3 5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11 7l-2-4M22.5 7V3M34 7l2-4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-4s9-4.5 6-10.5c-4-1-7 2.5-7 2.5V23h-20v1.5s-3-3.5-7-2.5c-3 6 6 10.5 6 10.5v4"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11.5 33c5.5-3 15.5-3 21 0"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
      </g>
    </svg>
  );
}

export function BlackQueen({ className = "" }: PieceProps) {
  return (
    <svg
      viewBox="0 0 45 45"
      className={className}
      fill="currentColor"
      aria-label="Black Queen"
    >
      <g>
        <path
          d="M8 12l5.5 5.5L8 23l5.5 5.5L8 34l14.5-6L37 34l-5.5-5.5L37 23l-5.5-5.5L37 12 22.5 18 8 12z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 12l3-5h24l3 5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11 7l-2-4M22.5 7V3M34 7l2-4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-4s9-4.5 6-10.5c-4-1-7 2.5-7 2.5V23h-20v1.5s-3-3.5-7-2.5c-3 6 6 10.5 6 10.5v4"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="22.5" cy="20" r="2.5" fill="currentColor" opacity="0.3" />
      </g>
    </svg>
  );
}
