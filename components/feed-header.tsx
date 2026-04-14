"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/stores/app-store";
import { NotificationsDropdown } from "./notifications-dropdown";
import { AddFundsModal } from "./ui/add-funds-modal";

export function FeedHeader() {
  const balance = useAppStore((s) => s.user.practiceBalance);
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
      <header className="flex items-center justify-between border-b border-border-soft pb-5 mb-10">
        <span className="font-serif text-[26px] italic tracking-[-0.01em] text-ink-primary">
          Hunch
        </span>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowAddFunds(true)}
            className="cursor-pointer font-mono text-[13px] font-light tracking-[-0.02em] text-ink-secondary transition-colors hover:text-ink-primary"
            aria-label={`Balance: $${balance.toFixed(2)}. Click to add funds.`}
          >
            ${balance.toFixed(2)}
          </button>
          <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-ink-tertiary">
            {dateStr}
          </span>
          <NotificationsDropdown />
          <div className="grid h-8 w-8 place-items-center rounded-full bg-accent-highlight font-serif text-base text-accent-ink">
            A
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
