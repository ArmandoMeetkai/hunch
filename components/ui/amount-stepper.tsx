"use client";

import { useState } from "react";

const AMOUNTS = [0.5, 1, 5, 25] as const;

type AmountStepperProps = {
  value: number;
  onChange: (amount: number) => void;
};

export function AmountStepper({ value, onChange }: AmountStepperProps) {
  const [custom, setCustom] = useState("");
  const isCustomActive = custom !== "" && !AMOUNTS.includes(value as typeof AMOUNTS[number]);

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-4 gap-1.5">
        {AMOUNTS.map((amount) => {
          const isActive = value === amount && custom === "";
          return (
            <button
              key={amount}
              onClick={() => { onChange(amount); setCustom(""); }}
              className={`cursor-pointer rounded-[var(--radius-button)] border py-2.5 text-center font-mono text-sm transition-all duration-150 ${
                isActive
                  ? "border-accent-ink bg-accent-highlight text-accent-ink"
                  : "border-border-soft bg-transparent text-ink-secondary hover:border-border-firm"
              }`}
            >
              ${amount < 1 ? amount.toFixed(2) : amount}
            </button>
          );
        })}
      </div>
      <div
        className={`flex items-center gap-2 rounded-[var(--radius-button)] border px-3 py-2 ${
          isCustomActive
            ? "border-accent-ink bg-accent-highlight/30"
            : "border-border-soft bg-bg-sunken"
        }`}
      >
        <span className="font-mono text-sm text-ink-tertiary">$</span>
        <input
          type="text"
          inputMode="decimal"
          placeholder="Other"
          value={custom}
          onChange={(e) => {
            const raw = e.target.value.replace(/[^0-9.]/g, "");
            setCustom(raw);
            const val = parseFloat(raw);
            if (val > 0 && val <= 500) onChange(val);
          }}
          className="w-full bg-transparent font-mono text-sm text-ink-primary placeholder:text-ink-tertiary outline-none [appearance:textfield]"
        />
      </div>
    </div>
  );
}
