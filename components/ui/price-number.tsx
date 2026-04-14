"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type PriceNumberProps = {
  value: number;
  size?: number;
  className?: string;
  colorize?: boolean;
};

function formatPrice(value: number): string {
  if (value >= 1000) {
    return value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  return value.toFixed(2);
}

export function PriceNumber({ value, size = 28, className = "", colorize = true }: PriceNumberProps) {
  const reducedMotion = useReducedMotion();
  const prevValue = useRef(value);
  const [direction, setDirection] = useState<"up" | "down" | "neutral">("neutral");

  useEffect(() => {
    if (value > prevValue.current) setDirection("up");
    else if (value < prevValue.current) setDirection("down");
    prevValue.current = value;
  }, [value]);

  const formatted = "$" + formatPrice(value);
  const chars = formatted.split("");

  const colorClass = !colorize
    ? "text-ink-primary"
    : direction === "up"
      ? "text-accent-signal"
      : direction === "down"
        ? "text-accent-cool"
        : "text-ink-primary";

  return (
    <span
      className={`inline-flex items-baseline font-mono font-light tracking-[-0.02em] ${colorClass} ${className}`}
      style={{ fontSize: `${size}px`, lineHeight: 1 }}
      aria-label={formatted}
    >
      {chars.map((char, i) => {
        const isStatic = char === "$" || char === "," || char === ".";
        if (isStatic) {
          return (
            <span key={`s-${i}`} style={{ width: char === "," ? `${size * 0.3}px` : undefined }}>
              {char}
            </span>
          );
        }
        return (
          <span
            key={i}
            className="relative inline-block overflow-hidden"
            style={{ height: `${size}px`, width: `${size * 0.62}px` }}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={`${i}-${char}`}
                className="absolute inset-0 flex items-center justify-center"
                initial={
                  reducedMotion
                    ? false
                    : { y: direction === "up" ? size : -size, opacity: 0 }
                }
                animate={{ y: 0, opacity: 1 }}
                exit={
                  reducedMotion
                    ? { opacity: 0 }
                    : { y: direction === "up" ? -size : size, opacity: 0 }
                }
                transition={
                  reducedMotion ? { duration: 0 } : { duration: 0.35, ease: [0.22, 1, 0.36, 1] }
                }
              >
                {char}
              </motion.span>
            </AnimatePresence>
          </span>
        );
      })}
    </span>
  );
}
