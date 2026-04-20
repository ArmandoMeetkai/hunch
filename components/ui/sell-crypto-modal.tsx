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
  const [customUSD, setCustomUSD] = useState("");
  const [mode, setMode] = useState<"percent" | "custom">("percent");
  const [sold, setSold] = useState(false);
  const sellCrypto = useAppStore((s) => s.sellCrypto);

  const holdingValue = holding.quantity * asset.price;
  const costBasis = holding.quantity * holding.avgBuyPrice;

  // Calculate sell values based on mode
  const sellValueUSD =
    mode === "percent"
      ? Math.round(holdingValue * (pct / 100) * 100) / 100
      : Math.min(parseFloat(customUSD) || 0, holdingValue);
  const sellQty = sellValueUSD / asset.price;
  const sellPnl = sellValueUSD - (sellQty * holding.avgBuyPrice);
  const isProfit = sellPnl >= 0;

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setPct(100);
      setCustomUSD("");
      setMode("percent");
      setSold(false);
    }
  }, [isOpen]);

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
    if (sellValueUSD <= 0) return;
    sellCrypto(asset.id, sellValueUSD);
    setSold(true);
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

              {!sold ? (
                <>
                  {/* Header */}
                  <div className="mb-6 text-center">
                    <span className="font-serif text-5xl text-ink-tertiary">
                      {CRYPTO_GLYPHS[asset.id]}
                    </span>
                    <h2 className="mt-2 font-serif text-2xl italic text-ink-primary">
                      Sell {asset.name}
                    </h2>
                  </div>

                  {/* Holding summary */}
                  <div className="mb-5 rounded-xl bg-bg-sunken p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-ink-tertiary">You own</p>
                        <p className="mt-0.5 font-mono text-[15px] text-ink-primary">
                          {holding.quantity.toFixed(6)} {asset.symbol}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-[15px] text-ink-primary">${holdingValue.toFixed(2)}</p>
                        <p className={`font-mono text-[11px] ${holdingValue >= costBasis ? "text-accent-signal" : "text-accent-cool"}`}>
                          {holdingValue >= costBasis ? "↗ +" : "↘ "}${Math.abs(holdingValue - costBasis).toFixed(2)} total
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Mode toggle */}
                  <div className="mb-4 grid grid-cols-2 gap-1.5 rounded-[var(--radius-pill)] bg-bg-sunken p-1">
                    <button
                      onClick={() => setMode("percent")}
                      className={`cursor-pointer rounded-[var(--radius-pill)] px-3 py-2 text-center text-[13px] font-medium transition-all ${
                        mode === "percent" ? "bg-bg-canvas text-ink-primary shadow-sm" : "text-ink-tertiary"
                      }`}
                    >
                      By percentage
                    </button>
                    <button
                      onClick={() => setMode("custom")}
                      className={`cursor-pointer rounded-[var(--radius-pill)] px-3 py-2 text-center text-[13px] font-medium transition-all ${
                        mode === "custom" ? "bg-bg-canvas text-ink-primary shadow-sm" : "text-ink-tertiary"
                      }`}
                    >
                      By amount
                    </button>
                  </div>

                  {/* Percentage mode */}
                  {mode === "percent" && (
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
                  )}

                  {/* Custom USD mode */}
                  {mode === "custom" && (
                    <div className={`mb-5 flex items-center gap-2 rounded-[var(--radius-button)] border px-4 py-3 ${
                      customUSD !== "" ? "border-accent-ink bg-accent-highlight/30" : "border-border-soft bg-bg-sunken"
                    }`}>
                      <span className="font-mono text-sm text-ink-tertiary">$</span>
                      <input
                        type="text"
                        inputMode="decimal"
                        placeholder={`Up to ${holdingValue.toFixed(2)}`}
                        maxLength={8}
                        value={customUSD}
                        onChange={(e) => {
                          const raw = e.target.value.replace(/[^0-9.]/g, "").slice(0, 8);
                          setCustomUSD(raw);
                        }}
                        autoFocus
                        className="w-full bg-transparent font-mono text-sm text-ink-primary placeholder:text-ink-tertiary outline-none"
                      />
                    </div>
                  )}

                  {/* Sale preview */}
                  {sellValueUSD > 0 && (
                    <div className="mb-5 rounded-xl border border-border-soft p-4">
                      <div className="flex items-center justify-between text-[13px]">
                        <span className="text-ink-tertiary">Selling</span>
                        <span className="font-mono text-ink-primary">{sellQty.toFixed(6)} {asset.symbol}</span>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-[13px]">
                        <span className="text-ink-tertiary">You receive</span>
                        <span className="font-mono text-ink-primary">${sellValueUSD.toFixed(2)}</span>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-[13px]">
                        <span className="text-ink-tertiary">P&L on this sale</span>
                        <span className={`font-mono ${isProfit ? "text-accent-signal" : "text-accent-cool"}`}>
                          {isProfit ? "+" : ""}${sellPnl.toFixed(2)}
                        </span>
                      </div>
                      <div className="mt-3 border-t border-border-soft pt-3">
                        <p className="text-[12px] text-ink-tertiary">
                          Funds return to your dollar balance.
                        </p>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleSell}
                    disabled={sellValueUSD <= 0}
                    className="w-full cursor-pointer truncate rounded-[var(--radius-card)] bg-accent-ink py-3.5 text-[15px] font-medium text-bg-canvas transition-transform hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Sell ${sellValueUSD.toFixed(2)} of {asset.name}
                  </button>
                </>
              ) : (
                /* Post-sale success */
                <div className="py-4 text-center">
                  <span className="font-serif text-5xl text-ink-tertiary">
                    {CRYPTO_GLYPHS[asset.id]}
                  </span>
                  <h2 className="mt-3 font-serif text-2xl italic text-ink-primary">
                    Sale complete.
                  </h2>
                  <p className="mt-2 font-mono text-lg text-ink-secondary">
                    ${sellValueUSD.toFixed(2)} added to your balance
                  </p>
                  <p className={`mt-1 font-mono text-[13px] ${isProfit ? "text-accent-signal" : "text-accent-cool"}`}>
                    {isProfit ? "+" : ""}${sellPnl.toFixed(2)} realized
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-6 cursor-pointer rounded-[var(--radius-pill)] border border-border-firm px-6 py-3 text-sm font-medium text-ink-primary transition-colors hover:bg-bg-surface"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
