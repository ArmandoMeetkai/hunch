"use client";

import { use } from "react";
import Link from "next/link";
import { useAppStore } from "@/lib/stores/app-store";
import { useLivePrice } from "@/hooks/use-live-price";
import { EditorialOverline } from "@/components/ui/editorial-overline";
import { StickyMarketModule } from "@/components/sticky-market-module";

export default function StoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const story = useAppStore((s) => s.getStory(id));
  const markets = useLivePrice();
  const market = markets.find((m) => m.storyId === id);

  if (!story || !market) {
    return (
      <div className="mx-auto max-w-[680px] px-6 py-20 text-center">
        <p className="font-serif text-2xl italic text-ink-tertiary">
          Story not found.
        </p>
        <Link href="/" className="mt-4 inline-block text-sm text-accent-ink underline">
          ← Back to feed
        </Link>
      </div>
    );
  }

  const topicLabel =
    story.topic.charAt(0).toUpperCase() + story.topic.slice(1);
  const dateStr = new Date(story.publishedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

  // Render title with italic markdown
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

  // Split body into paragraphs
  const paragraphs = story.body.split("\n\n").filter(Boolean);

  return (
    <div className="mx-auto max-w-[960px] px-6 py-10">
      {/* Header */}
      <header className="mb-10 flex items-center justify-between border-b border-border-soft pb-5">
        <Link
          href="/"
          className="font-serif text-[26px] italic tracking-[-0.01em] text-ink-primary"
        >
          Hunch
        </Link>
        <div className="flex items-center gap-5">
          <Link
            href="/"
            className="text-[11px] font-medium uppercase tracking-[0.12em] text-ink-tertiary hover:text-ink-secondary"
          >
            ← Back to feed
          </Link>
          <div className="grid h-8 w-8 place-items-center rounded-full bg-accent-highlight font-serif text-base text-accent-ink">
            A
          </div>
        </div>
      </header>

      {/* Article hero */}
      <div className="mb-12">
        <EditorialOverline>
          {topicLabel} · {dateStr} · 6 min read
        </EditorialOverline>
        <h1 className="mt-5 font-serif text-3xl leading-[1.1] tracking-[-0.015em] text-ink-primary sm:text-4xl md:text-5xl lg:text-7xl">
          {renderTitle(story.title)}
        </h1>
        <p className="mt-4 max-w-[600px] font-serif text-lg italic leading-[1.4] text-ink-secondary md:text-[22px]">
          {story.summary}
        </p>
      </div>

      {/* Article grid */}
      <div className="grid gap-10 lg:grid-cols-[1fr_320px] lg:gap-14">
        {/* Body */}
        <article className="max-w-[600px]">
          {paragraphs.map((p, i) => (
            <p
              key={i}
              className={`mb-5 text-lg leading-[1.7] text-ink-primary ${
                i === 0
                  ? "[&::first-letter]:float-left [&::first-letter]:mr-2 [&::first-letter]:mt-1 [&::first-letter]:font-serif [&::first-letter]:text-[56px] [&::first-letter]:leading-none [&::first-letter]:text-accent-ink"
                  : ""
              }`}
            >
              {p}
            </p>
          ))}
        </article>

        {/* Sticky market module */}
        <StickyMarketModule market={market} />
      </div>
    </div>
  );
}
