import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

const fieldBase =
  "w-full rounded-xl border border-line bg-white px-3.5 text-sm text-ink shadow-[inset_0_1px_2px_rgba(23,57,94,0.04)] outline-none transition placeholder:text-muted/80 focus:border-brand focus:ring-4 focus:ring-brand/15 disabled:bg-surface aria-[invalid=true]:border-danger aria-[invalid=true]:ring-danger/10";

export function Label({
  children,
  required,
  htmlFor,
  className,
  hint,
}: {
  children: ReactNode;
  required?: boolean;
  htmlFor?: string;
  className?: string;
  hint?: ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className={cn("mb-1.5 flex items-center justify-between gap-2 text-[13px] font-semibold text-ink", className)}>
      <span>
        {children}
        {required && <span className="ml-0.5 text-danger" aria-hidden>*</span>}
      </span>
      {hint && <span className="text-xs font-normal text-muted">{hint}</span>}
    </label>
  );
}

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(fieldBase, "h-10", className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cn(fieldBase, "min-h-[96px] py-2.5 leading-relaxed", className)} {...props} />;
}

export function Select({ className, children, ...props }: ComponentProps<"select">) {
  return (
    <select
      className={cn(
        fieldBase,
        "h-10 cursor-pointer appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2373849B%22 stroke-width=%222.5%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[length:12px] bg-[right_14px_center] bg-no-repeat pr-9",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-1.5 text-xs font-medium text-danger-ink">
      {message}
    </p>
  );
}

export function Field({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("min-w-0", className)}>{children}</div>;
}

export function Checkbox({
  checked,
  onChange,
  label,
  description,
  id,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: ReactNode;
  description?: ReactNode;
  id: string;
}) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-white p-3.5 transition hover:border-brand/40">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[#2563d6]"
      />
      <span>
        <span className="block text-sm font-semibold text-ink">{label}</span>
        {description && <span className="mt-0.5 block text-[13px] leading-relaxed text-muted-strong">{description}</span>}
      </span>
    </label>
  );
}

export function Switch({
  checked,
  onChange,
  label,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:opacity-60",
        checked ? "bg-[#2563d6]" : "bg-[#cfdbe8]",
      )}
    >
      <span className={cn("inline-block h-5 w-5 rounded-full bg-white shadow transition-transform", checked ? "translate-x-5" : "translate-x-0.5")} />
    </button>
  );
}
