"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/stores/app-store";
import { lessons } from "@/lib/mock-data";
import { EditorialOverline } from "@/components/ui/editorial-overline";
import { LessonCard } from "@/components/ui/lesson-card";
import { LessonOverlay } from "@/components/lesson-overlay";
import type { Lesson } from "@/types";

export default function LearnPage() {
  const user = useAppStore((s) => s.user);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  return (
    <div className="mx-auto max-w-[960px] px-6 py-10">
      <div className="mb-10">
        <EditorialOverline>30-second lessons</EditorialOverline>
        <h1 className="mt-3 font-serif text-5xl leading-[1.05] tracking-[-0.015em] text-ink-primary">
          A quieter way to{" "}
          <em className="italic">learn how this works.</em>
        </h1>
      </div>

      <div className="flex flex-col gap-5">
        {(() => {
          const [featured, ...rest] = lessons;
          const featuredUnlocked = user.unlockedLessons.includes(featured.id);
          const featuredNeeded = Math.max(
            0,
            featured.unlockAfterPredictions - user.predictionsCompleted,
          );
          return (
            <>
              <LessonCard
                key={featured.id}
                lesson={featured}
                isUnlocked={featuredUnlocked}
                predictionsNeeded={featuredNeeded}
                onClick={() => setActiveLesson(featured)}
                featured
              />
              <div className="grid gap-5 md:grid-cols-2">
                {rest.map((lesson) => {
                  const isUnlocked = user.unlockedLessons.includes(lesson.id);
                  const predictionsNeeded = Math.max(
                    0,
                    lesson.unlockAfterPredictions - user.predictionsCompleted,
                  );

                  return (
                    <LessonCard
                      key={lesson.id}
                      lesson={lesson}
                      isUnlocked={isUnlocked}
                      predictionsNeeded={predictionsNeeded}
                      onClick={() => setActiveLesson(lesson)}
                    />
                  );
                })}
              </div>
            </>
          );
        })()}
      </div>

      <LessonOverlay
        lesson={activeLesson}
        isOpen={activeLesson !== null}
        onClose={() => setActiveLesson(null)}
      />
    </div>
  );
}
