"use client";

import { useAppStore } from "@/lib/stores/app-store";
import { useLivePrice } from "@/hooks/use-live-price";
import { FeedHeader } from "@/components/feed-header";
import { StoryCard } from "@/components/ui/story-card";

export default function FeedPage() {
  const stories = useAppStore((s) => s.stories);
  const selectedTopics = useAppStore((s) => s.user.selectedTopics);
  const markets = useLivePrice();
  const feedStories = [...stories]
    .filter((s) => selectedTopics.length === 0 || selectedTopics.includes(s.topic))
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 10);

  return (
    <div className="mx-auto max-w-[680px] px-6 py-10">
      <FeedHeader />

      <div className="divide-y divide-border-soft">
        {feedStories.map((story) => {
          const market = markets.find((m) => m.id === story.marketId);
          if (!market) return null;
          return <StoryCard key={story.id} story={story} market={market} />;
        })}
      </div>

      {/* End of feed */}
      <div className="mt-12 flex flex-col items-center gap-3">
        <div className="h-px w-16 bg-border-soft" />
        <p className="font-serif text-lg italic text-ink-tertiary">
          You&apos;re all caught up.
        </p>
      </div>
    </div>
  );
}
