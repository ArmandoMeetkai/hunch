"use client";

import type { ResolvedPosition } from "@/types";

type TrackRecordEntryProps = {
  position: ResolvedPosition;
  question: string;
};

export function TrackRecordEntry({ position, question }: TrackRecordEntryProps) {
  const resolvedDate = new Date(position.resolvedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const pnlStr = position.correct
    ? `+$${(position.payout - position.amount).toFixed(2)}`
    : `−$${position.amount.toFixed(2)}`;

  return (
    <div className="grid grid-cols-[24px_1fr_auto] items-center gap-5 border-b border-border-soft py-4">
      <div
        className={`grid h-5 w-5 place-items-center rounded-full font-mono text-xs ${
          position.correct
            ? "bg-accent-highlight text-accent-signal"
            : "bg-bg-sunken text-ink-tertiary"
        }`}
      >
        {position.correct ? "✓" : "✗"}
      </div>

      <div>
        <p className="text-[15px] text-ink-primary">{question}</p>
        <p className="mt-0.5 text-[13px] text-ink-tertiary">
          Backed {position.side === "yes" ? "Yes" : "No"} · ${position.amount} ·
          resolved {resolvedDate}
        </p>
      </div>

      <span
        className={`font-mono text-[13px] ${
          position.correct ? "text-ink-secondary" : "text-ink-tertiary"
        }`}
      >
        {pnlStr}
      </span>
    </div>
  );
}
