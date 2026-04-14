"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/stores/app-store";
import { EditorialOverline } from "@/components/ui/editorial-overline";

export default function SettingsPage() {
  const user = useAppStore((s) => s.user);
  const [notifications, setNotifications] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const predictionsToGo = Math.max(0, 10 - user.predictionsCompleted);

  return (
    <div className="mx-auto max-w-[600px] px-6 py-10">
      <h1 className="mb-10 font-serif text-5xl leading-[1.05] tracking-[-0.015em] text-ink-primary">
        Settings
      </h1>

      {/* Account */}
      <section className="mb-6 overflow-hidden rounded-2xl border border-border-soft bg-bg-surface">
        <div className="flex items-center justify-between border-b border-border-soft px-6 py-4">
          <div>
            <p className="text-[15px] text-ink-primary">Account</p>
            <p className="mt-0.5 text-[13px] text-ink-tertiary">
              armando@meetkai.com
            </p>
          </div>
          <span className="text-sm text-ink-secondary">Manage →</span>
        </div>
      </section>

      {/* Preferences */}
      <section className="mb-6 overflow-hidden rounded-2xl border border-border-soft bg-bg-surface">
        <div className="flex items-center justify-between border-b border-border-soft px-6 py-4">
          <p className="text-[15px] text-ink-primary">Appearance</p>
          <span className="text-sm text-ink-secondary">Light</span>
        </div>
        <div className="flex items-center justify-between border-b border-border-soft px-6 py-4">
          <p className="text-[15px] text-ink-primary">Notifications</p>
          <button
            onClick={() => setNotifications(!notifications)}
            className={`relative cursor-pointer h-6 w-11 rounded-full transition-colors ${
              notifications ? "bg-accent-ink" : "bg-border-firm"
            }`}
            role="switch"
            aria-checked={notifications}
            aria-label="Toggle notifications"
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-bg-surface shadow transition-transform ${
                notifications ? "left-[22px]" : "left-0.5"
              }`}
            />
          </button>
        </div>
        <div className="flex items-center justify-between px-6 py-4">
          <p className="text-[15px] text-ink-primary">Language</p>
          <span className="text-sm text-ink-secondary">English</span>
        </div>
      </section>

      {/* Advanced */}
      <section className="mb-6 overflow-hidden rounded-2xl border border-border-soft bg-bg-surface">
        <button
          type="button"
          className="flex w-full cursor-pointer items-center justify-between px-6 py-4 text-left"
          onClick={() => setShowAdvanced(!showAdvanced)}
          aria-expanded={showAdvanced}
        >
          <div>
            <p className="text-[15px] text-ink-primary">
              Graduate to self-custody
            </p>
            <p className="mt-0.5 text-[13px] text-ink-tertiary">
              Move your balance to a wallet you control.
            </p>
          </div>
          <span
            className={`whitespace-nowrap rounded-[var(--radius-pill)] bg-bg-sunken border border-border-soft px-4 py-2.5 text-[13px] text-ink-tertiary ${predictionsToGo > 0 ? "cursor-not-allowed" : ""}`}
          >
            {predictionsToGo > 0
              ? `${predictionsToGo} predictions to go`
              : "Available"}
          </span>
        </button>

        {showAdvanced && (
          <div className="border-t border-border-soft px-6 py-5">
            <p className="text-sm leading-relaxed text-ink-secondary">
              Self-custody means taking control of your own wallet key. Right
              now, we hold it on your behalf — like a bank holds your deposits.
              When you graduate, you manage the key yourself: full independence,
              full responsibility.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink-secondary">
              Most people don&apos;t need this. It&apos;s here when you&apos;re
              ready — if you&apos;re ever ready.
            </p>
          </div>
        )}
      </section>

      <p className="mt-10 text-center font-serif text-[17px] italic text-ink-tertiary">
        Hunch · Read the world. Back your hunches.
      </p>
    </div>
  );
}
