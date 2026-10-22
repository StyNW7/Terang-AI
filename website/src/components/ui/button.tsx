import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "soft" | "ghost" | "dark" | "light" | "glass" | "one" | "ace" | "danger";
type Size = "sm" | "md" | "lg" | "icon";

const variants: Record<Variant, string> = {
  primary:
    "text-white bg-[linear-gradient(135deg,#2a86e2_0%,#2563d6_55%,#1f4fc4_100%)] shadow-[0_8px_24px_-12px_rgba(37,99,214,0.75)] hover:shadow-[0_12px_30px_-12px_rgba(37,99,214,0.9)] hover:brightness-110",
  secondary: "bg-card text-ink border border-line shadow-soft hover:border-brand/45 hover:text-brand-ink",
  soft: "bg-soft text-brand-ink hover:bg-soft-strong",
  ghost: "text-muted-strong hover:text-ink hover:bg-neutral-soft",
  dark: "bg-ink text-card shadow-soft hover:opacity-90",
  light: "bg-white text-navy hover:bg-white/90 shadow-[0_10px_30px_-14px_rgba(0,0,0,0.45)]",
  glass: "bg-white/10 text-white border border-white/25 backdrop-blur hover:bg-white/20",
  one: "text-white bg-one-gradient shadow-[0_10px_30px_-14px_rgba(34,81,201,0.8)] hover:brightness-110",
  ace: "text-white bg-[linear-gradient(135deg,#0a8fc4_0%,#2563d6_100%)] shadow-[0_10px_30px_-14px_rgba(12,159,216,0.8)] hover:brightness-110",
  danger: "bg-danger-soft text-danger-ink hover:bg-danger-soft/70",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-[13px] gap-1.5 rounded-lg",
  md: "h-10 px-4 text-sm gap-2 rounded-xl",
  lg: "h-12 px-6 text-[15px] gap-2.5 rounded-xl",
  icon: "h-9 w-9 rounded-xl justify-center",
};

const base =
  "inline-flex items-center justify-center font-medium whitespace-nowrap transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children?: ReactNode;
}

type ButtonProps = CommonProps & Omit<ComponentProps<"button">, "className" | "children"> & { href?: undefined };
type LinkButtonProps = CommonProps & Omit<ComponentProps<typeof Link>, "className" | "children"> & { href: string };

export function buttonClasses(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

export function Button({ variant = "primary", size = "md", className, children, ...rest }: ButtonProps | LinkButtonProps) {
  const classes = buttonClasses(variant, size, className);
  if (rest.href !== undefined) {
    return (
      <Link {...(rest as Omit<LinkButtonProps, keyof CommonProps>)} className={classes}>
        {children}
      </Link>
    );
  }
  const { type = "button", ...buttonRest } = rest as Omit<ButtonProps, keyof CommonProps>;
  return (
    <button type={type} {...buttonRest} className={classes}>
      {children}
    </button>
  );
}
