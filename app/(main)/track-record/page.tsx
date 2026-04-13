"use client";

import { useAppStore } from "@/lib/stores/app-store";
import { resolvedMarketQuestions } from "@/lib/mock-data";
import { TrackRecordEntry } from "@/components/track-record-entry";
import { EditorialOverline } from "@/components/ui/editorial-overline";

export default function TrackRecordPage() {
  const user = useAppStore((s) => s.user);

  // Group resolved positions by month
  const grouped = user.resolvedPositions.reduce<
    Record<string, typeof user.resolvedPositions>
  >((acc, pos) => {
    const monthKey = new Date(pos.resolvedAt).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
    if (!acc[monthKey]) acc[monthKey] = [];
    acc[monthKey].push(pos);
    return acc;
  }, {});

  const months = Object.entries(grouped).sort(
    ([a], [b]) => new Date(b).getTime() - new Date(a).getTime(),
  );

  return (
    <div className="mx-auto max-w-[680px] px-6 py-10">
      {/* Hero stat */}
      <div className="mb-10 border-b border-border-soft pb-10 pt-14 text-center">
        <EditorialOverline>Since you started</EditorialOverline>
        <h1 className="mt-4 font-serif text-5xl leading-none tracking-[-0.02em] text-ink-primary md:text-7xl">
          You&apos;ve been right
          <br />
          <span className="font-mono text-accent-signal">
            {Math.round(user.accuracyRate * 100)}%
          </span>{" "}
          of the time.
        </h1>
        <p className="mt-4 text-[15px] text-ink-tertiary">
          Better than most readers on <em className="font-serif italic">Tech</em> and{" "}
          <em className="font-serif italic">Politics</em>. Worse on{" "}
          <em className="font-serif italic">Climate</em>.
        </p>
      </div>

      {/* Timeline */}
      {months.map(([month, positions]) => (
        <div key={month}>
          <h2 className="mb-5 mt-10 font-serif text-xl italic text-ink-tertiary">
            {month}
          </h2>
          {positions.map((pos) => (
            <TrackRecordEntry
              key={pos.marketId + pos.resolvedAt}
              position={pos}
              question={resolvedMarketQuestions[pos.marketId] ?? pos.marketId}
            />
          ))}
        </div>
      ))}

      {/* Year in review placeholder */}
      <div className="mt-16 text-center">
        <button
          disabled
          className="rounded-[var(--radius-pill)] border border-border-soft bg-bg-sunken px-6 py-3 text-sm font-medium text-ink-tertiary cursor-not-allowed"
          title="Available at the end of the year"
        >
          Year in review — coming December
        </button>
      </div>
    </div>
  );
}
