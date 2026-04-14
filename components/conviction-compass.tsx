"use client";

import { useAppStore } from "@/lib/stores/app-store";
import type { Topic } from "@/types";

const TOPIC_COLORS: Record<string, string> = {
  politics: "var(--color-accent-signal)",
  tech: "var(--color-accent-ink)",
  climate: "var(--color-accent-cool)",
  culture: "var(--color-accent-highlight)",
  economy: "var(--color-accent-signal)",
  sports: "var(--color-accent-ink)",
  science: "var(--color-accent-cool)",
  entertainment: "var(--color-accent-highlight)",
  world: "var(--color-accent-ink)",
};

const TOPIC_OPACITY: Record<string, number> = {
  politics: 0.7,
  tech: 0.8,
  climate: 0.7,
  culture: 0.9,
  economy: 0.6,
  sports: 0.8,
  science: 0.7,
  entertainment: 0.9,
  world: 0.6,
};

export function ConvictionCompass() {
  const positions = useAppStore((s) => s.user.positions);
  const resolvedPositions = useAppStore((s) => s.user.resolvedPositions);
  const stories = useAppStore((s) => s.stories);
  const markets = useAppStore((s) => s.markets);

  // Count positions by topic
  const allPositions = [...positions, ...resolvedPositions];
  const topicCounts: Record<string, number> = {};

  // O(1) lookups instead of O(n) find() per position
  const marketMap = new Map(markets.map((m) => [m.id, m]));
  const storyByMarketMap = new Map(stories.map((s) => [s.marketId, s]));

  for (const pos of allPositions) {
    const market = marketMap.get(pos.marketId);
    const story = market ? storyByMarketMap.get(market.id) : null;
    const topic = story?.topic ?? "economy";
    topicCounts[topic] = (topicCounts[topic] ?? 0) + pos.amount;
  }

  const topics = Object.entries(topicCounts).sort((a, b) => b[1] - a[1]);
  const total = topics.reduce((sum, [, count]) => sum + count, 0);

  const cx = 100;
  const cy = 95;
  const r = 80;

  function polarToCart(angle: number, radius: number) {
    const rad = Math.PI * (1 - angle);
    return {
      x: cx + radius * Math.cos(rad),
      y: cy - radius * Math.sin(rad),
    };
  }

  // Build sectors from real data
  let currentAngle = 0;
  const sectors = topics.map(([topic, count]) => {
    const span = total > 0 ? count / total : 0;
    const start = currentAngle;
    const end = currentAngle + span;
    currentAngle = end;
    return {
      topic,
      startAngle: start,
      endAngle: end,
      fill: TOPIC_COLORS[topic] ?? "var(--color-border-firm)",
      opacity: TOPIC_OPACITY[topic] ?? 0.7,
    };
  });

  // Empty state
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
    <div className="flex flex-1 flex-col items-center justify-center gap-2">
      <svg viewBox="10 0 180 100" className="w-full max-w-[240px]">
        {/* Grid arcs */}
        {[80, 53, 26].map((rad) => (
          <path
            key={rad}
            d={`M ${cx - rad},${cy} A ${rad},${rad} 0 0,1 ${cx + rad},${cy}`}
            fill="none"
            stroke="var(--color-border-soft)"
            strokeWidth="0.8"
          />
        ))}

        {/* Dynamic sectors */}
        {sectors.map((s, i) => {
          const p1 = polarToCart(s.startAngle, r);
          const p2 = polarToCart(s.endAngle, r);
          const largeArc = s.endAngle - s.startAngle > 0.5 ? 1 : 0;
          return (
            <path
              key={i}
              d={`M ${cx},${cy} L ${p1.x},${p1.y} A ${r},${r} 0 ${largeArc},0 ${p2.x},${p2.y} Z`}
              fill={s.fill}
              opacity={s.opacity}
            />
          );
        })}

        {/* Baseline */}
        <line x1={cx - r - 5} y1={cy} x2={cx + r + 5} y2={cy} stroke="var(--color-border-soft)" strokeWidth="0.8" />
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
        {sectors.map((s) => (
          <div key={s.topic} className="flex items-center gap-1.5">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: s.fill, opacity: s.opacity }}
            />
            <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-ink-tertiary">
              {s.topic}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
