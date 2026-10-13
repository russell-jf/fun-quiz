"use client";

import Link from "next/link";
import { Clock3, Heart, Sparkles } from "lucide-react";
import { motion } from "motion/react";

import type { TestCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

const iconMap = {
  sparkles: Sparkles,
  heart: Heart,
  clock: Clock3,
} as const;

interface CategoryCardProps {
  category: TestCategory;
  testCount: number;
  index?: number;
}

export function CategoryCard({
  category,
  testCount,
  index = 0,
}: CategoryCardProps) {
  const Icon = iconMap[category.icon];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
    >
      <Link
        href={`/#featured`}
        className={cn(
          "group relative block overflow-hidden rounded-3xl border border-white/70 bg-white/65 p-5 shadow-soft transition-transform duration-200 hover:-translate-y-0.5",
        )}
        aria-label={`查看${category.name}相关测评`}
      >
        <div
          className={cn(
            "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-70",
            category.accent,
          )}
        />
        <div className="relative">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/80 text-brand-purple-deep shadow-sm">
            <Icon className="h-5 w-5" aria-hidden />
          </div>
          <h3 className="font-display text-xl text-ink">{category.name}</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink/65">
            {category.description}
          </p>
          <p className="mt-4 text-xs font-medium text-ink/50">
            {testCount} 个测评
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
