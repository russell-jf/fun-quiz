"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  computeQuizResult,
  saveQuizSession,
} from "@/lib/quiz-engine";
import type { QuizAnswer, QuizContent, QuizTest } from "@/lib/types";
import { cn } from "@/lib/utils";

interface QuizPlayerProps {
  test: QuizTest;
  quiz: QuizContent;
}

export function QuizPlayer({ test, quiz }: QuizPlayerProps) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const question = quiz.questions[index];
  const total = quiz.questions.length;
  const progressValue = Math.round(((index + (selectedOptionId ? 1 : 0)) / total) * 100);
  const isLast = index >= total - 1;

  const currentAnswer = useMemo(
    () => answers.find((item) => item.questionId === question.id),
    [answers, question.id],
  );

  const activeOptionId = selectedOptionId ?? currentAnswer?.optionId ?? null;

  function handleSelect(optionId: string) {
    if (submitting) return;
    setSelectedOptionId(optionId);
  }

  function commitAnswer(optionId: string) {
    setAnswers((prev) => {
      const others = prev.filter((item) => item.questionId !== question.id);
      return [...others, { questionId: question.id, optionId }];
    });
  }

  function handleNext() {
    if (!activeOptionId || submitting) return;

    const nextAnswers = [
      ...answers.filter((item) => item.questionId !== question.id),
      { questionId: question.id, optionId: activeOptionId },
    ];

    commitAnswer(activeOptionId);

    if (!isLast) {
      setIndex((value) => value + 1);
      setSelectedOptionId(null);
      return;
    }

    setSubmitting(true);
    const result = computeQuizResult(quiz, nextAnswers);
    saveQuizSession(test.slug, {
      answers: nextAnswers,
      resultId: result.profile.id,
      totalScore: result.breakdown.totalScore,
      dimensionScores: result.breakdown.dimensionScores,
      completedAt: new Date().toISOString(),
    });

    router.push(`/tests/${test.slug}/result?type=${result.profile.id}`);
  }

  function handleBack() {
    if (index === 0 || submitting) return;
    const previous = quiz.questions[index - 1];
    const previousAnswer = answers.find((item) => item.questionId === previous.id);
    setIndex((value) => value - 1);
    setSelectedOptionId(previousAnswer?.optionId ?? null);
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6 sm:px-6 sm:py-10">
      <div className="mb-5 flex items-center justify-between gap-3">
        <Link
          href={`/tests/${test.slug}`}
          className="inline-flex items-center gap-1.5 text-sm text-ink/55 transition-colors hover:text-brand-purple"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          返回介绍
        </Link>
        <p className="text-xs text-ink/45">
          {index + 1} / {total}
        </p>
      </div>

      <div className="mb-6">
        <p className="font-display text-lg text-ink">{test.title}</p>
        <Progress className="mt-3" value={progressValue} label="答题进度" />
      </div>

      <AnimatePresence mode="wait">
        <motion.section
          key={question.id}
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -18 }}
          transition={{ duration: 0.22 }}
          className="rounded-[2rem] border border-brand-purple/10 bg-white/80 p-5 shadow-lift sm:p-7"
        >
          <p className="text-xs font-medium tracking-[0.16em] text-brand-purple/70">
            QUESTION {index + 1}
          </p>
          <h1 className="mt-3 text-lg font-medium leading-relaxed text-ink sm:text-xl">
            {question.text}
          </h1>

          <div className="mt-6 space-y-3">
            {question.options.map((option) => {
              const selected = activeOptionId === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleSelect(option.id)}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-2xl border px-4 py-3.5 text-left text-sm transition-all duration-200",
                    selected
                      ? "border-brand-purple bg-brand-purple/8 text-ink shadow-soft"
                      : "border-brand-purple/10 bg-cream/60 text-ink/75 hover:border-brand-purple/25 hover:bg-white",
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                      selected
                        ? "border-brand-purple bg-brand-purple text-white"
                        : "border-brand-purple/25 bg-white",
                    )}
                  >
                    {selected ? <Check className="h-3 w-3" aria-hidden /> : null}
                  </span>
                  <span className="leading-relaxed">{option.text}</span>
                </button>
              );
            })}
          </div>
        </motion.section>
      </AnimatePresence>

      <div className="mt-6 flex items-center gap-3">
        <Button
          variant="secondary"
          className="flex-1"
          onClick={handleBack}
          disabled={index === 0 || submitting}
        >
          上一题
        </Button>
        <Button
          variant="soft"
          className="flex-[1.4]"
          onClick={handleNext}
          disabled={!activeOptionId || submitting}
        >
          {submitting ? "生成结果中…" : isLast ? "查看结果" : "下一题"}
        </Button>
      </div>
    </div>
  );
}
