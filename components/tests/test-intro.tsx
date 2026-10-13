"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, Clock3, ListChecks, Play, Users } from "lucide-react";
import { motion } from "motion/react";

import { TestCard } from "@/components/tests/test-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { QuizTest, TestCategory } from "@/lib/types";

interface TestIntroProps {
  test: QuizTest;
  category?: TestCategory;
  related: QuizTest[];
  playable: boolean;
}

export function TestIntro({
  test,
  category,
  related,
  playable,
}: TestIntroProps) {
  const isComingSoon = test.status === "coming_soon" || !playable;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
      <Link
        href="/#featured"
        className="inline-flex items-center gap-1.5 text-sm text-ink/55 transition-colors hover:text-brand-purple"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        返回测评列表
      </Link>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mt-5 overflow-hidden rounded-[2rem] border border-brand-purple/10 bg-white/75 shadow-lift"
      >
        <div
          className={`bg-gradient-to-br px-5 py-8 sm:px-8 ${test.coverGradient}`}
        >
          <div className="flex flex-wrap gap-2">
            {category ? <Badge variant="cream">{category.name}</Badge> : null}
            {test.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
          <h1 className="mt-4 font-display text-3xl leading-tight text-ink sm:text-4xl">
            {test.title}
          </h1>
          <p className="mt-2 text-base text-ink/65">{test.subtitle}</p>
        </div>

        <div className="space-y-6 px-5 py-6 sm:px-8 sm:py-8">
          <p className="text-sm leading-relaxed text-ink/70 sm:text-base">
            {test.description}
          </p>

          <div className="grid gap-3 sm:grid-cols-3">
            <MetaTile
              icon={<Clock3 className="h-4 w-4" />}
              label="预计用时"
              value={`约 ${test.estimatedMinutes} 分钟`}
            />
            <MetaTile
              icon={<ListChecks className="h-4 w-4" />}
              label="题目数量"
              value={`${test.questionCount} 题`}
            />
            <MetaTile
              icon={<Users className="h-4 w-4" />}
              label="当前状态"
              value={isComingSoon ? "即将上线" : "可开始答题"}
            />
          </div>

          {isComingSoon ? (
            <div className="rounded-2xl bg-cream-deep/70 px-4 py-4">
              <p className="text-sm leading-relaxed text-ink/65">
                这套测评仍在准备题库，完成后会开放正式答题。你可以先浏览其他已上线的趣味测评。
              </p>
              <Button asChild className="mt-4" variant="secondary">
                <Link href="/#featured">看看别的测评</Link>
              </Button>
            </div>
          ) : (
            <div className="rounded-2xl bg-gradient-to-r from-brand-purple/10 to-brand-pink/15 px-4 py-5">
              <p className="text-sm leading-relaxed text-ink/70">
                题目均为单选，答完即出结果。可随时返回上一题修改，结果支持复制分享。
              </p>
              <Button asChild className="mt-4 w-full sm:w-auto" variant="soft" size="lg">
                <Link href={`/tests/${test.slug}/play`}>
                  <Play className="h-4 w-4" aria-hidden />
                  开始测评
                </Link>
              </Button>
            </div>
          )}

          <div>
            <h2 className="font-display text-xl text-ink">你会获得什么</h2>
            <ul className="mt-3 space-y-2">
              {test.highlights.map((item) => (
                <li
                  key={item}
                  className="rounded-2xl bg-white/80 px-4 py-3 text-sm text-ink/70 ring-1 ring-brand-purple/8"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-display text-xl text-ink">适合谁来测</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {test.suitableFor.map((item) => (
                <Badge key={item} variant="pink">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {related.length > 0 ? (
        <section className="mt-10">
          <h2 className="font-display text-xl text-ink">相关测评</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {related.map((item, index) => (
              <TestCard key={item.id} test={item} index={index} compact />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function MetaTile({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-cream-deep/80 px-4 py-3">
      <div className="flex items-center gap-1.5 text-brand-purple">
        {icon}
        <span className="text-xs text-ink/50">{label}</span>
      </div>
      <p className="mt-1.5 text-sm font-medium text-ink">{value}</p>
    </div>
  );
}
