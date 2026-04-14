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
    <div className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-border-soft bg-bg-surface px-4 py-3 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-8px_rgba(28,26,23,0.08)] md:flex-row md:items-center md:gap-5 md:px-5 md:py-4">
      <p className="flex-1 text-[14px] font-medium leading-snug text-ink-primary line-clamp-2 md:text-[15px]">
        {market.question}
      </p>
      <div className="flex items-center gap-3 md:gap-4">
        <Sparkline
          data={market.history}
          width={60}
          height={20}
          color={sparklineColor}
          className="hidden sm:block md:block"
        />
        <ProbabilityNumber value={market.probabilityYes} size={24} className="md:text-[28px]" />
        <Link
          href={`/story/${storyId}`}
          className="whitespace-nowrap rounded-[var(--radius-pill)] border border-border-firm bg-bg-canvas px-3 py-1.5 text-[12px] font-medium text-ink-primary transition-colors hover:bg-bg-surface md:px-3.5 md:py-2 md:text-[13px]"
          aria-label={`Back this: ${market.question}`}
        >
          Back this →
        </Link>
      </div>
    </div>
  );
}
