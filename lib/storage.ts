import type { Answers, Entry } from "./game";
import { emptyAnswers } from "./game";

type EntryRow = {
  id: string;
  name: string;
  answers: Answers | string;
  created_at: string;
  updated_at: string;
};

type ResultRow = {
  answers: Answers | string;
};

export async function listEntries(): Promise<Entry[]> {
  const rows = await supabaseRequest<EntryRow[]>("/rest/v1/entries?select=*&order=created_at.asc");

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    answers: parseAnswers(row.answers),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}

export async function getResults(): Promise<Answers> {
  const rows = await supabaseRequest<ResultRow[]>("/rest/v1/results?id=eq.match&select=answers");
  return rows[0] ? parseAnswers(rows[0].answers) : emptyAnswers();
}

export async function saveEntry(entry: Entry) {
  await supabaseRequest("/rest/v1/entries", {
    method: "POST",
    headers: {
      Prefer: "resolution=merge-duplicates",
    },
    body: JSON.stringify({
      id: entry.id,
      name: entry.name,
      answers: entry.answers,
      created_at: entry.createdAt,
      updated_at: entry.updatedAt,
    }),
  });
}

export async function saveResults(answers: Answers) {
  await supabaseRequest("/rest/v1/results", {
    method: "POST",
    headers: {
      Prefer: "resolution=merge-duplicates",
    },
    body: JSON.stringify({
      id: "match",
      answers,
      updated_at: new Date().toISOString(),
    }),
  });
}

export async function resetGame() {
  await supabaseRequest("/rest/v1/entries?id=neq.__never__", { method: "DELETE" });
  await supabaseRequest("/rest/v1/results?id=eq.match", { method: "DELETE" });
}

async function supabaseRequest<T = unknown>(path: string, init: RequestInit = {}): Promise<T> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Supabase mangler. Legg SUPABASE_URL og SUPABASE_SERVICE_ROLE_KEY inn i Vercel.");
  }

  const response = await fetch(`${url}${path}`, {
    ...init,
    headers: {
      apikey: key,
      authorization: `Bearer ${key}`,
      "content-type": "application/json",
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Supabase-feil ${response.status}: ${details}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

function parseAnswers(value: Answers | string): Answers {
  if (typeof value !== "string") {
    return value ?? emptyAnswers();
  }

  try {
    return JSON.parse(value) as Answers;
  } catch {
    return emptyAnswers();
  }
}
