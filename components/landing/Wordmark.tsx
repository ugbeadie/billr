import Image from "next/image";
import { cn } from "@/lib/utils";

export default function Wordmark({
  size = "sm",
  className,
}: {
  size?: "sm" | "lg";
  className?: string;
}) {
  const px = size === "lg" ? 40 : 24;

  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <Image
        src="/images/logo.png"
        alt=""
        aria-hidden
        width={px}
        height={px}
        priority={size === "sm"}
        className={size === "lg" ? "h-9 w-9 sm:h-10 sm:w-10" : "h-6 w-6"}
      />
      <span
        className={cn(
          "font-bold text-[#111827] tracking-[-0.045em] leading-none",
          size === "lg" ? "text-4xl sm:text-5xl" : "text-xl",
        )}
      >
        trackr
      </span>
    </span>
  );
}
