"use client";

import { useState, useRef, useEffect } from "react";
import type { Side } from "@/types";
import { stories, markets } from "@/lib/mock-data";
import { EditorialOverline } from "@/components/ui/editorial-overline";
import { ProbabilityNumber } from "@/components/ui/probability-number";
import { Sparkline } from "@/components/ui/sparkline";
import { PillToggle } from "@/components/ui/pill-toggle";
import { AmountStepper } from "@/components/ui/amount-stepper";

type StepPracticeProps = {
  onContinue: () => void;
};

export function StepPractice({ onContinue }: StepPracticeProps) {
  const [side, setSide] = useState<Side>("yes");
  const [amount, setAmount] = useState(1);
  const [hasInteracted, setHasInteracted] = useState(false);
  const continueRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (hasInteracted) {
      continueRef.current?.focus();
    }
  }, [hasInteracted]);

  // Use the first story as the example
  const story = stories[0];
  const market = markets[0];

  const handleSideChange = (s: Side) => {
    setSide(s);
    setHasInteracted(true);
  };

  const handleAmountChange = (a: number) => {
    setAmount(a);
    setHasInteracted(true);
  };

  return (
    <div className="flex min-h-[680px] flex-col items-center justify-center px-6 text-center">
      <h2 className="mb-2 font-serif text-3xl leading-[1.1] tracking-[-0.01em] text-ink-primary md:text-4xl">
        This is how <em className="italic">a hunch works.</em>
      </h2>
      <p className="mx-auto mb-8 max-w-[480px] text-base text-ink-secondary">
        Try it — pick a side and an amount. Nothing happens yet.
      </p>

      {/* Practice card */}
      <div className="mx-auto w-full max-w-[420px] rounded-2xl border border-border-soft bg-bg-surface p-6 text-left">
        <EditorialOverline className="mb-2 block">
          {story.topic.charAt(0).toUpperCase() + story.topic.slice(1)} ·
          Practice
        </EditorialOverline>

        <h3 className="mb-3 font-serif text-xl leading-[1.2] text-ink-primary">
          {market.question}
        </h3>

        <div className="mb-4 flex items-center gap-4">
          <ProbabilityNumber value={market.probabilityYes} size={36} />
          <Sparkline
            data={market.history}
            width={120}
            height={32}
            color="var(--color-accent-signal)"
          />
        </div>

        {/* Tooltip */}
        <div className="relative mb-4 rounded-lg border border-accent-highlight bg-accent-highlight/30 px-4 py-3">
          <p className="text-sm text-accent-ink">
            ↓ Pick <strong>Yes</strong> or <strong>No</strong>, then choose an
            amount.
          </p>
        </div>

        <PillToggle
          value={side}
          onChange={handleSideChange}
          layoutId="onboarding-toggle"
        />

        <div className="mt-3">
          <AmountStepper value={amount} onChange={handleAmountChange} />
        </div>

        <div className="mt-4 rounded-[var(--radius-card)] bg-bg-sunken px-4 py-3 text-center text-sm text-ink-tertiary">
          Back ${amount < 1 ? amount.toFixed(2) : amount} on{" "}
          {side === "yes" ? "Yes" : "No"}
        </div>
      </div>

      <button
        ref={continueRef}
        onClick={onContinue}
        disabled={!hasInteracted}
        className="mt-8 cursor-pointer rounded-[var(--radius-pill)] bg-accent-ink px-6 py-3 text-sm font-medium text-bg-canvas transition-transform hover:-translate-y-px disabled:opacity-40 disabled:cursor-not-allowed"
      >
        I get it, continue →
      </button>
    </div>
  );
}
