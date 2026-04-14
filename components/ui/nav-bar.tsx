"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Newspaper,
  Briefcase,
  Coins,
  Target,
  BookOpen,
  Settings,
} from "lucide-react";
import { motion } from "framer-motion";

const NAV_ITEMS = [
  { href: "/", label: "Feed", icon: Newspaper },
  { href: "/portfolio", label: "Portfolio", icon: Briefcase },
  { href: "/crypto", label: "Crypto", icon: Coins },
  { href: "/track-record", label: "Track", icon: Target },
  { href: "/learn", label: "Learn", icon: BookOpen },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

export function NavBar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile bottom nav */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-border-soft bg-bg-canvas/95 backdrop-blur-sm md:hidden"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-around px-2 py-2">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex flex-col items-center gap-1 px-3 py-1.5"
                aria-current={active ? "page" : undefined}
              >
                <Icon
                  size={20}
                  strokeWidth={1.5}
                  className={active ? "text-accent-ink" : "text-ink-tertiary"}
                />
                <span
                  className={`max-w-full truncate text-[10px] font-medium ${
                    active ? "text-accent-ink" : "text-ink-tertiary"
                  }`}
                >
                  {item.label}
                </span>
                {active && (
                  <motion.span
                    layoutId="nav-indicator-mobile"
                    className="absolute -top-0.5 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-accent-ink"
                    transition={{ type: "spring", stiffness: 260, damping: 28 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop sidebar */}
      <nav
        className="fixed left-0 top-0 z-40 hidden h-full w-28 flex-col items-center border-r border-border-soft bg-bg-canvas px-3 py-6 md:flex"
        role="navigation"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="mb-8 font-serif text-xl italic text-accent-ink"
          aria-label="Hunch home"
        >
          H
        </Link>

        <div className="flex flex-1 flex-col items-center gap-1 px-1">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative flex w-full flex-col items-center gap-1 rounded-xl px-2 py-2.5 transition-colors ${
                  active ? "bg-bg-sunken" : "hover:bg-bg-sunken"
                }`}
                aria-current={active ? "page" : undefined}
              >
                {active && (
                  <motion.span
                    layoutId="nav-indicator-desktop"
                    className="absolute -left-3 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-accent-ink"
                    transition={{ type: "spring", stiffness: 260, damping: 28 }}
                  />
                )}
                <Icon
                  size={20}
                  strokeWidth={1.5}
                  className={active ? "text-accent-ink" : "text-ink-tertiary group-hover:text-ink-secondary"}
                />
                <span
                  className={`max-w-full truncate text-[10px] font-medium ${
                    active ? "text-accent-ink" : "text-ink-tertiary"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
