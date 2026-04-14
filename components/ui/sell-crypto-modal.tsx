"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useAppStore } from "@/lib/stores/app-store";
import type { CryptoAsset, CryptoHolding } from "@/types";
import { CRYPTO_GLYPHS } from "@/lib/mock-crypto";

const PERCENTAGES = [25, 50, 75, 100] as const;

type SellCryptoModalProps = {
  isOpen: boolean;
  onClose: () => void;
  asset: CryptoAsset;
  holding: CryptoHolding;
};

export function SellCryptoModal({ isOpen, onClose, asset, holding }: SellCryptoModalProps) {
  const reducedMotion = useReducedMotion();
  const modalRef = useRef<HTMLDivElement>(null);
  const [pct, setPct] = useState<number>(100);
  const sellCrypto = useAppStore((s) => s.sellCrypto);

  const holdingValue = holding.quantity * asset.price;
  const sellValue = Math.round(holdingValue * (pct / 100) * 100) / 100;
  const sellQty = holding.quantity * (pct / 100);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    modalRef.current?.focus();
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  const handleSell = () => {
    sellCrypto(asset.id, sellValue);
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
            aria-label={`Sell ${asset.name}`}
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
                  Sell {asset.name}
                </h2>
                <p className="mt-1 font-mono text-sm text-ink-tertiary">
                  You own {holding.quantity.toFixed(6)} {asset.symbol} (~${holdingValue.toFixed(2)})
                </p>
              </div>

              <div className="mb-5 grid grid-cols-4 gap-2">
                {PERCENTAGES.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPct(p)}
                    className={`cursor-pointer rounded-[var(--radius-button)] border py-3 text-center font-mono text-sm transition-all duration-150 ${
                      pct === p
                        ? "border-accent-ink bg-accent-highlight text-accent-ink"
                        : "border-border-soft text-ink-secondary hover:border-border-firm"
                    }`}
                  >
                    {p}%
                  </button>
                ))}
              </div>

              <p className="mb-5 text-center text-[13px] text-ink-secondary">
                Selling {sellQty.toFixed(6)} {asset.symbol} for ~${sellValue.toFixed(2)}
              </p>

              <button
                onClick={handleSell}
                className="mb-4 w-full cursor-pointer rounded-[var(--radius-card)] bg-accent-ink py-3.5 text-[15px] font-medium text-bg-canvas transition-transform hover:-translate-y-px"
              >
                Sell ${sellValue.toFixed(2)} of {asset.name}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
