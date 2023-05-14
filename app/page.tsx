"use client";

// React
import React from 'react';

// NextJS
import Link from 'next/link';

// Components
import { NavSquare } from '../components/NavSquare';

export default function HomePage() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <h1 className="text-6xl font-bold font-header mb-6 mb-4">Tactical Elements</h1>
      <div className="flex flex-col gap-4">
        <Link href="/undefended">
          <NavSquare
            title="Undefended Pieces/Pawns"
            description="Click the undefended chessmen. Kings can't defend attacked pieces."
          />
        </Link>
        <Link href="/attackers">
          <NavSquare
            title="Attackers"
            description="Click the chessmen that attack a major or minor piece."
          />
        </Link>
        <Link href="/memorizer">
          <NavSquare
            title="Game Memorizer/Notation Trainer"
            description="Study and memorize chess games, specifying continuations in short algebraic notation"
          />
        </Link>
      </div>
    </div>
  )
}
