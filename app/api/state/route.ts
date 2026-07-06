import { NextResponse } from "next/server";
import { calculateLeaderboard, DEADLINE_ISO, emptyAnswers, isLocked, questions } from "@/lib/game";
import { getResults, listEntries } from "@/lib/storage";

export async function GET() {
  const entries = await listEntries();
  const results = await getResults();

  return NextResponse.json({
    deadline: DEADLINE_ISO,
    locked: isLocked(),
    questions,
    entries,
    results: results ?? emptyAnswers(),
    leaderboard: calculateLeaderboard(entries, results),
  });
}
