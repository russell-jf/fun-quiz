"use client";

import Link from "next/link";
import { ArrowUpRight, Clock3, ListChecks } from "lucide-react";
import { motion } from "motion/react";

import { Badge } from "@/components/ui/badge";
import { getCategoryById } from "@/lib/tests";
import type { QuizTest } from "@/lib/types";
import { cn } from "@/lib/utils";

interface TestCardProps {
  test: QuizTest;
  index?: number;
  compact?: boolean;
}

export function TestCard({ test, index = 0, compact = false }: TestCardProps) {
  const category = getCategoryById(test.categoryId);
  const isComingSoon = test.status === "coming_soon";

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className={cn(
        "group overflow-hidden rounded-3xl border border-brand-purple/10 bg-white/75 shadow-soft transition-shadow duration-200 hover:shadow-lift",
        compact && "rounded-2xl",
      )}
    >
      <Link
        href={`/tests/${test.slug}`}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple/40"
      >
        <div
          className={cn(
            "relative bg-gradient-to-br px-5 py-6",
            test.coverGradient,
            compact ? "min-h-[112px]" : "min-h-[132px]",
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-wrap gap-1.5">
              {category ? (
                <Badge variant="cream">{category.name}</Badge>
              ) : null}
              {isComingSoon ? (
                <Badge variant="pink">即将上线</Badge>
              ) : test.slug === "husband-score-check" ? (
                <Badge variant="pink">首推</Badge>
              ) : (
                <Badge>可开始测评</Badge>
              )}
            </div>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/70 text-ink/70 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </span>
          </div>
          <h3
            className={cn(
              "mt-4 font-display text-ink",
              compact ? "text-lg" : "text-xl sm:text-2xl",
            )}
          >
            {test.title}
          </h3>
          <p className="mt-1.5 text-sm text-ink/65">{test.subtitle}</p>
        </div>

        <div className={cn("space-y-3 px-5", compact ? "py-4" : "py-5")}>
          <p className="line-clamp-2 text-sm leading-relaxed text-ink/60">
            {test.description}
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-ink/50">
            <span className="inline-flex items-center gap-1">
              <Clock3 className="h-3.5 w-3.5" aria-hidden />
              约 {test.estimatedMinutes} 分钟
            </span>
            <span className="inline-flex items-center gap-1">
              <ListChecks className="h-3.5 w-3.5" aria-hidden />
              {test.questionCount} 题
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {test.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
