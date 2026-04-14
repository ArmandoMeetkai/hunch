"use client";

import { useAppStore } from "@/lib/stores/app-store";
import { useLivePrice } from "@/hooks/use-live-price";
import { EditorialOverline } from "@/components/ui/editorial-overline";
import { BentoTile } from "@/components/ui/bento-tile";
import { ConvictionCompass } from "@/components/conviction-compass";

export default function PortfolioPage() {
  const user = useAppStore((s) => s.user);
  const markets = useLivePrice();
  const stories = useAppStore((s) => s.stories);

  const positionsValue = user.positions.reduce((sum, p) => sum + p.currentValue, 0);
  const totalValue = user.practiceBalance + positionsValue;
  const positionCount = user.positions.length;

  return (
    <div className="mx-auto max-w-[960px] px-6 py-10">
      <div className="mb-10">
        <EditorialOverline>Your portfolio</EditorialOverline>
        <h1 className="mt-3 font-serif text-5xl leading-[1.05] tracking-[-0.015em] text-ink-primary">
          Your beliefs, <em className="italic">in one place.</em>
        </h1>
      </div>

      {/* Two-column layout: summary left, positions right */}
      <div className="mb-6 grid gap-4 md:grid-cols-[1fr_1fr]">
        {/* Left column: summary + compass + weekly */}
        <div className="flex flex-col gap-4">
          {/* Summary tile */}
          <div className="flex flex-col justify-between rounded-2xl border border-border-soft bg-bg-surface p-8" style={{ minHeight: "280px" }}>
            <EditorialOverline>Total value</EditorialOverline>
            <div>
              <p className="font-mono text-[56px] font-light leading-none tracking-[-0.03em] text-ink-primary">
                ${totalValue.toFixed(2)}
              </p>
              {(() => {
                const pnl = totalValue - 10;
                const isUp = pnl >= 0;
                return (
                  <p className={`mt-2 text-[13px] ${isUp ? "text-accent-signal" : "text-accent-cool"}`}>
                    {isUp ? "↗" : "↘"} {isUp ? "+" : ""}${pnl.toFixed(2)} from practice
                  </p>
                );
              })()}
            </div>
            <EditorialOverline>
              {positionCount} active positions · {Math.round(user.accuracyRate * 100)}% right
            </EditorialOverline>
          </div>

          {/* Compass */}
          <BentoTile className="min-h-[160px]">
            <EditorialOverline>Conviction compass</EditorialOverline>
            <ConvictionCompass />
          </BentoTile>

          {/* Weekly */}
          <BentoTile className="min-h-[140px]">
            <EditorialOverline>This week&apos;s conviction</EditorialOverline>
            <div className="flex items-baseline gap-3 mt-2">
              <span className="font-mono text-[40px] font-light leading-none text-ink-primary">
                {positionCount}
              </span>
              <span className="font-serif text-[22px] italic text-ink-primary">
                hunches backed
              </span>
            </div>
            <EditorialOverline>Avg confidence: 67%</EditorialOverline>
          </BentoTile>
        </div>

        {/* Right column: positions only */}
        <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto md:max-h-none scrollbar-thin">
          {user.positions.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-border-soft bg-bg-surface py-12 text-center">
              <p className="font-serif text-lg italic text-ink-tertiary">No active positions.</p>
              <p className="mt-2 text-[13px] text-ink-tertiary">Back a hunch from the feed to get started.</p>
            </div>
          )}
          {user.positions.map((pos) => {
            const market = markets.find((m) => m.id === pos.marketId);
            if (!market) return null;

            const story = stories.find((s) => s.marketId === pos.marketId);
            const topicLabel = story
              ? story.topic.charAt(0).toUpperCase() + story.topic.slice(1)
              : "";

            const pnl = pos.currentValue - pos.amount;
            const pnlColor = pnl >= 0 ? "text-accent-signal" : "text-accent-cool";
            const pnlStr = pnl >= 0 ? `+$${pnl.toFixed(2)}` : `−$${Math.abs(pnl).toFixed(2)}`;

            return (
              <div
                key={`${pos.marketId}-${pos.takenAt}`}
                className="flex flex-col justify-between gap-2 rounded-2xl border border-border-soft bg-bg-surface p-4 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-8px_rgba(28,26,23,0.08)] md:p-5"
              >
                <EditorialOverline>{topicLabel}</EditorialOverline>
                <div>
                  <p className="font-serif text-lg leading-[1.2] text-ink-primary line-clamp-2">
                    {market.question}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`rounded px-2 py-0.5 font-mono text-[11px] uppercase tracking-[0.08em] ${
                        pos.side === "yes"
                          ? "bg-bg-sunken text-accent-signal"
                          : "bg-bg-sunken text-accent-cool"
                      }`}
                    >
                      {pos.side} · ${pos.amount}
                    </span>
                    {pos.paidWith !== "dollars" && (
                      <span className="rounded px-1.5 py-0.5 bg-accent-highlight/40 font-mono text-[10px] uppercase tracking-[0.08em] text-accent-ink">
                        {pos.paidWith === "btc" ? "₿" : "Ξ"} {pos.paidWith.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <span className={`font-mono text-sm ${pnlColor}`}>
                    {pnlStr}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
