import type {
  ComputedQuizResult,
  QuizAnswer,
  QuizContent,
  QuizOption,
  QuizResultProfile,
  QuizScoreBreakdown,
  ResultStrategy,
} from "@/lib/types";

function findOption(
  quiz: QuizContent,
  questionId: string,
  optionId: string,
): QuizOption | undefined {
  const question = quiz.questions.find((item) => item.id === questionId);
  return question?.options.find((item) => item.id === optionId);
}

function resolveStrategy(quiz: QuizContent): ResultStrategy {
  if (quiz.resultStrategy) return quiz.resultStrategy;
  return quiz.scoring === "sum" ? "sum" : "highest";
}

export function scoreAnswers(
  quiz: QuizContent,
  answers: QuizAnswer[],
): QuizScoreBreakdown {
  const dimensionScores: Record<string, number> = {};
  for (const dimension of quiz.dimensions ?? []) {
    dimensionScores[dimension] = 0;
  }

  let totalScore = 0;

  for (const answer of answers) {
    const option = findOption(quiz, answer.questionId, answer.optionId);
    if (!option) continue;

    if (quiz.scoring === "sum") {
      totalScore += option.score ?? 0;
      // Optional dimension annotations on sum quizzes.
      for (const [dimension, value] of Object.entries(option.scores ?? {})) {
        dimensionScores[dimension] = (dimensionScores[dimension] ?? 0) + value;
      }
      continue;
    }

    for (const [dimension, value] of Object.entries(option.scores ?? {})) {
      dimensionScores[dimension] = (dimensionScores[dimension] ?? 0) + value;
      totalScore += value;
    }
  }

  return { totalScore, dimensionScores };
}

function pickDimensionResult(
  quiz: QuizContent,
  breakdown: QuizScoreBreakdown,
  mode: "highest" | "lowest",
): QuizResultProfile {
  const entries = Object.entries(breakdown.dimensionScores);
  if (entries.length === 0) {
    return quiz.results[0];
  }

  entries.sort((a, b) => {
    if (mode === "lowest") {
      if (a[1] !== b[1]) return a[1] - b[1];
    } else if (b[1] !== a[1]) {
      return b[1] - a[1];
    }
    return a[0].localeCompare(b[0]);
  });

  if (mode === "lowest") {
    const threshold = quiz.dimensionPassThreshold;
    const allPass =
      typeof threshold === "number" &&
      entries.every(([, value]) => value >= threshold);
    if (allPass) {
      const passProfile = quiz.results.find(
        (result) => result.id === "all-pass" || result.dimension === "all",
      );
      if (passProfile) return passProfile;
    }
  }

  const keyDimension = entries[0][0];
  const matched = quiz.results.find(
    (result) => result.dimension === keyDimension,
  );
  return matched ?? quiz.results[0];
}

function pickSumResult(
  quiz: QuizContent,
  breakdown: QuizScoreBreakdown,
): QuizResultProfile {
  const matched = quiz.results.find((result) => {
    const min = result.minScore ?? Number.NEGATIVE_INFINITY;
    const max = result.maxScore ?? Number.POSITIVE_INFINITY;
    return breakdown.totalScore >= min && breakdown.totalScore <= max;
  });

  return matched ?? quiz.results[quiz.results.length - 1] ?? quiz.results[0];
}

export function computeQuizResult(
  quiz: QuizContent,
  answers: QuizAnswer[],
): ComputedQuizResult {
  const breakdown = scoreAnswers(quiz, answers);
  const strategy = resolveStrategy(quiz);

  const profile =
    strategy === "sum"
      ? pickSumResult(quiz, breakdown)
      : pickDimensionResult(
          quiz,
          breakdown,
          strategy === "lowest" ? "lowest" : "highest",
        );

  return {
    profile,
    breakdown,
    answeredCount: answers.length,
  };
}

export function getResultById(
  quiz: QuizContent,
  resultId: string,
): QuizResultProfile | undefined {
  return quiz.results.find((result) => result.id === resultId);
}

export function getDimensionMaxHint(quiz: QuizContent): number {
  if (!quiz.dimensions?.length) return 1;
  // Rough per-dimension ceiling used for progress bars.
  return Math.max(1, Math.ceil((quiz.questions.length * 3) / quiz.dimensions.length) + 2);
}

export const QUIZ_SESSION_PREFIX = "hfs-quiz:";

export function getQuizSessionKey(slug: string) {
  return `${QUIZ_SESSION_PREFIX}${slug}`;
}

export interface StoredQuizSession {
  answers: QuizAnswer[];
  resultId: string;
  totalScore: number;
  dimensionScores: Record<string, number>;
  completedAt: string;
}

export function saveQuizSession(slug: string, session: StoredQuizSession) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(getQuizSessionKey(slug), JSON.stringify(session));
  window.dispatchEvent(new Event(`hfs-quiz-updated:${slug}`));
}

export function loadQuizSession(slug: string): StoredQuizSession | null {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(getQuizSessionKey(slug));
  if (!raw) return null;

  try {
    return JSON.parse(raw) as StoredQuizSession;
  } catch {
    return null;
  }
}

export function clearQuizSession(slug: string) {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(getQuizSessionKey(slug));
}
