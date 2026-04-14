"use client";

import { useState, useRef, useEffect } from "react";
import type { Topic } from "@/types";

const ALL_TOPICS: { label: string; value: Topic }[] = [
  { label: "Politics", value: "politics" },
  { label: "Climate", value: "climate" },
  { label: "Culture", value: "culture" },
  { label: "Sports", value: "sports" },
  { label: "Tech", value: "tech" },
  { label: "Economy", value: "economy" },
  { label: "Science", value: "science" },
  { label: "Entertainment", value: "entertainment" },
  { label: "World", value: "world" },
];

type StepTopicsProps = {
  onContinue: (topics: Topic[]) => void;
};

export function StepTopics({ onContinue }: StepTopicsProps) {
  const [selected, setSelected] = useState<Topic[]>([]);
  const continueRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (selected.length >= 3) {
      continueRef.current?.focus();
    }
  }, [selected]);

  const toggle = (topic: Topic) => {
    setSelected((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic],
    );
  };

  return (
    <div className="flex min-h-[680px] flex-col items-center justify-center px-10 text-center">
      <h2 className="font-serif text-4xl leading-[1.1] tracking-[-0.01em] text-ink-primary md:text-5xl">
        What are you <em className="italic">curious about?</em>
      </h2>

      <p className="mx-auto mt-4 max-w-[480px] text-lg text-ink-secondary">
        Pick at least three topics. You can change these later.
      </p>

      <div className="mx-auto mt-10 grid max-w-[480px] grid-cols-3 gap-3">
        {ALL_TOPICS.map(({ label, value }) => {
          const isSelected = selected.includes(value);
          return (
            <button
              key={value}
              onClick={() => toggle(value)}
              className={`cursor-pointer rounded-[var(--radius-card)] border px-5 py-3.5 font-serif text-lg italic transition-all duration-150 ${
                isSelected
                  ? "border-accent-ink bg-accent-highlight text-accent-ink"
                  : "border-border-soft bg-bg-surface text-ink-primary hover:border-border-firm"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <button
        ref={continueRef}
        onClick={() => onContinue(selected)}
        disabled={selected.length < 3}
        className="mt-12 cursor-pointer rounded-[var(--radius-pill)] bg-accent-ink px-6 py-3 text-sm font-medium text-bg-canvas transition-transform hover:-translate-y-px disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Continue →
      </button>
    </div>
  );
}
