"use client";

import { useId, type ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export interface TabItem<T extends string> {
  id: T;
  label: ReactNode;
  icon?: ReactNode;
  badge?: ReactNode;
}

/** Underline tabs for page-level sections. */
export function Tabs<T extends string>({
  items,
  value,
  onChange,
  className,
}: {
  items: TabItem<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}) {
  const layoutId = useId();
  return (
    <div className={cn("scrollbar-thin -mx-1 overflow-x-auto", className)}>
      <div role="tablist" className="flex min-w-max items-center gap-1 border-b border-line px-1">
        {items.map((item) => {
          const active = item.id === value;
          return (
            <button
              key={item.id}
              role="tab"
              type="button"
              aria-selected={active}
              onClick={() => onChange(item.id)}
              className={cn(
                "relative flex items-center gap-2 px-3 py-3 text-sm font-semibold transition-colors",
                active ? "text-brand-ink" : "text-muted hover:text-ink",
              )}
            >
              {item.icon}
              {item.label}
              {item.badge}
              {active && (
                <motion.span
                  layoutId={`tab-${layoutId}`}
                  className="absolute inset-x-2 -bottom-px h-[2.5px] rounded-full bg-brand-gradient"
                  transition={{ type: "spring", stiffness: 500, damping: 40 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Pill segmented control. */
export function Segmented<T extends string>({
  items,
  value,
  onChange,
  className,
  size = "md",
  dark,
}: {
  items: TabItem<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  size?: "sm" | "md";
  dark?: boolean;
}) {
  const layoutId = useId();
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex items-center gap-1 rounded-xl p-1",
        dark ? "bg-white/10 ring-1 ring-white/15" : "bg-[#eef4fb] ring-1 ring-line",
        className,
      )}
    >
      {items.map((item) => {
        const active = item.id === value;
        return (
          <button
            key={item.id}
            role="tab"
            type="button"
            aria-selected={active}
            onClick={() => onChange(item.id)}
            className={cn(
              "relative flex items-center gap-1.5 rounded-lg font-semibold transition-colors",
              size === "sm" ? "px-2.5 py-1 text-xs" : "px-3.5 py-1.5 text-[13px]",
              active ? (dark ? "text-navy" : "text-ink") : dark ? "text-white/75 hover:text-white" : "text-muted hover:text-ink",
            )}
          >
            {active && (
              <motion.span
                layoutId={`seg-${layoutId}`}
                className={cn("absolute inset-0 rounded-lg shadow-soft", dark ? "bg-white" : "bg-white")}
                transition={{ type: "spring", stiffness: 500, damping: 38 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {item.icon}
              {item.label}
              {item.badge}
            </span>
          </button>
        );
      })}
    </div>
  );
}
