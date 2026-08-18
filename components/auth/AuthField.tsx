import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Label, input and error wired together: htmlFor, autoComplete, aria-describedby. */
export default function AuthField({
  id,
  name,
  label,
  type = "text",
  placeholder,
  defaultValue,
  autoComplete,
  error,
  children,
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string;
  autoComplete?: string;
  error?: string;
  /** Rendered inside the input wrapper — the password visibility toggle. */
  children?: ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-[#111827]"
      >
        {label}
      </label>

      <div className="relative mt-1.5">
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          defaultValue={defaultValue}
          autoComplete={autoComplete}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(
            "h-11 w-full rounded-lg border bg-white px-3.5 text-sm text-[#111827] outline-none transition-colors placeholder:text-[#9CA3AF]",
            "focus:border-[#3A9AFF] focus:ring-2 focus:ring-[#3A9AFF]/25",
            children && "pr-11",
            error
              ? "border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/25"
              : "border-[#E5E7EB]",
          )}
        />
        {children}
      </div>

      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-[#DC2626]">
          {error}
        </p>
      )}
    </div>
  );
}
