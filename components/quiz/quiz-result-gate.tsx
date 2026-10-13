"use client";

import { useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { QuizResultView } from "@/components/quiz/quiz-result-view";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import {
  getQuizSessionKey,
  getResultById,
  type StoredQuizSession,
} from "@/lib/quiz-engine";
import type { QuizContent, QuizScoreBreakdown, QuizTest } from "@/lib/types";

interface QuizResultGateProps {
  test: QuizTest;
  quiz: QuizContent;
  related: QuizTest[];
}

function subscribeToSession(slug: string, onStoreChange: () => void) {
  const key = getQuizSessionKey(slug);
  const onStorage = (event: StorageEvent) => {
    if (event.key === key) onStoreChange();
  };
  const onLocal = () => onStoreChange();

  window.addEventListener("storage", onStorage);
  window.addEventListener(`hfs-quiz-updated:${slug}`, onLocal);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(`hfs-quiz-updated:${slug}`, onLocal);
  };
}

/** Must return a stable primitive; parsed objects would infinite-loop React. */
function getSessionRawSnapshot(slug: string): string | null {
  try {
    return window.sessionStorage.getItem(getQuizSessionKey(slug));
  } catch {
    return null;
  }
}

function parseSession(raw: string | null): StoredQuizSession | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredQuizSession;
  } catch {
    return null;
  }
}

function optionTotal(option: { score?: number; scores?: Record<string, number> }) {
  const fromDims = Object.values(option.scores ?? {}).reduce(
    (sum, value) => sum + value,
    0,
  );
  return (option.score ?? 0) + fromDims;
}

function getScoreCap(quiz: QuizContent) {
  if (quiz.scoring === "sum") {
    return Math.max(
      ...quiz.results.map((result) => result.maxScore ?? 0),
      quiz.questions.length * 3,
    );
  }

  return quiz.questions.reduce((sum, question) => {
    const best = Math.max(
      ...question.options.map((option) => optionTotal(option)),
      0,
    );
    return sum + best;
  }, 0);
}

function getDimensionCap(quiz: QuizContent) {
  if (!quiz.dimensions?.length) return 10;
  return Math.max(
    ...quiz.dimensions.map((dimension) =>
      quiz.questions.reduce((sum, question) => {
        const best = Math.max(
          ...question.options.map((option) => option.scores?.[dimension] ?? 0),
          0,
        );
        return sum + best;
      }, 0),
    ),
    1,
  );
}

function buildFallbackBreakdown(
  quiz: QuizContent,
  resultId: string,
): QuizScoreBreakdown {
  const profile = getResultById(quiz, resultId);
  const dimensionScores = Object.fromEntries(
    (quiz.dimensions ?? []).map((dimension) => [dimension, 0]),
  );

  if (quiz.scoring === "dimension" && profile?.dimension) {
    const cap = getDimensionCap(quiz);
    if (profile.dimension === "all") {
      for (const key of Object.keys(dimensionScores)) {
        dimensionScores[key] = Math.max(quiz.dimensionPassThreshold ?? 7, 8);
      }
    } else if (quiz.resultStrategy === "lowest") {
      for (const key of Object.keys(dimensionScores)) {
        dimensionScores[key] =
          key === profile.dimension
            ? Math.max(1, Math.floor(cap * 0.2))
            : Math.max(4, Math.floor(cap * 0.55));
      }
    } else {
      for (const key of Object.keys(dimensionScores)) {
        dimensionScores[key] = key === profile.dimension ? 3 : 1;
      }
    }

    const totalScore = Object.values(dimensionScores).reduce(
      (sum, value) => sum + value,
      0,
    );
    return { totalScore, dimensionScores };
  }

  if (quiz.scoring === "sum" && profile) {
    const mid =
      ((profile.minScore ?? 0) + (profile.maxScore ?? profile.minScore ?? 0)) / 2;
    return { totalScore: Math.round(mid), dimensionScores };
  }

  return { totalScore: 0, dimensionScores };
}

export function QuizResultGate({ test, quiz, related }: QuizResultGateProps) {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  const sessionRaw = useSyncExternalStore(
    (onStoreChange) => subscribeToSession(test.slug, onStoreChange),
    () => getSessionRawSnapshot(test.slug),
    () => null,
  );

  const session = useMemo(() => parseSession(sessionRaw), [sessionRaw]);

  const resultId = type ?? session?.resultId ?? null;
  const profile = useMemo(
    () => (resultId ? getResultById(quiz, resultId) : undefined),
    [quiz, resultId],
  );

  if (!profile || !resultId) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col justify-center px-4 py-10">
        <EmptyState
          title="还没有可展示的结果"
          description="请先完成答题，或打开带有结果类型的分享链接。"
        />
        <Button asChild className="mt-6" variant="soft">
          <Link href={`/tests/${test.slug}/play`}>去答题</Link>
        </Button>
      </div>
    );
  }

  const fromSession = Boolean(session && (!type || type === session.resultId));

  const breakdown = fromSession
    ? {
        totalScore: session!.totalScore,
        dimensionScores: session!.dimensionScores,
      }
    : buildFallbackBreakdown(quiz, resultId);

  const scoreCap = getScoreCap(quiz);
  const dimensionCap = getDimensionCap(quiz);

  const scoreHint =
    quiz.slug === "husband-score-check"
      ? "按最短板定罪：五维都≥7 才算合格续约；否则看最低维人设（仅供娱乐）。"
      : quiz.slug === "mental-age-spark"
        ? "分数越高越偏「火花感」，越低越偏「沉稳感」，仅供娱乐。"
        : "分数仅用于匹配结果区间，仅供娱乐参考。";

  return (
    <QuizResultView
      test={test}
      profile={profile}
      breakdown={breakdown}
      scoring={quiz.scoring}
      related={related}
      fromSession={fromSession}
      scoreCap={scoreCap}
      scoreHint={scoreHint}
      dimensionCap={dimensionCap}
      showDimensions={Boolean(quiz.dimensions?.length)}
      showTotal
      passThreshold={quiz.dimensionPassThreshold}
    />
  );
}
