"use client";

import { useState, useCallback, useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useAppStore } from "@/lib/stores/app-store";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { StepWelcome } from "@/components/onboarding/step-welcome";
import { StepTopics } from "@/components/onboarding/step-topics";
import { StepPractice } from "@/components/onboarding/step-practice";
import { StepMoney } from "@/components/onboarding/step-money";
import type { Topic } from "@/types";

const EASE_OUT_QUART = [0.22, 1, 0.36, 1] as const;

const subscribeHydration = (onChange: () => void) =>
  useAppStore.persist.onFinishHydration(onChange);
const getHydratedSnapshot = () => useAppStore.persist.hasHydrated();
const getServerHydratedSnapshot = () => false;

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  // SSR-safe hydration signal: server snapshot is always false, client reads
  // the live persist flag and updates when hydration finishes. Without this
  // we'd bounce out on the first render using the default initialUser state
  // (onboardingComplete: true) before localStorage is read.
  const hydrated = useSyncExternalStore(
    subscribeHydration,
    getHydratedSnapshot,
    getServerHydratedSnapshot,
  );
  const router = useRouter();
  const onboardingComplete = useAppStore((s) => s.user.onboardingComplete);
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  const selectTopics = useAppStore((s) => s.selectTopics);
  const reducedMotion = useReducedMotion();

  // Mirror of OnboardingGuard, inverted: once hydrated, if the user already
  // finished onboarding, the "$10" copy no longer matches their actual balance.
  useEffect(() => {
    if (hydrated && onboardingComplete) {
      router.replace("/");
    }
  }, [hydrated, onboardingComplete, router]);

  const advance = useCallback(() => setStep((s) => s + 1), []);

  const handleTopics = useCallback(
    (topics: Topic[]) => {
      selectTopics(topics);
      advance();
    },
    [selectTopics, advance],
  );

  const handleStart = useCallback(() => {
    completeOnboarding();
    router.push("/");
  }, [completeOnboarding, router]);

  const motionProps = reducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -12 },
        transition: { duration: 0.32, ease: EASE_OUT_QUART },
      };

  if (!hydrated || onboardingComplete) {
    return null;
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden pt-20 md:pt-24">
      {/* Step dots */}
      <div className="absolute left-1/2 top-10 z-10 flex -translate-x-1/2 gap-1.5">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              s === step
                ? "w-6 bg-accent-ink"
                : "w-1.5 bg-border-firm"
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="welcome" {...motionProps}>
            <StepWelcome onContinue={advance} />
          </motion.div>
        )}
        {step === 2 && (
          <motion.div key="topics" {...motionProps}>
            <StepTopics onContinue={handleTopics} />
          </motion.div>
        )}
        {step === 3 && (
          <motion.div key="practice" {...motionProps}>
            <StepPractice onContinue={advance} />
          </motion.div>
        )}
        {step === 4 && (
          <motion.div key="money" {...motionProps}>
            <StepMoney onStart={handleStart} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
