"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useAppStore } from "@/lib/stores/app-store";
import type { CryptoAsset } from "@/types";
import { CRYPTO_GLYPHS } from "@/lib/mock-crypto";
import { AddFundsModal } from "./add-funds-modal";

const AMOUNTS = [5, 10, 25, 50] as const;

type BuyCryptoModalProps = {
  isOpen: boolean;
  onClose: () => void;
  asset: CryptoAsset;
};

export function BuyCryptoModal({ isOpen, onClose, asset }: BuyCryptoModalProps) {
  const reducedMotion = useReducedMotion();
  const modalRef = useRef<HTMLDivElement>(null);
  const [amount, setAmount] = useState<number>(10);
  const [custom, setCustom] = useState("");
  const [showAddFunds, setShowAddFunds] = useState(false);
  const buyCrypto = useAppStore((s) => s.buyCrypto);
  const balance = useAppStore((s) => s.user.practiceBalance);

  const quantity = amount / asset.price;
  const canAfford = balance >= amount;

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    modalRef.current?.focus();
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  const handleBuy = () => {
    if (!canAfford) return;
    buyCrypto(asset.id, amount);
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
            aria-label={`Buy ${asset.name}`}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
            transition={reducedMotion ? { duration: 0.05 } : { type: "spring", stiffness: 260, damping: 28 }}
            onClick={onClose}
          >
            <div className="relative w-full max-w-[400px] rounded-[var(--radius-modal)] border border-border-soft bg-bg-surface p-8 shadow-[0_8px_24px_-8px_rgba(28,26,23,0.12)]" onClick={(e) => e.stopPropagation()}>
              <button type="button" onClick={onClose} className="absolute right-4 top-4 cursor-pointer rounded-lg p-1 text-ink-tertiary transition-colors hover:bg-bg-sunken hover:text-ink-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-ink" aria-label="Close">✕</button>
              <div className="mb-6 text-center">
                <span className="font-serif text-5xl text-ink-tertiary">
                  {CRYPTO_GLYPHS[asset.id]}
                </span>
                <h2 className="mt-2 font-serif text-2xl italic text-ink-primary">
                  Buy {asset.name}
                </h2>
                <p className="mt-1 font-mono text-sm text-ink-tertiary">
                  ${asset.price.toLocaleString()} per {asset.symbol}
                </p>
              </div>

              <div className="mb-3 grid grid-cols-4 gap-2">
                {AMOUNTS.map((a) => (
                  <button
                    key={a}
                    onClick={() => { setAmount(a); setCustom(""); }}
                    className={`cursor-pointer rounded-[var(--radius-button)] border py-3 text-center font-mono text-sm transition-all duration-150 ${
                      amount === a && custom === ""
                        ? "border-accent-ink bg-accent-highlight text-accent-ink"
                        : "border-border-soft text-ink-secondary hover:border-border-firm"
                    }`}
                  >
                    ${a}
                  </button>
                ))}
              </div>

              {(() => {
                const customVal = parseFloat(custom);
                const isOverLimit = custom !== "" && customVal > 500;
                return (
                  <div className={`mb-5 flex items-center gap-2 rounded-[var(--radius-button)] border px-4 py-2.5 ${
                    isOverLimit
                      ? "border-accent-signal bg-accent-signal/5"
                      : custom !== ""
                        ? "border-accent-ink bg-accent-highlight/30"
                        : "border-border-soft bg-bg-sunken"
                  }`}>
                    <span className="font-mono text-sm text-ink-tertiary">$</span>
                    <input
                      type="text"
                      inputMode="decimal"
                      placeholder="Other amount"
                      maxLength={6}
                      value={custom}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/[^0-9.]/g, "").slice(0, 6);
                        setCustom(raw);
                        const val = parseFloat(raw);
                        if (val > 0 && val <= 500) setAmount(val);
                      }}
                      className="w-full bg-transparent font-mono text-sm text-ink-primary placeholder:text-ink-tertiary outline-none"
                    />
                    {isOverLimit && (
                      <span className="shrink-0 text-[11px] text-accent-signal">Max $500</span>
                    )}
                  </div>
                );
              })()}

              <p className="mb-5 text-center text-[13px] text-ink-secondary">
                You&apos;ll get ~{quantity.toFixed(6)} {asset.symbol}
              </p>

              <div className="mb-2 flex items-center justify-between text-[13px]">
                <span className="text-ink-tertiary">Balance</span>
                <span className="font-mono text-ink-secondary">${balance.toFixed(2)}</span>
              </div>

              <button
                onClick={handleBuy}
                disabled={!canAfford}
                className="mb-4 w-full cursor-pointer rounded-[var(--radius-card)] bg-accent-ink py-3.5 text-[15px] font-medium text-bg-canvas transition-transform hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Buy ${amount} of {asset.name}
              </button>

              {!canAfford && (
                <button
                  type="button"
                  onClick={() => setShowAddFunds(true)}
                  className="w-full cursor-pointer text-center text-[13px] font-medium text-accent-signal transition-colors hover:text-accent-ink"
                >
                  Not enough balance — Add funds →
                </button>
              )}
            </div>
          </motion.div>
          <AddFundsModal
            isOpen={showAddFunds}
            onClose={() => setShowAddFunds(false)}
          />
        </>
      )}
    </AnimatePresence>
  );
}
