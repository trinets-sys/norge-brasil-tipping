export type Option = {
  value: string;
  label: string;
};

export type Question = {
  id: string;
  label: string;
  shortLabel: string;
  type: "select" | "number" | "score";
  points: number;
  options?: Option[];
  helper?: string;
};

export type Answers = Record<string, string | number | null>;

export type Entry = {
  id: string;
  name: string;
  answers: Answers;
  createdAt: string;
  updatedAt: string;
};

export type ScoreBreakdown = {
  questionId: string;
  label: string;
  points: number;
  maxPoints: number;
  status: "pending" | "hit" | "partial" | "miss";
};

export type LeaderboardRow = Entry & {
  score: number;
  possible: number;
  rank: number;
  breakdown: ScoreBreakdown[];
};

export const DEADLINE_ISO = "2026-07-11T23:00:00+02:00";
export const ADMIN_CODE = "norge22";

export const questions: Question[] = [
  {
    id: "finalScore",
    label: "Sluttresultat",
    shortLabel: "Resultat",
    type: "score",
    points: 6,
    helper: "Riktig resultat gir 6 poeng. Riktig vinner/uavgjort gir 2 poeng.",
  },
  {
    id: "firstGoal",
    label: "Hvem scorer kampens første mål?",
    shortLabel: "Første mål",
    type: "select",
    points: 3,
    options: [
      { value: "norway", label: "Norge" },
      { value: "england", label: "England" },
      { value: "none", label: "Ingen mål" },
    ],
  },
  {
    id: "haalandScores",
    label: "Scorer Ada Hegerberg?",
    shortLabel: "Ada mål",
    type: "select",
    points: 2,
    options: [
      { value: "yes", label: "Ja" },
      { value: "no", label: "Nei" },
    ],
  },
  {
    id: "hairTie",
    label: "Ryker kampens mest omtalte hårstrikk?",
    shortLabel: "Strikken",
    type: "select",
    points: 3,
    options: [
      { value: "yes", label: "Ja" },
      { value: "no", label: "Nei" },
    ],
  },
  {
    id: "norwaySetPiece",
    label: "Scorer Norge etter dødball?",
    shortLabel: "Norsk dødball",
    type: "select",
    points: 3,
    options: [
      { value: "yes", label: "Ja" },
      { value: "no", label: "Nei" },
    ],
  },
  {
    id: "englandSetPiece",
    label: "Scorer England etter dødball?",
    shortLabel: "Engelsk dødball",
    type: "select",
    points: 3,
    options: [
      { value: "yes", label: "Ja" },
      { value: "no", label: "Nei" },
    ],
  },
  {
    id: "totalCorners",
    label: "Antall cornere totalt",
    shortLabel: "Cornere",
    type: "number",
    points: 4,
    helper: "Riktig antall gir 4 poeng. Bom med 1 gir 2 poeng.",
  },
  {
    id: "redCard",
    label: "Kommer det rødt kort?",
    shortLabel: "Rødt kort",
    type: "select",
    points: 2,
    options: [
      { value: "yes", label: "Ja" },
      { value: "no", label: "Nei" },
    ],
  },
  {
    id: "firstYellow",
    label: "Hvem får første gule kort?",
    shortLabel: "Første gule",
    type: "select",
    points: 2,
    options: [
      { value: "norway", label: "Norge" },
      { value: "england", label: "England" },
      { value: "none", label: "Ingen gule" },
    ],
  },
  {
    id: "halftimeLeader",
    label: "Hvem leder til pause?",
    shortLabel: "Pause",
    type: "select",
    points: 3,
    options: [
      { value: "norway", label: "Norge" },
      { value: "draw", label: "Uavgjort" },
      { value: "england", label: "England" },
    ],
  },
  {
    id: "penalty",
    label: "Blir det straffe i kampen?",
    shortLabel: "Straffe",
    type: "select",
    points: 2,
    options: [
      { value: "yes", label: "Ja" },
      { value: "no", label: "Nei" },
    ],
  },
  {
    id: "commentatorChaos",
    label: "Sier noen 'typisk engelsk' på sendingen?",
    shortLabel: "Typisk engelsk",
    type: "select",
    points: 2,
    options: [
      { value: "yes", label: "Ja" },
      { value: "no", label: "Nei" },
    ],
  },
  {
    id: "extraTimeDrama",
    label: "Skjer det noe avgjørende etter 85. minutt?",
    shortLabel: "Sluttdrama",
    type: "select",
    points: 3,
    options: [
      { value: "yes", label: "Ja" },
      { value: "no", label: "Nei" },
    ],
  },
  {
    id: "varMoment",
    label: "Blir det en tydelig VAR-situasjon?",
    shortLabel: "VAR",
    type: "select",
    points: 2,
    options: [
      { value: "yes", label: "Ja" },
      { value: "no", label: "Nei" },
    ],
  },
  {
    id: "firstGoalMinute",
    label: "Når kommer første mål?",
    shortLabel: "Første mål min.",
    type: "select",
    points: 3,
    options: [
      { value: "0-15", label: "0-15 min" },
      { value: "16-30", label: "16-30 min" },
      { value: "31-45", label: "31-45 min" },
      { value: "46-60", label: "46-60 min" },
      { value: "61-75", label: "61-75 min" },
      { value: "76-90", label: "76-90+ min" },
      { value: "none", label: "Ingen mål" },
    ],
  },
];

export function emptyAnswers(): Answers {
  return Object.fromEntries(questions.map((question) => [question.id, ""]));
}

export function isLocked(now = new Date()) {
  return now.getTime() >= new Date(DEADLINE_ISO).getTime();
}

export function normalizeAnswers(input: unknown) {
  const answers = emptyAnswers();
  const source = typeof input === "object" && input !== null ? input as Answers : {};

  for (const question of questions) {
    const value = source[question.id];
    if (question.type === "number") {
      const parsed = typeof value === "number" ? value : Number(value);
      answers[question.id] = Number.isFinite(parsed) && parsed >= 0 ? parsed : "";
    } else if (question.type === "score") {
      answers[question.id] = typeof value === "string" && /^\d{1,2}-\d{1,2}$/.test(value.trim())
        ? value.trim()
        : "";
    } else {
      const optionValues = new Set(question.options?.map((option) => option.value));
      answers[question.id] = typeof value === "string" && optionValues.has(value) ? value : "";
    }
  }

  return answers;
}

export function calculateLeaderboard(entries: Entry[], results: Answers): LeaderboardRow[] {
  const rows = entries.map((entry) => {
    const breakdown = questions.map((question) =>
      scoreQuestion(question, entry.answers[question.id], results[question.id])
    );
    return {
      ...entry,
      score: breakdown.reduce((sum, item) => sum + item.points, 0),
      possible: breakdown
        .filter((item) => item.status !== "pending")
        .reduce((sum, item) => sum + item.maxPoints, 0),
      rank: 0,
      breakdown,
    };
  });

  rows.sort((a, b) => b.score - a.score || a.updatedAt.localeCompare(b.updatedAt));

  let previousScore: number | null = null;
  let previousRank = 0;
  rows.forEach((row, index) => {
    row.rank = previousScore === row.score ? previousRank : index + 1;
    previousScore = row.score;
    previousRank = row.rank;
  });

  return rows;
}

function scoreQuestion(question: Question, guess: string | number | null, actual: string | number | null): ScoreBreakdown {
  const maxPoints = question.points;
  if (actual === "" || actual === null || actual === undefined) {
    return { questionId: question.id, label: question.shortLabel, points: 0, maxPoints, status: "pending" };
  }

  if (guess === "" || guess === null || guess === undefined) {
    return { questionId: question.id, label: question.shortLabel, points: 0, maxPoints, status: "miss" };
  }

  if (question.id === "finalScore") {
    return scoreFinalScore(question, String(guess), String(actual));
  }

  if (question.id === "totalCorners") {
    const diff = Math.abs(Number(guess) - Number(actual));
    if (diff === 0) return { questionId: question.id, label: question.shortLabel, points: 4, maxPoints, status: "hit" };
    if (diff === 1) return { questionId: question.id, label: question.shortLabel, points: 2, maxPoints, status: "partial" };
    return { questionId: question.id, label: question.shortLabel, points: 0, maxPoints, status: "miss" };
  }

  const hit = String(guess) === String(actual);
  return { questionId: question.id, label: question.shortLabel, points: hit ? maxPoints : 0, maxPoints, status: hit ? "hit" : "miss" };
}

function scoreFinalScore(question: Question, guess: string, actual: string): ScoreBreakdown {
  if (guess === actual) {
    return { questionId: question.id, label: question.shortLabel, points: 6, maxPoints: question.points, status: "hit" };
  }

  const guessWinner = resultDirection(guess);
  const actualWinner = resultDirection(actual);
  if (guessWinner && guessWinner === actualWinner) {
    return { questionId: question.id, label: question.shortLabel, points: 2, maxPoints: question.points, status: "partial" };
  }

  return { questionId: question.id, label: question.shortLabel, points: 0, maxPoints: question.points, status: "miss" };
}

function resultDirection(score: string) {
  const [home, away] = score.split("-").map(Number);
  if (!Number.isFinite(home) || !Number.isFinite(away)) return null;
  if (home === away) return "draw";
  return home > away ? "norway" : "england";
}
