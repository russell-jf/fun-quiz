import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
}

export function LoadingSkeleton({ className }: LoadingSkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-2xl bg-gradient-to-r from-brand-purple/10 via-brand-pink/15 to-brand-purple/10",
        className,
      )}
    />
  );
}

export function HomeLoadingSkeleton() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-8 px-4 py-6 sm:px-6">
      <LoadingSkeleton className="h-56 w-full rounded-[2rem]" />
      <div className="grid gap-4 sm:grid-cols-3">
        <LoadingSkeleton className="h-36" />
        <LoadingSkeleton className="h-36" />
        <LoadingSkeleton className="h-36" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <LoadingSkeleton className="h-48" />
        <LoadingSkeleton className="h-48" />
      </div>
    </div>
  );
}

export function TestIntroLoadingSkeleton() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-6 sm:px-6">
      <LoadingSkeleton className="h-8 w-28" />
      <LoadingSkeleton className="h-52 w-full rounded-[2rem]" />
      <LoadingSkeleton className="h-10 w-3/4" />
      <LoadingSkeleton className="h-24 w-full" />
      <div className="grid gap-3 sm:grid-cols-3">
        <LoadingSkeleton className="h-20" />
        <LoadingSkeleton className="h-20" />
        <LoadingSkeleton className="h-20" />
      </div>
    </div>
  );
}
