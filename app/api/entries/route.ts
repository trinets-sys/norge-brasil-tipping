import { NextRequest, NextResponse } from "next/server";
import { isLocked, normalizeAnswers } from "@/lib/game";
import { saveEntry } from "@/lib/storage";

export async function POST(request: NextRequest) {
  if (isLocked()) {
    return NextResponse.json({ error: "Fristen har gått ut. Tipsene er låst." }, { status: 423 });
  }

  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim().slice(0, 40) : "";
  const id = typeof body?.id === "string" && body.id.length > 8 ? body.id : crypto.randomUUID();

  if (!name) {
    return NextResponse.json({ error: "Skriv inn et navn." }, { status: 400 });
  }

  const now = new Date().toISOString();
  await saveEntry({
    id,
    name,
    answers: normalizeAnswers(body?.answers),
    createdAt: typeof body?.createdAt === "string" ? body.createdAt : now,
    updatedAt: now,
  });

  return NextResponse.json({ id });
}
