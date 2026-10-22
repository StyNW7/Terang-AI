import type { ReactNode } from "react";
import { AlertTriangle, CheckCircle2, Info, OctagonAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  dark,
  action,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
  dark?: boolean;
  action?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
        align === "center" && "items-center text-center md:flex-col md:items-center",
        className,
      )}
    >
      <div className={cn("max-w-3xl", align === "center" && "mx-auto")}>
        {eyebrow && (
          <div
            className={cn(
              "eyebrow mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1",
              dark ? "bg-white/10 text-sky ring-1 ring-white/15" : "bg-soft text-brand-ink ring-1 ring-brand/15",
            )}
          >
            <span className={cn("h-1.5 w-1.5 rounded-full", dark ? "bg-sky" : "bg-brand")} />
            {eyebrow}
          </div>
        )}
        <h2 className={cn("text-[1.85rem] font-bold leading-[1.15] sm:text-4xl md:text-[2.5rem]", dark ? "text-white" : "text-ink")}>{title}</h2>
        {description && (
          <p className={cn("mt-4 max-w-2xl text-base leading-relaxed md:text-[17px]", align === "center" && "mx-auto", dark ? "text-white/70" : "text-muted-strong")}>{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function Progress({
  value,
  tone = "brand",
  className,
  height = "h-2",
}: {
  value: number; // 0..1 (can exceed 1)
  tone?: "brand" | "sky" | "one" | "ace" | "success" | "warning" | "danger" | "auto";
  className?: string;
  height?: string;
}) {
  const v = Math.max(0, value);
  const resolved = tone === "auto" ? (v > 1 ? "danger" : v > 0.9 ? "warning" : "success") : tone;
  const colors: Record<string, string> = {
    brand: "bg-brand-gradient",
    sky: "bg-sky",
    one: "bg-one-gradient",
    ace: "bg-ace-gradient",
    success: "bg-success",
    warning: "bg-warning",
    danger: "bg-danger",
  };
  return (
    <div className={cn("w-full overflow-hidden rounded-full bg-track", height, className)}>
      <div
        className={cn("h-full rounded-full transition-[width] duration-700 ease-out", colors[resolved])}
        style={{ width: `${Math.min(100, v * 100)}%` }}
      />
    </div>
  );
}

const CALLOUT = {
  info: { Icon: Info, className: "border-brand/20 bg-soft/70 text-ink", icon: "text-brand-ink" },
  success: { Icon: CheckCircle2, className: "border-current/15 bg-success-soft text-success-ink", icon: "text-success" },
  warning: { Icon: AlertTriangle, className: "border-current/15 bg-warning-soft text-warning-ink", icon: "text-warning" },
  danger: { Icon: OctagonAlert, className: "border-current/15 bg-danger-soft text-danger-ink", icon: "text-danger" },
};

export function Callout({
  tone = "info",
  title,
  children,
  className,
  icon,
}: {
  tone?: keyof typeof CALLOUT;
  title?: ReactNode;
  children?: ReactNode;
  className?: string;
  icon?: ReactNode;
}) {
  const { Icon, className: c, icon: ic } = CALLOUT[tone];
  return (
    <div className={cn("flex gap-3 rounded-2xl border p-4 text-[13.5px] leading-relaxed", c, className)}>
      <span className={cn("mt-0.5 shrink-0", ic)}>{icon ?? <Icon className="h-[18px] w-[18px]" />}</span>
      <div className="min-w-0">
        {title && <p className="font-semibold">{title}</p>}
        {children && <div className={cn(title && "mt-0.5")}>{children}</div>}
      </div>
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-surface px-6 py-12 text-center", className)}>
      {icon && <div className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-soft text-brand-ink">{icon}</div>}
      <p className="font-semibold text-ink">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-muted-strong">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function IconBox({
  children,
  tone = "brand",
  size = "md",
  className,
}: {
  children: ReactNode;
  tone?: "brand" | "sky" | "one" | "ace" | "navy" | "white" | "success" | "warning" | "danger";
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const tones = {
    brand: "bg-soft text-brand-ink",
    sky: "bg-sky-soft text-sky-ink",
    one: "bg-one-soft text-one-ink",
    ace: "bg-ace-soft text-ace-ink",
    navy: "bg-ink text-card",
    white: "bg-white/12 text-white ring-1 ring-white/20",
    success: "bg-success-soft text-success",
    warning: "bg-warning-soft text-warning-ink",
    danger: "bg-danger-soft text-danger-ink",
  };
  const sizes = { sm: "h-8 w-8 rounded-lg", md: "h-10 w-10 rounded-xl", lg: "h-12 w-12 rounded-2xl" };
  return <div className={cn("grid shrink-0 place-items-center", tones[tone], sizes[size], className)}>{children}</div>;
}

export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-flex h-6 min-w-6 items-center justify-center rounded-md border border-line bg-card px-1.5 text-[11px] font-semibold text-muted-strong shadow-[0_1px_0_var(--color-line)]">
      {children}
    </kbd>
  );
}
