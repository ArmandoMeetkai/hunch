"use client";

import { motion } from "framer-motion";
import type { Side } from "@/types";

type PillToggleProps = {
  value: Side;
  onChange: (value: Side) => void;
  layoutId?: string;
};

export function PillToggle({ value, onChange, layoutId = "pill-toggle" }: PillToggleProps) {
  return (
    <div
      className="grid grid-cols-2 gap-1.5 rounded-[999px] bg-bg-sunken p-1"
      role="radiogroup"
      aria-label="Choose Yes or No"
    >
      {(["yes", "no"] as const).map((side) => (
        <button
          key={side}
          role="radio"
          aria-checked={value === side}
          onClick={() => onChange(side)}
          className="relative cursor-pointer rounded-[999px] px-4 py-2.5 text-center text-sm font-medium transition-colors"
          style={{ color: value === side ? "var(--color-ink-primary)" : "var(--color-ink-secondary)" }}
        >
          {value === side && (
            <motion.span
              layoutId={layoutId}
              className="absolute inset-0 rounded-[999px] bg-bg-canvas shadow-sm"
              style={{ boxShadow: "0 2px 8px -2px rgba(28,26,23,0.1)" }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
            />
          )}
          <span className="relative z-10 capitalize">{side}</span>
        </button>
      ))}
    </div>
  );
}
