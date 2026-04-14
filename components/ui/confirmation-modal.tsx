"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { Side } from "@/types";

type ConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  side: Side;
  amount: number;
  question: string;
};

export function ConfirmationModal({
  isOpen,
  onClose,
  side,
  amount,
  question,
}: ConfirmationModalProps) {
  const reducedMotion = useReducedMotion();
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);

    // Focus trap
    modalRef.current?.focus();

    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 z-50 bg-[rgba(28,26,23,0.3)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label="Prediction confirmed"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={
              reducedMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.95 }
            }
            animate={{ opacity: 1, scale: 1 }}
            exit={
              reducedMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.95 }
            }
            transition={
              reducedMotion
                ? { duration: 0.05 }
                : {
                    type: "spring",
                    stiffness: 260,
                    damping: 28,
                  }
            }
            onClick={onClose}
          >
            <div className="relative w-full max-w-[400px] rounded-[var(--radius-modal)] border border-border-soft bg-bg-surface p-8 text-center shadow-[0_8px_24px_-8px_rgba(28,26,23,0.12)]" onClick={(e) => e.stopPropagation()}>
              <button type="button" onClick={onClose} className="absolute right-4 top-4 cursor-pointer rounded-lg p-1 text-ink-tertiary transition-colors hover:bg-bg-sunken hover:text-ink-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-ink" aria-label="Close">✕</button>
              <h2 className="mb-4 font-serif text-3xl italic text-ink-primary">
                Your hunch is on the record.
              </h2>

              <p className="mb-2 text-[13px] text-ink-tertiary">
                You backed
              </p>
              <p className="mb-6 font-mono text-lg font-light tracking-[-0.02em] text-ink-primary">
                ${amount.toFixed(2)} on{" "}
                <span className={side === "yes" ? "text-accent-signal" : "text-accent-cool"}>
                  {side === "yes" ? "Yes" : "No"}
                </span>
              </p>
              <p className="mb-8 text-[13px] leading-relaxed text-ink-tertiary">
                {question}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    onClose();
                    router.push("/");
                  }}
                  className="flex-1 cursor-pointer rounded-[var(--radius-button)] border border-border-firm px-5 py-3 text-sm font-medium text-ink-primary transition-colors hover:bg-bg-surface"
                >
                  Back another →
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 cursor-pointer rounded-[var(--radius-button)] border border-border-firm px-5 py-3 text-sm font-medium text-ink-primary transition-colors hover:bg-bg-surface"
                >
                  Done
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
