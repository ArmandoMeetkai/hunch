"use client";

type StepMoneyProps = {
  onStart: () => void;
};

export function StepMoney({ onStart }: StepMoneyProps) {
  return (
    <div className="flex min-h-[680px] flex-col items-center justify-center px-10 text-center">
      <p className="mb-4 font-mono text-7xl font-light tracking-[-0.03em] text-ink-primary md:text-8xl">
        $10
      </p>
      <h2 className="font-serif text-3xl italic text-ink-primary md:text-4xl">
        to start exploring.
      </h2>

      <p className="mx-auto mt-6 max-w-[440px] text-lg leading-relaxed text-ink-secondary">
        This is practice money. Use it to back your hunches, track your
        intuition, and learn how predictions work. When you&apos;re ready, you
        can add real funds.
      </p>

      <button
        onClick={onStart}
        autoFocus
        className="mt-12 cursor-pointer rounded-[var(--radius-pill)] bg-accent-ink px-6 py-3 text-sm font-medium text-bg-canvas transition-transform hover:-translate-y-px"
      >
        Start reading →
      </button>
    </div>
  );
}
