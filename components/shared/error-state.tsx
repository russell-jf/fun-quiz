"use client";

import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "出了点小状况",
  description = "页面暂时无法加载，请稍后重试。",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-3xl border border-rose-200/70 bg-white/70 px-6 py-14 text-center shadow-soft",
        className,
      )}
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-500">
        <AlertCircle className="h-5 w-5" aria-hidden />
      </div>
      <h3 className="font-display text-lg text-ink">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink/60">
        {description}
      </p>
      {onRetry ? (
        <Button className="mt-6" onClick={onRetry} variant="secondary">
          重新加载
        </Button>
      ) : null}
    </div>
  );
}
