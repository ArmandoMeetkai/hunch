"use client";

import { useEffect } from "react";
import { useAppStore } from "@/lib/stores/app-store";

const CHECK_INTERVAL_MS = 10_000; // Check every 10 seconds

export function usePositionResolver() {
  const resolveOldPositions = useAppStore((s) => s.resolveOldPositions);

  useEffect(() => {
    const id = setInterval(resolveOldPositions, CHECK_INTERVAL_MS);
    return () => clearInterval(id);
  }, [resolveOldPositions]);
}
