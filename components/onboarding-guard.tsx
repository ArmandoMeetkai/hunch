"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/stores/app-store";
import { usePositionResolver } from "@/hooks/use-position-resolver";

export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const onboardingComplete = useAppStore((s) => s.user.onboardingComplete);
  const router = useRouter();

  // Resolve predictions that are older than 60 seconds
  usePositionResolver();

  useEffect(() => {
    if (!onboardingComplete) {
      router.replace("/onboarding");
    }
  }, [onboardingComplete, router]);

  if (!onboardingComplete) {
    return null;
  }

  return <>{children}</>;
}
