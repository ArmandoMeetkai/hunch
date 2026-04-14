"use client";

type StepWelcomeProps = {
  onContinue: () => void;
};

export function StepWelcome({ onContinue }: StepWelcomeProps) {
  return (
    <div className="flex min-h-[680px] flex-col items-center justify-center px-10 text-center">
      <h1 className="font-serif text-6xl leading-[0.95] tracking-[-0.02em] text-ink-primary md:text-7xl">
        Read the world.
        <br />
        <em className="italic">Back your hunches.</em>
      </h1>

      <p className="mx-auto mt-6 max-w-[480px] text-lg leading-relaxed text-ink-secondary">
        A new way to track what you believe — and see how often you&apos;re
        right.
      </p>

      <button
        onClick={onContinue}
        autoFocus
        className="mt-12 cursor-pointer rounded-[var(--radius-pill)] bg-accent-ink px-6 py-3 text-sm font-medium text-bg-canvas transition-transform hover:-translate-y-px"
      >
        Continue →
      </button>
    </div>
  );
}
