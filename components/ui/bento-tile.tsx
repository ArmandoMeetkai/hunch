"use client";

type BentoTileProps = {
  span?: "1x1" | "2x1" | "1x2" | "2x2";
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

const spanClasses: Record<NonNullable<BentoTileProps["span"]>, string> = {
  "1x1": "",
  "2x1": "col-span-2",
  "1x2": "row-span-2",
  "2x2": "col-span-2 row-span-2",
};

export function BentoTile({
  span = "1x1",
  children,
  className = "",
  onClick,
}: BentoTileProps) {
  return (
    <div
      onClick={onClick}
      className={`flex flex-col justify-between overflow-hidden rounded-2xl border border-border-soft bg-bg-surface p-5 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-8px_rgba(28,26,23,0.08)] ${
        onClick ? "cursor-pointer" : ""
      } ${spanClasses[span]} ${className}`}
    >
      {children}
    </div>
  );
}
