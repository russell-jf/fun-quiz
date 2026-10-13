export type TestCategoryId = "personality" | "love" | "mental-age";

export type TestStatus = "available" | "coming_soon";

export type ScoringMode = "sum" | "dimension";

/** How to pick the final result profile after scoring. */
export type ResultStrategy = "highest" | "lowest" | "sum";

export interface TestCategory {
  id: TestCategoryId;
  name: string;
  description: string;
  accent: string;
  icon: "sparkles" | "heart" | "clock";
}

export interface QuizTest {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  categoryId: TestCategoryId;
  coverGradient: string;
  estimatedMinutes: number;
  questionCount: number;
  tags: string[];
  highlights: string[];
  suitableFor: string[];
  status: TestStatus;
  featured?: boolean;
  popularity: number;
}

export interface QuizOption {
  id: string;
  text: string;
  /** Used when scoring mode is `sum`. */
  score?: number;
  /** Used when scoring mode is `dimension`. */
  scores?: Record<string, number>;
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: QuizOption[];
}

export interface QuizResultProfile {
  id: string;
  title: string;
  subtitle: string;
  summary: string;
  description: string;
  tips: string[];
  shareText: string;
  /** For `dimension` scoring: which dimension this result represents. */
  dimension?: string;
  /** For `sum` scoring: inclusive score range. */
  minScore?: number;
  maxScore?: number;
}

export interface QuizContent {
  slug: string;
  scoring: ScoringMode;
  /**
   * Defaults: `sum` scoring → `sum`; `dimension` scoring → `highest`.
   * Use `lowest` for weakest-link style verdicts (e.g. husband score).
   */
  resultStrategy?: ResultStrategy;
  /** When using `lowest`, treat as all-round pass if every dimension >= this. */
  dimensionPassThreshold?: number;
  dimensions?: string[];
  questions: QuizQuestion[];
  results: QuizResultProfile[];
}

export interface QuizAnswer {
  questionId: string;
  optionId: string;
}

export interface QuizScoreBreakdown {
  totalScore: number;
  dimensionScores: Record<string, number>;
}

export interface ComputedQuizResult {
  profile: QuizResultProfile;
  breakdown: QuizScoreBreakdown;
  answeredCount: number;
}
