export type Option = {
  value: string;
  label: string;
};

export type Question = {
  id: string;
  label: string;
  shortLabel: string;
  type: "select" | "number" | "score" | "text";
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

const yesNoOptions: Option[] = [
  { value: "yes", label: "Ja" },
  { value: "no", label: "Nei" },
];

const teamOrNoneOptions: Option[] = [
  { value: "norway", label: "Norge" },
  { value: "england", label: "England" },
  { value: "none", label: "Det blir ingen" },
];

const scoreParts = ["0", "1", "2", "3", "4+"];
const finalScoreOptions: Option[] = scoreParts.flatMap((norway) =>
  scoreParts.map((england) => ({
    value: `${norway}-${england}`,
    label: `Norge ${norway} - England ${england}`,
  }))
);

export const questions: Question[] = [
  {
    id: "finalScore",
    label: "Hva blir sluttresultatet?",
    shortLabel: "Resultat",
    type: "select",
    points: 6,
    options: finalScoreOptions,
    helper: "Velg antall mål til Norge og England. Riktig resultat gir 6 poeng. Riktig vinner/uavgjort gir 2 poeng.",
  },
  {
    id: "firstGoal",
    label: "Hvem scorer kampens første mål?",
    shortLabel: "Første mål",
    type: "select",
    points: 3,
    options: teamOrNoneOptions,
  },
  {
    id: "extraTime",
    label: "Blir det ekstraomganger?",
    shortLabel: "Ekstraomganger",
    type: "select",
    points: 2,
    options: yesNoOptions,
  },
  {
    id: "penaltyShootout",
    label: "Blir det straffesparkkonkurranse?",
    shortLabel: "Straffekonk",
    type: "select",
    points: 2,
    options: yesNoOptions,
  },
  {
    id: "haalandGoals",
    label: "Hvor mange mål scorer Erling Braut Haaland?",
    shortLabel: "Haaland mål",
    type: "select",
    points: 4,
    options: [
      { value: "0", label: "0" },
      { value: "1", label: "1" },
      { value: "2", label: "2" },
      { value: "3", label: "3" },
      { value: "4+", label: "4+" },
    ],
  },
  {
    id: "odegaardAssist",
    label: "Får Martin Ødegaard en målgivende pasning?",
    shortLabel: "Ødegaard assist",
    type: "select",
    points: 2,
    options: yesNoOptions,
  },
  {
    id: "firstYellow",
    label: "Hvilket lag får kampens første gule kort?",
    shortLabel: "Første gule",
    type: "select",
    points: 2,
    options: teamOrNoneOptions,
  },
  {
    id: "totalYellowCards",
    label: "Hvor mange gule kort blir det totalt?",
    shortLabel: "Gule kort",
    type: "select",
    points: 3,
    options: [
      { value: "1", label: "1" },
      { value: "2", label: "2" },
      { value: "3", label: "3" },
      { value: "4+", label: "4+" },
    ],
  },
  {
    id: "redCard",
    label: "Blir det rødt kort?",
    shortLabel: "Rødt kort",
    type: "select",
    points: 2,
    options: yesNoOptions,
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
    label: "Blir det dømt minst ett straffespark i kampen?",
    shortLabel: "Straffe",
    type: "select",
    points: 2,
    options: yesNoOptions,
  },
  {
    id: "bitten",
    label: "Blir noen bitt i løpet av kampen?",
    shortLabel: "Biting",
    type: "select",
    points: 2,
    options: yesNoOptions,
  },
  {
    id: "norwayGoalAfter80",
    label: "Scorer Norge etter det 80. spilleminutt?",
    shortLabel: "Norge 80+",
    type: "select",
    points: 3,
    options: yesNoOptions,
  },
  {
    id: "haalandHair",
    label: "Tar Haaland ut strikken i løpet av kampen?",
    shortLabel: "Strikken",
    type: "select",
    points: 3,
    options: yesNoOptions,
  },
  {
    id: "governmentShown",
    label: "Vises noen fra den norske regjeringen på tribunen?",
    shortLabel: "Regjeringen",
    type: "select",
    points: 2,
    options: yesNoOptions,
  },
  {
    id: "royalFamilyShown",
    label: "Vises noen fra den norske kongefamilien på tribunen?",
    shortLabel: "Kongefamilien",
    type: "select",
    points: 2,
    options: yesNoOptions,
  },
  {
    id: "totalGoals",
    label: "Hvor mange mål blir det totalt i kampen?",
    shortLabel: "Mål totalt",
    type: "select",
    points: 4,
    options: [
      { value: "0", label: "0" },
      { value: "1", label: "1" },
      { value: "2", label: "2" },
      { value: "3", label: "3" },
      { value: "4", label: "4" },
      { value: "5", label: "5" },
      { value: "6", label: "6" },
      { value: "7", label: "7" },
      { value: "8", label: "8" },
      { value: "9", label: "9" },
      { value: "10+", label: "10+" },
    ],
  },
  {
    id: "varSituation",
    label: "Blir det en VAR-situasjon?",
    shortLabel: "VAR",
    type: "select",
    points: 2,
    options: yesNoOptions,
  },
  {
    id: "englandGoalDisallowed",
    label: "Får England et mål annullert?",
    shortLabel: "England annullert",
    type: "select",
    points: 3,
    options: yesNoOptions,
  },
  {
    id: "playerOfTheMatch",
    label: "Hvem blir banens beste spiller?",
    shortLabel: "Banens beste",
    type: "text",
    points: 5,
    helper: "Skriv spillerens navn. Det holder at fasit og tips matcher samme navn.",
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
    } else if (question.type === "text") {
      answers[question.id] = typeof value === "string" ? value.trim().slice(0, 80) : "";
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

  if (question.type === "text") {
    const hit = normalizeText(String(guess)) === normalizeText(String(actual));
    return { questionId: question.id, label: question.shortLabel, points: hit ? maxPoints : 0, maxPoints, status: hit ? "hit" : "miss" };
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
  const [home, away] = score.split("-").map(parseScorePart);
  if (!Number.isFinite(home) || !Number.isFinite(away)) return null;
  if (home === away) return "draw";
  return home > away ? "norway" : "england";
}

function parseScorePart(value: string) {
  return Number(value.replace("+", ""));
}

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9æøå ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
