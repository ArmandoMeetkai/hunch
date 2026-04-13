"use client";

const AMOUNTS = [0.5, 1, 5, 25] as const;

type AmountStepperProps = {
  value: number;
  onChange: (amount: number) => void;
};

export function AmountStepper({ value, onChange }: AmountStepperProps) {
  return (
    <div className="grid grid-cols-4 gap-1.5">
      {AMOUNTS.map((amount) => {
        const isActive = value === amount;
        return (
          <button
            key={amount}
            onClick={() => onChange(amount)}
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
  );
}
