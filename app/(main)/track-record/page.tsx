"use client";

import { useAppStore } from "@/lib/stores/app-store";
import {
  resolvedMarketQuestions,
  resolvedMarketTopics,
} from "@/lib/mock-data";
import { TrackRecordEntry } from "@/components/track-record-entry";
import { EditorialOverline } from "@/components/ui/editorial-overline";
import type { Topic } from "@/types";

function buildAccuracyLine(
  stats: Array<{ topic: Topic; accuracy: number; total: number }>,
  totalResolved: number,
): string {
  if (totalResolved === 0) {
    return "Nothing resolved yet — back a hunch to get on the record.";
  }
  if (totalResolved < 3) {
    return `Early days — ${totalResolved} resolved hunch${totalResolved === 1 ? "" : "es"} so far.`;
  }
  if (stats.length === 1) {
    return `All on *${stats[0].topic}* for now — the sample needs time to spread.`;
  }

  const best = stats[0];
  const worst = stats[stats.length - 1];

  if (best.accuracy === worst.accuracy) {
    return `Evenly matched across *${best.topic}* and *${worst.topic}* — no clear edge yet.`;
  }
  if (best.accuracy >= 0.75 && worst.accuracy <= 0.4) {
    return `Sharpest on *${best.topic}*. Weaker on *${worst.topic}*.`;
  }
  return `Strongest on *${best.topic}*. Less certain on *${worst.topic}*.`;
}

// Render "Sharpest on *tech*. Less certain on *economy*." with italics
function renderAccuracyLine(line: string) {
  const parts = line.split(/(\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <em key={i} className="font-serif italic">
          {part.slice(1, -1)}
        </em>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export default function TrackRecordPage() {
  const user = useAppStore((s) => s.user);
  const markets = useAppStore((s) => s.markets);
  const stories = useAppStore((s) => s.stories);

  // Per-topic accuracy from resolved positions
  const storyByMarketId = new Map(stories.map((s) => [s.marketId, s]));
  const topicBuckets: Partial<Record<Topic, { correct: number; total: number }>> = {};

  for (const pos of user.resolvedPositions) {
    const topic =
      storyByMarketId.get(pos.marketId)?.topic ??
      resolvedMarketTopics[pos.marketId];
    if (!topic) continue;
    const bucket = topicBuckets[topic] ?? { correct: 0, total: 0 };
    bucket.total += 1;
    if (pos.correct) bucket.correct += 1;
    topicBuckets[topic] = bucket;
  }

  const topicStats = (Object.entries(topicBuckets) as Array<
    [Topic, { correct: number; total: number }]
  >)
    .map(([topic, s]) => ({ topic, accuracy: s.correct / s.total, total: s.total }))
    .sort((a, b) => b.accuracy - a.accuracy);

  const accuracyLine = buildAccuracyLine(topicStats, user.resolvedPositions.length);

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
      <div className="mb-12 border-b border-border-soft pb-10 pt-14 text-center">
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
          {renderAccuracyLine(accuracyLine)}
        </p>
      </div>

      {/* Timeline */}
      {months.map(([month, positions], idx) => (
        <section key={month} className={idx === 0 ? "" : "mt-14"}>
          <EditorialOverline className="mb-5 block">{month}</EditorialOverline>
          {positions.map((pos) => (
            <TrackRecordEntry
              key={pos.marketId + pos.resolvedAt}
              position={pos}
              question={resolvedMarketQuestions[pos.marketId] ?? markets.find((m) => m.id === pos.marketId)?.question ?? pos.marketId}
            />
          ))}
        </section>
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
