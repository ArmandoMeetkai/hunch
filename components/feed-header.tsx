"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/stores/app-store";
import { NotificationsDropdown } from "./notifications-dropdown";
import { AddFundsModal } from "./ui/add-funds-modal";

export function FeedHeader() {
  const practiceBalance = useAppStore((s) => s.user.practiceBalance);
  const positions = useAppStore((s) => s.user.positions);
  const balance =
    practiceBalance + positions.reduce((sum, p) => sum + p.currentValue, 0);
  const [showAddFunds, setShowAddFunds] = useState(false);

  const now = new Date();
  const dateStr = now
    .toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    })
    .toUpperCase();

  return (
    <>
      <header className="mb-10 border-b border-border-soft pb-5">
        <div className="flex items-start justify-between gap-4">
          {/* Masthead: logo stacked with date */}
          <div className="flex flex-col gap-1">
            <span className="flex items-baseline gap-1.5 leading-none">
              <span
                className="text-[18px] text-accent-signal"
                aria-hidden="true"
              >
                ✳︎
              </span>
              <span className="font-serif text-[26px] italic tracking-[-0.01em] text-ink-primary">
                Hunch
              </span>
            </span>
            <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-ink-tertiary">
              {dateStr}
            </span>
          </div>

          {/* Utilities: balance, notifications, avatar */}
          <div className="flex items-center gap-3 md:gap-4">
            <button
              onClick={() => setShowAddFunds(true)}
              className="group flex items-baseline gap-1.5 cursor-pointer transition-colors"
              aria-label={`Total balance: $${balance.toFixed(2)} (cash plus open positions). Click to add funds.`}
            >
              <span className="font-serif text-[13px] italic text-ink-tertiary transition-colors group-hover:text-ink-secondary">
                Balance
              </span>
              <span className="font-mono text-[14px] font-light tracking-[-0.02em] text-ink-primary transition-colors group-hover:text-accent-ink">
                ${balance.toFixed(2)}
              </span>
            </button>
            <NotificationsDropdown />
            <div className="grid h-8 w-8 place-items-center rounded-full bg-accent-highlight font-serif text-base text-accent-ink">
              A
            </div>
          </div>
        </div>
      </header>

      <AddFundsModal
        isOpen={showAddFunds}
        onClose={() => setShowAddFunds(false)}
      />
    </>
  );
}
