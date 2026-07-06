import { NextRequest, NextResponse } from "next/server";
import { ADMIN_CODE, normalizeAnswers } from "@/lib/game";
import { saveResults } from "@/lib/storage";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (body?.adminCode !== (process.env.ADMIN_CODE ?? ADMIN_CODE)) {
    return NextResponse.json({ error: "Feil adminkode." }, { status: 401 });
  }

  await saveResults(normalizeAnswers(body?.results));
  return NextResponse.json({ ok: true });
}
