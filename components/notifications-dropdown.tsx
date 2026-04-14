"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import { useAppStore } from "@/lib/stores/app-store";
import { EditorialOverline } from "@/components/ui/editorial-overline";

export function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const notifications = useAppStore((s) => s.notifications);
  const markAllRead = useAppStore((s) => s.markAllNotificationsRead);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen]);

  const handleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen && unreadCount > 0) {
      markAllRead();
    }
  };

  function timeAgo(timestamp: string) {
    const diff = Date.now() - new Date(timestamp).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={handleOpen}
        className="relative cursor-pointer grid h-8 w-8 place-items-center rounded-full transition-colors hover:bg-bg-sunken"
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
      >
        <Bell size={18} strokeWidth={1.5} className="text-ink-tertiary" />
        {unreadCount > 0 && (
          <span className="absolute right-0.5 top-0.5 h-2 w-2 rounded-full bg-accent-signal" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-[calc(100vw-2rem)] max-w-80 overflow-hidden rounded-2xl border border-border-soft bg-bg-surface shadow-[0_8px_24px_-8px_rgba(28,26,23,0.12)] z-50 md:w-80">
          <div className="border-b border-border-soft px-5 py-3.5">
            <EditorialOverline>Notifications</EditorialOverline>
          </div>

          <div className="max-h-[360px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center py-10 text-center px-5">
                <Bell size={20} strokeWidth={1} className="text-border-firm mb-3" />
                <p className="font-serif text-[15px] italic text-ink-tertiary">
                  Nothing yet.
                </p>
                <p className="mt-1 text-[13px] text-ink-tertiary">
                  Updates appear when your hunches resolve.
                </p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => {
                    if (n.href) {
                      router.push(n.href);
                      setIsOpen(false);
                    }
                  }}
                  className={`border-b border-border-soft px-5 py-4 last:border-b-0 transition-colors ${
                    !n.read ? "bg-accent-highlight/15" : ""
                  } ${n.href ? "cursor-pointer hover:bg-bg-sunken" : ""}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[14px] leading-snug text-ink-primary">
                        {n.message}
                      </p>
                      {n.detail && (
                        <p className="mt-1 font-mono text-[12px] font-light tracking-[-0.02em] text-ink-secondary">
                          {n.detail}
                        </p>
                      )}
                    </div>
                    {!n.read && (
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-signal" />
                    )}
                  </div>
                  <p className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-ink-tertiary">
                    {timeAgo(n.timestamp)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
