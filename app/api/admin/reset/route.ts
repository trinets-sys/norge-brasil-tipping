import { NextRequest, NextResponse } from "next/server";
import { ADMIN_CODE } from "@/lib/game";
import { resetGame } from "@/lib/storage";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (body?.adminCode !== (process.env.ADMIN_CODE ?? ADMIN_CODE)) {
    return NextResponse.json({ error: "Feil adminkode." }, { status: 401 });
  }

  await resetGame();
  return NextResponse.json({ ok: true });
}
