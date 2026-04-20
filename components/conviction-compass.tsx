"use client";

import { useAppStore } from "@/lib/stores/app-store";

export function ConvictionCompass() {
  const positions = useAppStore((s) => s.user.positions);
  const resolvedPositions = useAppStore((s) => s.user.resolvedPositions);
  const stories = useAppStore((s) => s.stories);
  const markets = useAppStore((s) => s.markets);

  const allPositions = [...positions, ...resolvedPositions];
  const topicTotals: Record<string, number> = {};

  const marketMap = new Map(markets.map((m) => [m.id, m]));
  const storyByMarketMap = new Map(stories.map((s) => [s.marketId, s]));

  for (const pos of allPositions) {
    const market = marketMap.get(pos.marketId);
    const story = market ? storyByMarketMap.get(market.id) : null;
    const topic = story?.topic ?? "economy";
    topicTotals[topic] = (topicTotals[topic] ?? 0) + pos.amount;
  }

  const topics = Object.entries(topicTotals).sort((a, b) => b[1] - a[1]);
  const maxValue = topics[0]?.[1] ?? 0;

  if (topics.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-[13px] italic text-ink-tertiary">
          Back some hunches to see your compass.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-3 flex flex-1 flex-col gap-2.5">
      {topics.map(([topic, value]) => {
        const widthPct = maxValue > 0 ? (value / maxValue) * 100 : 0;
        return (
          <div
            key={topic}
            className="grid grid-cols-[64px_1fr_auto] items-center gap-3"
          >
            <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-ink-tertiary">
              {topic}
            </span>
            <div className="h-[6px] rounded-full bg-bg-sunken">
              <div
                className="h-full rounded-full bg-accent-ink transition-[width] duration-300"
                style={{ width: `${widthPct}%` }}
              />
            </div>
            <span className="font-mono text-[12px] font-light tabular-nums text-ink-primary">
              ${value.toFixed(0)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
