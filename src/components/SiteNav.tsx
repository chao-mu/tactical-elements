"use client";

// React
import React from "react";

// Ours
import { LinkButton } from "@/components/LinkButton";
import { games } from "@/games";

function getGameCards() {
  return Object.entries(games).map(
    ([
      gameId,
      {
        flavor: { title },
      },
    ]) => ({
      gameId,
      href: `/games/${gameId}/start`,
      title: title,
    }),
  );
}

export function SiteNav() {
  return (
    <nav className="flex flex-col gap-2">
      {getGameCards().map(({ title, href, gameId }) => (
        <LinkButton key={gameId} href={href}>
          {title}
        </LinkButton>
      ))}
      <div className="min-h-0 border-b-2 border-amber-300"></div>
      <LinkButton href="https://www.patreon.com/user?u=84821837">
        Help Cover Costs
      </LinkButton>
    </nav>
  );
}
