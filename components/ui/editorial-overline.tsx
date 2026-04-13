"use client";

type EditorialOverlineProps = {
  children: React.ReactNode;
  className?: string;
};

export function EditorialOverline({ children, className = "" }: EditorialOverlineProps) {
  return (
    <span
      className={`text-[11px] font-medium uppercase tracking-[0.12em] text-ink-tertiary ${className}`}
    >
      {children}
    </span>
  );
}
