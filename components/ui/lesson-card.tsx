"use client";

import type { Lesson } from "@/types";

type LessonCardProps = {
  lesson: Lesson;
  isUnlocked: boolean;
  predictionsNeeded: number;
  onClick: () => void;
};

export function LessonCard({
  lesson,
  isUnlocked,
  predictionsNeeded,
  onClick,
}: LessonCardProps) {
  return (
    <div
      onClick={isUnlocked ? onClick : undefined}
      className={`relative overflow-hidden rounded-2xl border border-border-soft bg-bg-surface p-7 transition-all duration-150 ${
        isUnlocked
          ? "cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-8px_rgba(28,26,23,0.08)]"
          : "opacity-55 cursor-default"
      }`}
      role={isUnlocked ? "button" : undefined}
      tabIndex={isUnlocked ? 0 : undefined}
      onKeyDown={isUnlocked ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } } : undefined}
      aria-label={isUnlocked ? `Read lesson: ${lesson.title}` : `Locked lesson: ${lesson.title}`}
    >
      {/* Decorative roman numeral — drop cap */}
      <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 select-none font-serif text-[128px] leading-none text-border-firm/60">
        {lesson.romanNumeral}
      </span>

      <h3 className="mb-2 pr-20 font-serif text-[26px] leading-[1.15] text-ink-primary line-clamp-2">
        {lesson.title}
      </h3>

      <p className="mb-5 pr-20 text-sm leading-relaxed text-ink-secondary line-clamp-2">
        {lesson.subtitle}
      </p>

      {isUnlocked ? (
        <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-ink-tertiary">
          <span className="text-accent-signal">✓</span> Unlocked
        </span>
      ) : (
        <span className="font-serif text-sm italic text-ink-tertiary">
          {predictionsNeeded === 1 ? "One more hunch" : `${predictionsNeeded} more hunches`} to unlock.
        </span>
      )}
    </div>
  );
}
