"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useAppStore } from "@/lib/stores/app-store";

const AMOUNTS = [5, 10, 25, 50] as const;

type AddFundsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function AddFundsModal({ isOpen, onClose }: AddFundsModalProps) {
  const reducedMotion = useReducedMotion();
  const modalRef = useRef<HTMLDivElement>(null);
  const [selectedAmount, setSelectedAmount] = useState<number>(10);
  const [custom, setCustom] = useState("");
  const addFunds = useAppStore((s) => s.addFunds);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    modalRef.current?.focus();
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  const handleAdd = () => {
    addFunds(selectedAmount);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-[rgba(28,26,23,0.3)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          <motion.div
            ref={modalRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label="Add funds"
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
                : { type: "spring", stiffness: 260, damping: 28 }
            }
            onClick={onClose}
          >
            <div className="relative w-full max-w-[400px] rounded-[var(--radius-modal)] border border-border-soft bg-bg-surface p-8 text-center shadow-[0_8px_24px_-8px_rgba(28,26,23,0.12)]" onClick={(e) => e.stopPropagation()}>
              <button type="button" onClick={onClose} className="absolute right-4 top-4 cursor-pointer rounded-lg p-1 text-ink-tertiary transition-colors hover:bg-bg-sunken hover:text-ink-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-ink" aria-label="Close">✕</button>
              <h2 className="mb-2 font-serif text-3xl italic text-ink-primary">
                Add funds to your balance.
              </h2>
              <p className="mb-6 text-[14px] text-ink-secondary">
                Choose an amount. No fees on practice top-ups.
              </p>

              <div className="mb-3 grid grid-cols-4 gap-2">
                {AMOUNTS.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => { setSelectedAmount(amount); setCustom(""); }}
                    className={`cursor-pointer rounded-[var(--radius-button)] border py-3 text-center font-mono text-sm transition-all duration-150 ${
                      selectedAmount === amount && custom === ""
                        ? "border-accent-ink bg-accent-highlight text-accent-ink"
                        : "border-border-soft bg-transparent text-ink-secondary hover:border-border-firm"
                    }`}
                  >
                    ${amount}
                  </button>
                ))}
              </div>

              {/* Custom amount input */}
              <div className="mb-5 flex items-center gap-2 rounded-[var(--radius-button)] border border-border-soft bg-bg-sunken px-4 py-2.5">
                <span className="font-mono text-sm text-ink-tertiary">$</span>
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="Other amount"
                  value={custom}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^0-9.]/g, "");
                    setCustom(raw);
                    const val = parseFloat(raw);
                    if (val > 0 && val <= 500) setSelectedAmount(val);
                  }}
                  onFocus={() => setCustom(custom || String(selectedAmount))}
                  className="w-full bg-transparent font-mono text-sm text-ink-primary placeholder:text-ink-tertiary outline-none"
                />
              </div>

              <button
                onClick={handleAdd}
                disabled={selectedAmount <= 0}
                className="mb-4 w-full cursor-pointer rounded-[var(--radius-card)] bg-accent-ink py-3.5 text-[15px] font-medium text-bg-canvas transition-transform hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add ${selectedAmount}
              </button>

              <p className="text-[12px] italic text-ink-tertiary">
                In the future, you&apos;ll be able to add real funds here.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
