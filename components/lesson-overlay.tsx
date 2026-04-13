"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { Lesson } from "@/types";

type LessonOverlayProps = {
  lesson: Lesson | null;
  isOpen: boolean;
  onClose: () => void;
};

export function LessonOverlay({ lesson, isOpen, onClose }: LessonOverlayProps) {
  const reducedMotion = useReducedMotion();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    contentRef.current?.focus();
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!lesson) return null;

  const paragraphs = lesson.body.split("\n\n").filter(Boolean);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-[rgba(28,26,23,0.3)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            ref={contentRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={lesson.title}
            className="fixed inset-x-0 bottom-0 z-50 mx-auto max-h-[85vh] w-full max-w-[600px] overflow-y-auto rounded-t-[var(--radius-modal)] bg-bg-surface p-8 md:inset-y-0 md:flex md:items-center md:rounded-[var(--radius-modal)] md:p-12"
            initial={
              reducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 40 }
            }
            animate={{ opacity: 1, y: 0 }}
            exit={
              reducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 40 }
            }
            transition={
              reducedMotion
                ? { duration: 0.05 }
                : { duration: 0.32, ease: [0.22, 1, 0.36, 1] }
            }
          >
            <div className="w-full">
              <span className="font-serif text-6xl italic text-border-firm">
                {lesson.romanNumeral}
              </span>

              <h2 className="mt-4 font-serif text-3xl leading-[1.15] text-ink-primary">
                {lesson.title}
              </h2>

              <p className="mt-2 mb-8 text-sm text-ink-secondary">
                {lesson.subtitle}
              </p>

              {paragraphs.map((p, i) => (
                <p key={i} className="mb-4 text-base leading-[1.7] text-ink-primary">
                  {p}
                </p>
              ))}

              <button
                onClick={onClose}
                className="mt-8 cursor-pointer rounded-[var(--radius-pill)] bg-accent-ink px-6 py-3 text-sm font-medium text-bg-canvas transition-transform hover:-translate-y-px"
              >
                Got it →
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
