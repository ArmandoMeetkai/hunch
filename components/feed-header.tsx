"use client";

import { useAppStore } from "@/lib/stores/app-store";
import { NotificationsDropdown } from "./notifications-dropdown";

export function FeedHeader() {
  const balance = useAppStore((s) => s.user.practiceBalance);

  const now = new Date();
  const dateStr = now
    .toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    })
    .toUpperCase();

  return (
    <header className="flex items-center justify-between border-b border-border-soft pb-5 mb-10">
      <span className="font-serif text-[26px] italic tracking-[-0.01em] text-ink-primary">
        Hunch
      </span>
      <div className="flex items-center gap-4">
        <span className="font-mono text-[13px] font-light tracking-[-0.02em] text-ink-secondary">
          ${balance.toFixed(2)}
        </span>
        <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-ink-tertiary">
          {dateStr}
        </span>
        <NotificationsDropdown />
        <div className="grid h-8 w-8 place-items-center rounded-full bg-accent-highlight font-serif text-base text-accent-ink">
          A
        </div>
      </div>
    </header>
  );
}
