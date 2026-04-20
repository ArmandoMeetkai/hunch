"use client";

import type { Lesson } from "@/types";

type LessonCardProps = {
  lesson: Lesson;
  isUnlocked: boolean;
  predictionsNeeded: number;
  onClick: () => void;
  featured?: boolean;
};

export function LessonCard({
  lesson,
  isUnlocked,
  predictionsNeeded,
  onClick,
  featured = false,
}: LessonCardProps) {
  const padding = featured ? "p-8 md:p-10" : "p-5";
  const numeralSize = featured ? "text-[180px] md:text-[220px]" : "text-[112px]";
  const numeralRight = featured ? "right-6 md:right-10" : "right-4";
  const titleSize = featured
    ? "text-[32px] md:text-[40px] leading-[1.1]"
    : "text-[26px] leading-[1.15]";
  const subtitleSize = featured ? "text-base md:text-lg leading-relaxed" : "text-sm leading-relaxed";
  const titleRight = featured ? "pr-32 md:pr-40" : "pr-20";

  return (
    <div
      onClick={isUnlocked ? onClick : undefined}
      className={`relative overflow-hidden rounded-2xl border border-border-soft bg-bg-surface ${padding} transition-all duration-150 ${
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
      <span className={`pointer-events-none absolute top-1/2 -translate-y-1/2 select-none font-serif ${numeralSize} ${numeralRight} leading-none text-border-firm/60`}>
        {lesson.romanNumeral}
      </span>

      <h3 className={`mb-2 font-serif text-ink-primary line-clamp-2 ${titleRight} ${titleSize}`}>
        {lesson.title}
      </h3>

      <p className={`mb-4 text-ink-secondary line-clamp-2 ${titleRight} ${subtitleSize}`}>
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
