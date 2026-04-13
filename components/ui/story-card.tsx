"use client";

import Link from "next/link";
import type { Story, Market } from "@/types";
import { EditorialOverline } from "./editorial-overline";
import { MarketStrip } from "./market-strip";
import { formatRelativeTime } from "@/lib/price-utils";

type StoryCardProps = {
  story: Story;
  market: Market;
};

function renderTitle(title: string) {
  const parts = title.split(/(\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <em key={i} className="italic">
          {part.slice(1, -1)}
        </em>
      );
    }
    return part;
  });
}

export function StoryCard({ story, market }: StoryCardProps) {
  return (
    <article className="py-8">
      <div className="mb-3 flex items-center gap-2">
        <EditorialOverline>
          {story.topic.charAt(0).toUpperCase() + story.topic.slice(1)}
        </EditorialOverline>
        <span className="text-[13px] text-ink-tertiary">
          · {formatRelativeTime(story.publishedAt)}
        </span>
      </div>

      <Link href={`/story/${story.id}`} className="group block">
        <h2 className="mb-3 font-serif text-[32px] leading-[1.1] tracking-[-0.01em] text-ink-primary transition-colors group-hover:text-accent-ink">
          {renderTitle(story.title)}
        </h2>
      </Link>

      <p className="mb-5 max-w-[600px] text-[17px] leading-[1.55] text-ink-secondary line-clamp-2">
        {story.summary}
      </p>

      <MarketStrip market={market} storyId={story.id} />
    </article>
  );
}
