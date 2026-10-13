import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number;
  className?: string;
  trackClassName?: string;
  indicatorClassName?: string;
  label?: string;
}

export function Progress({
  value,
  className,
  trackClassName,
  indicatorClassName,
  label,
}: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("w-full", className)}>
      {label ? (
        <div className="mb-1.5 flex items-center justify-between text-xs text-ink/60">
          <span>{label}</span>
          <span>{clamped}%</span>
        </div>
      ) : null}
      <div
        className={cn(
          "h-2 overflow-hidden rounded-full bg-brand-purple/10",
          trackClassName,
        )}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={cn(
            "h-full rounded-full bg-gradient-to-r from-brand-purple to-brand-pink transition-[width] duration-500 ease-out",
            indicatorClassName,
          )}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
