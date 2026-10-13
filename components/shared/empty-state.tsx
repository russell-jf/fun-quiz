import { Inbox } from "lucide-react";

import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description: string;
  className?: string;
}

export function EmptyState({ title, description, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-3xl border border-dashed border-brand-purple/20 bg-white/50 px-6 py-14 text-center",
        className,
      )}
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-purple/10 text-brand-purple">
        <Inbox className="h-5 w-5" aria-hidden />
      </div>
      <h3 className="font-display text-lg text-ink">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink/60">
        {description}
      </p>
    </div>
  );
}
