"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Copy, RotateCcw, Share2 } from "lucide-react";
import { motion } from "motion/react";

import { TestCard } from "@/components/tests/test-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type {
  QuizResultProfile,
  QuizScoreBreakdown,
  QuizTest,
  ScoringMode,
} from "@/lib/types";

interface QuizResultViewProps {
  test: QuizTest;
  profile: QuizResultProfile;
  breakdown: QuizScoreBreakdown;
  scoring: ScoringMode;
  related: QuizTest[];
  fromSession: boolean;
  /** Max total for sum / hybrid progress display. */
  scoreCap?: number;
  scoreHint?: string;
  /** Per-dimension ceiling for bar width. */
  dimensionCap?: number;
  showDimensions?: boolean;
  showTotal?: boolean;
  passThreshold?: number;
}

const dimensionLabels: Record<string, string> = {
  sync: "同频",
  care: "体贴值",
  repair: "修复",
  gentle: "温柔",
  sharp: "机敏",
  steady: "稳定",
  secure: "安稳",
  anxious: "确认",
  avoidant: "边界",
  lively: "热闹",
  warm: "慢热",
  recharge: "回血",
  listen: "听劝值",
  chore: "家务值",
  romance: "仪式感",
  reliable: "靠谱值",
};

const dimensionRoasts: Record<string, { high: string; mid: string; low: string }> = {
  care: {
    high: "会疼人，不是纸面男友",
    mid: "偶发照顾，别太得意",
    low: "口头关心批发部",
  },
  listen: {
    high: "听得进，吵完还能修",
    mid: "听一半，悟一半",
    low: "已读不回现场版",
  },
  chore: {
    high: "动手派，厨房已解锁",
    mid: "叫才做，别装甩手",
    low: "家务隐身术满级",
  },
  romance: {
    high: "仪式感在线，日子有糖",
    mid: "偶尔浪漫，别躺平",
    low: "室友外观，爱人内核失踪",
  },
  reliable: {
    high: "关键时刻托得住",
    mid: "基本靠谱，别跳票",
    low: "承诺充值，兑现欠费",
  },
};

function roastFor(dimension: string, value: number, cap: number) {
  const ratio = value / Math.max(cap, 1);
  const pack = dimensionRoasts[dimension];
  if (!pack) return "";
  if (ratio >= 0.7) return pack.high;
  if (ratio >= 0.4) return pack.mid;
  return pack.low;
}

export function QuizResultView({
  test,
  profile,
  breakdown,
  scoring,
  related,
  fromSession,
  scoreCap = 30,
  scoreHint = "分数仅用于匹配结果区间，仅供娱乐参考。",
  dimensionCap = 10,
  showDimensions,
  showTotal,
  passThreshold,
}: QuizResultViewProps) {
  const [copied, setCopied] = useState(false);

  const dimensionEntries = Object.entries(breakdown.dimensionScores);
  const hasDimensions = dimensionEntries.length > 0;
  const shouldShowDimensions = showDimensions ?? hasDimensions;
  const shouldShowTotal =
    showTotal ?? (scoring === "sum" || test.slug === "husband-score-check");

  const sumPercent = Math.min(
    100,
    Math.round((breakdown.totalScore / Math.max(scoreCap, 1)) * 100),
  );

  const sortedDims = [...dimensionEntries].sort((a, b) => a[1] - b[1]);
  const weakest = sortedDims[0];
  const strongest = sortedDims[sortedDims.length - 1];

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(profile.shareText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  async function handleShare() {
    const shareUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/tests/${test.slug}/result?type=${profile.id}`
        : "";

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${test.title}｜${profile.title}`,
          text: profile.shareText,
          url: shareUrl,
        });
        return;
      } catch {
        // Fall through to copy.
      }
    }

    await handleCopy();
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="overflow-hidden rounded-[2rem] border border-brand-purple/10 bg-white/80 shadow-lift"
      >
        <div className={`bg-gradient-to-br px-5 py-8 sm:px-8 ${test.coverGradient}`}>
          <div className="flex flex-wrap gap-2">
            <Badge variant="cream">{test.title}</Badge>
            {test.slug === "husband-score-check" && passThreshold != null ? (
              <Badge variant={profile.id === "all-pass" ? "default" : "pink"}>
                {profile.id === "all-pass"
                  ? "五维合格 · 准予续约"
                  : "短板劝退 · 趣味黄牌"}
              </Badge>
            ) : null}
          </div>
          <h1 className="mt-4 font-display text-3xl leading-tight text-ink sm:text-4xl">
            {profile.title}
          </h1>
          <p className="mt-2 text-base text-ink/65">{profile.subtitle}</p>
        </div>

        <div className="space-y-6 px-5 py-6 sm:px-8 sm:py-8">
          <p className="text-sm font-medium leading-relaxed text-ink sm:text-base">
            {profile.summary}
          </p>
          <p className="text-sm leading-relaxed text-ink/65 sm:text-base">
            {profile.description}
          </p>

          {shouldShowTotal ? (
            <div className="rounded-2xl bg-cream-deep/70 px-4 py-4">
              <Progress
                value={sumPercent}
                label={`综合得分 ${breakdown.totalScore} / ${scoreCap}`}
              />
              <p className="mt-2 text-xs text-ink/50">{scoreHint}</p>
            </div>
          ) : null}

          {shouldShowDimensions ? (
            <div className="rounded-2xl bg-cream-deep/70 px-4 py-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-medium text-ink/50">多维评分（昧良心版）</p>
                {weakest && strongest ? (
                  <p className="text-xs text-ink/45">
                    最短板 {dimensionLabels[weakest[0]] ?? weakest[0]} · 相对能打{" "}
                    {dimensionLabels[strongest[0]] ?? strongest[0]}
                  </p>
                ) : null}
              </div>
              <div className="mt-3 space-y-3">
                {sortedDims.map(([key, value]) => {
                  const cap = dimensionCap;
                  const width = Math.min(100, Math.round((value / cap) * 100));
                  const roast = roastFor(key, value, cap);
                  return (
                    <div key={key}>
                      <div className="mb-1 flex items-center justify-between gap-2 text-xs text-ink/60">
                        <span className="font-medium text-ink/75">
                          {dimensionLabels[key] ?? key}
                        </span>
                        <span>
                          {value}
                          {roast ? ` · ${roast}` : ""}
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-brand-purple/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-brand-purple to-brand-pink"
                          style={{ width: `${width}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}

          <div>
            <h2 className="font-display text-xl text-ink">操作建议</h2>
            <ul className="mt-3 space-y-2">
              {profile.tips.map((tip) => (
                <li
                  key={tip}
                  className="rounded-2xl bg-white px-4 py-3 text-sm text-ink/70 ring-1 ring-brand-purple/8"
                >
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button variant="soft" className="flex-1" onClick={handleShare}>
              <Share2 className="h-4 w-4" aria-hidden />
              分享结果
            </Button>
            <Button variant="secondary" className="flex-1" onClick={handleCopy}>
              {copied ? (
                <Check className="h-4 w-4" aria-hidden />
              ) : (
                <Copy className="h-4 w-4" aria-hidden />
              )}
              {copied ? "已复制文案" : "复制分享文案"}
            </Button>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="secondary" className="flex-1">
              <Link href={`/tests/${test.slug}/play`}>
                <RotateCcw className="h-4 w-4" aria-hidden />
                再测一次
              </Link>
            </Button>
            <Button asChild variant="ghost" className="flex-1">
              <Link href="/#featured">去看别的测评</Link>
            </Button>
          </div>

          {!fromSession ? (
            <p className="text-xs leading-relaxed text-ink/45">
              你正在查看可分享的结果页。若要生成属于自己的答案画像，可以重新答题。
            </p>
          ) : null}
        </div>
      </motion.section>

      {related.length > 0 ? (
        <section className="mt-10">
          <h2 className="font-display text-xl text-ink">接着测这些</h2>
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
