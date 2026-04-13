"use client";

import Link from "next/link";
import type { Market } from "@/types";
import { ProbabilityNumber } from "./probability-number";
import { Sparkline } from "./sparkline";

type MarketStripProps = {
  market: Market;
  storyId: string;
};

export function MarketStrip({ market, storyId }: MarketStripProps) {
  const trendUp =
    market.history.length >= 2 &&
    market.history[market.history.length - 1].p > market.history[0].p;
  const sparklineColor = trendUp
    ? "var(--color-accent-signal)"
    : "var(--color-accent-cool)";

  return (
    <div className="flex items-center gap-5 rounded-[var(--radius-card)] border border-border-soft bg-bg-surface px-5 py-4 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-8px_rgba(28,26,23,0.08)]">
      <p className="flex-1 text-[15px] font-medium text-ink-primary">
        {market.question}
      </p>
      <div className="flex items-center gap-4">
        <Sparkline
          data={market.history}
          width={80}
          height={24}
          color={sparklineColor}
        />
        <ProbabilityNumber value={market.probabilityYes} size={28} />
        <Link
          href={`/story/${storyId}`}
          className="whitespace-nowrap rounded-[var(--radius-pill)] border border-border-firm bg-bg-canvas px-3.5 py-2 text-[13px] font-medium text-ink-primary transition-colors hover:bg-bg-surface"
          aria-label={`Back this: ${market.question}`}
        >
          Back this →
        </Link>
      </div>
    </div>
  );
}
