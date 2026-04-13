"use client";

import { useState } from "react";
import type { Market } from "@/types";
import type { Side } from "@/types";
import { useAppStore } from "@/lib/stores/app-store";
import { ProbabilityNumber } from "@/components/ui/probability-number";
import { Sparkline } from "@/components/ui/sparkline";
import { PillToggle } from "@/components/ui/pill-toggle";
import { AmountStepper } from "@/components/ui/amount-stepper";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { EditorialOverline } from "@/components/ui/editorial-overline";

type StickyMarketModuleProps = {
  market: Market;
};

export function StickyMarketModule({ market }: StickyMarketModuleProps) {
  const [side, setSide] = useState<Side>("yes");
  const [amount, setAmount] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const placeBet = useAppStore((s) => s.placeBet);
  const balance = useAppStore((s) => s.user.practiceBalance);

  const trendUp =
    market.history.length >= 2 &&
    market.history[market.history.length - 1].p > market.history[0].p;
  const weekChange =
    market.history.length >= 2
      ? (
          (market.history[market.history.length - 1].p - market.history[0].p) *
          100
        ).toFixed(1)
      : "0.0";
  const sparklineColor = trendUp
    ? "var(--color-accent-signal)"
    : "var(--color-accent-cool)";

  const handleBack = () => {
    if (balance < amount) return;
    placeBet(market.id, side, amount);
    setShowModal(true);
  };

  return (
    <>
      <aside className="sticky top-6 rounded-2xl border border-border-soft bg-bg-surface p-7">
        <EditorialOverline className="mb-4 block">
          The Hunch
        </EditorialOverline>

        <h3 className="mb-5 font-serif text-[22px] leading-[1.2] text-ink-primary">
          {market.question}
        </h3>

        <ProbabilityNumber value={market.probabilityYes} size={64} />

        <p className="mt-1 mb-5 text-[13px] text-ink-tertiary">
          <span className={trendUp ? "text-accent-signal" : "text-accent-cool"}>
            {trendUp ? "↗" : "↘"} {trendUp ? "+" : ""}
            {weekChange}%
          </span>{" "}
          this week
        </p>

        <Sparkline
          data={market.history}
          width={280}
          height={60}
          color={sparklineColor}
          className="mb-6 w-full"
        />

        <PillToggle value={side} onChange={setSide} layoutId="market-module-toggle" />

        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <EditorialOverline>Amount</EditorialOverline>
            <span className="font-mono text-[13px] text-ink-tertiary">
              Balance: ${balance.toFixed(2)}
            </span>
          </div>
          <AmountStepper value={amount} onChange={setAmount} />
        </div>

        {balance < amount && (
          <p className="mt-3 text-center text-[13px] text-accent-signal">
            Not enough balance for this amount.
          </p>
        )}

        <button
          onClick={handleBack}
          disabled={balance < amount}
          className="mt-4 w-full cursor-pointer rounded-[var(--radius-card)] bg-accent-ink py-3.5 text-[15px] font-medium text-bg-canvas transition-transform hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={`Back $${amount < 1 ? amount.toFixed(2) : amount} on ${side === "yes" ? "Yes" : "No"} for: ${market.question}`}
        >
          Back ${amount < 1 ? amount.toFixed(2) : amount} on{" "}
          {side === "yes" ? "Yes" : "No"}
        </button>

        <p className="mt-4 text-center font-serif text-[15px] italic text-ink-tertiary">
          You believe this more than 73% of readers.
        </p>
      </aside>

      <ConfirmationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        side={side}
        amount={amount}
        question={market.question}
      />
    </>
  );
}
