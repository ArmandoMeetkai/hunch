"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/stores/app-store";
import { useLivePrice } from "@/hooks/use-live-price";
import { FeedHeader } from "@/components/feed-header";
import { StoryCard } from "@/components/ui/story-card";
import type { Topic } from "@/types";

export default function FeedPage() {
  const stories = useAppStore((s) => s.stories);
  const selectedTopics = useAppStore((s) => s.user.selectedTopics);
  const markets = useLivePrice();
  const [activeFilter, setActiveFilter] = useState<Topic | "all">("all");

  const feedStories = [...stories]
    .filter((s) => {
      // First: only topics from onboarding (or all if none selected)
      if (selectedTopics.length > 0 && !selectedTopics.includes(s.topic)) return false;
      // Then: apply active filter pill
      if (activeFilter !== "all" && s.topic !== activeFilter) return false;
      return true;
    })
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 12);

  // Build filter options from selected topics
  const filterOptions: (Topic | "all")[] = ["all", ...selectedTopics];

  return (
    <div className="mx-auto max-w-[680px] px-6 py-10">
      <FeedHeader />

      {/* Topic filter pills */}
      {selectedTopics.length > 1 && (
        <div className="-mt-4 mb-8 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {filterOptions.map((topic) => {
            const isActive = activeFilter === topic;
            const label = topic === "all" ? "All" : topic.charAt(0).toUpperCase() + topic.slice(1);
            return (
              <button
                key={topic}
                onClick={() => setActiveFilter(topic)}
                className={`shrink-0 cursor-pointer rounded-[var(--radius-pill)] px-4 py-2 text-[13px] font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-accent-ink text-bg-canvas"
                    : "border border-border-soft bg-bg-surface text-ink-secondary hover:border-border-firm"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}

      <div className="divide-y divide-border-soft">
        {feedStories.map((story) => {
          const market = markets.find((m) => m.id === story.marketId);
          if (!market) return null;
          return <StoryCard key={story.id} story={story} market={market} />;
        })}
      </div>

      {feedStories.length === 0 && (
        <div className="py-20 text-center">
          <p className="font-serif text-lg italic text-ink-tertiary">
            No stories for this topic right now.
          </p>
        </div>
      )}

      {/* End of feed */}
      {feedStories.length > 0 && (
        <div className="mt-12 flex flex-col items-center gap-3">
          <div className="h-px w-16 bg-border-soft" />
          <p className="font-serif text-lg italic text-ink-tertiary">
            You&apos;re all caught up.
          </p>
        </div>
      )}
    </div>
  );
}
