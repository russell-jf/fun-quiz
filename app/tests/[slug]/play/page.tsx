import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { QuizPlayer } from "@/components/quiz/quiz-player";
import { getAvailableQuizSlugs, getQuizBySlug } from "@/lib/quizzes";
import { getTestBySlug } from "@/lib/tests";

type PlayPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAvailableQuizSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PlayPageProps): Promise<Metadata> {
  const { slug } = await params;
  const test = getTestBySlug(slug);

  if (!test) {
    return { title: "测评未找到" };
  }

  return {
    title: `答题中 · ${test.title}`,
    description: `开始完成「${test.title}」，约 ${test.estimatedMinutes} 分钟。`,
    robots: { index: false, follow: false },
  };
}

export default async function QuizPlayPage({ params }: PlayPageProps) {
  const { slug } = await params;
  const test = getTestBySlug(slug);
  const quiz = getQuizBySlug(slug);

  if (!test || test.status !== "available" || !quiz) {
    notFound();
  }

  return <QuizPlayer test={test} quiz={quiz} />;
}
