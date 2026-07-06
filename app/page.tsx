"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useState } from "react";
import type { Answers, Entry, LeaderboardRow, Question } from "@/lib/game";
import { DEADLINE_ISO, emptyAnswers, questions } from "@/lib/game";

type StateResponse = {
  locked: boolean;
  deadline: string;
  entries: Entry[];
  results: Answers;
  leaderboard: LeaderboardRow[];
};

const participantKey = "norge-england-tipping-id";

export default function Home() {
  const [name, setName] = useState("");
  const [answers, setAnswers] = useState<Answers>(() => emptyAnswers());
  const [results, setResults] = useState<Answers>(() => emptyAnswers());
  const [adminCode, setAdminCode] = useState("");
  const [state, setState] = useState<StateResponse | null>(null);
  const [participantId, setParticipantId] = useState("");
  const [message, setMessage] = useState("");
  const [adminMessage, setAdminMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingResults, setSavingResults] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  const locked = state?.locked ?? now >= new Date(DEADLINE_ISO).getTime();
  const deadline = useMemo(
    () =>
      new Intl.DateTimeFormat("nb-NO", {
        weekday: "long",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Europe/Oslo",
      }).format(new Date(state?.deadline ?? DEADLINE_ISO)),
    [state?.deadline]
  );

  useEffect(() => {
    let storedId = localStorage.getItem(participantKey);
    if (!storedId) {
      storedId = crypto.randomUUID();
      localStorage.setItem(participantKey, storedId);
    }
    window.setTimeout(() => setParticipantId(storedId), 0);
  }, []);

  useEffect(() => {
    refreshState();
    const dataTimer = window.setInterval(refreshState, 5000);
    const clockTimer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => {
      window.clearInterval(dataTimer);
      window.clearInterval(clockTimer);
    };
  }, []);

  useEffect(() => {
    if (!state || !participantId) return;
    const existing = state.entries.find((entry) => entry.id === participantId);
    if (existing) {
      window.setTimeout(() => {
        setName(existing.name);
        setAnswers({ ...emptyAnswers(), ...existing.answers });
      }, 0);
    }
  }, [participantId, state]);

  useEffect(() => {
    if (state?.results) {
      window.setTimeout(() => setResults({ ...emptyAnswers(), ...state.results }), 0);
    }
  }, [state?.results]);

  async function refreshState() {
    try {
      const response = await fetch("/api/state", { cache: "no-store" });
      if (!response.ok) throw new Error("Kunne ikke hente konkurransen.");
      const data = await response.json() as StateResponse;
      setState(data);
    } finally {
      setLoading(false);
    }
  }

  async function submitEntry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    const response = await fetch("/api/entries", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id: participantId, name, answers }),
    });

    const data = await response.json().catch(() => ({}));
    setSaving(false);

    if (!response.ok) {
      setMessage(data.error ?? "Kunne ikke lagre tipset.");
      return;
    }

    localStorage.setItem(participantKey, data.id);
    setParticipantId(data.id);
    setMessage("Tipset er lagret. Du kan endre det frem til kampstart.");
    await refreshState();
  }

  async function submitResults(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingResults(true);
    setAdminMessage("");

    const response = await fetch("/api/results", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ adminCode, results }),
    });

    const data = await response.json().catch(() => ({}));
    setSavingResults(false);

    if (!response.ok) {
      setAdminMessage(data.error ?? "Kunne ikke lagre fasit.");
      return;
    }

    setAdminMessage("Fasit er oppdatert. Tabellen regnes om nå.");
    await refreshState();
  }

  async function resetAll() {
    if (!confirm("Slette alle tips og fasit?")) return;
    const response = await fetch("/api/admin/reset", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ adminCode }),
    });

    if (response.ok) {
      setName("");
      setAnswers(emptyAnswers());
      setResults(emptyAnswers());
      setAdminMessage("Alt er nullstilt.");
      await refreshState();
    } else {
      setAdminMessage("Kunne ikke nullstille. Sjekk adminkoden.");
    }
  }

  return (
    <main className="min-h-screen bg-[#f6f3ea] text-[#161616]">
      <section className="relative overflow-hidden bg-[#0d1f1a] text-white">
        <Image
          src="/images/match-night.png"
          alt="Flombelyst fotballstadion før Norge mot England"
          fill
          priority
          className="object-cover opacity-72"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,16,13,.92),rgba(6,16,13,.52),rgba(6,16,13,.82))]" />
        <div className="relative mx-auto grid min-h-[68vh] max-w-6xl content-end gap-8 px-5 pb-10 pt-28 sm:px-8 lg:grid-cols-[1.1fr_.9fr] lg:items-end">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#f6d365]">
              Tippekonkurranse
            </p>
            <h1 className="text-5xl font-black leading-[0.95] sm:text-7xl">
              Norge - England
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/86">
              Legg inn kampens beste spådommer og litt landslagshistorikk før klokken 23.00.
              Når kampen starter låses tipsene, og poengtavlen oppdateres etter hvert som fasiten fylles inn.
            </p>
          </div>

          <div className="grid gap-3 rounded-lg border border-white/16 bg-white/12 p-4 backdrop-blur-md">
            <StatusPill locked={locked} deadline={deadline} now={now} />
            <div className="grid grid-cols-3 gap-2 text-center">
              <Metric label="Deltakere" value={state?.entries.length ?? 0} />
              <Metric label="Fasit" value={completedResults(state?.results ?? {})} />
              <Metric label="Poeng" value={questions.reduce((sum, item) => sum + item.points, 0)} />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[minmax(0,1fr)_390px]">
        <section className="space-y-8">
          <form onSubmit={submitEntry} className="rounded-lg border border-[#d6d0bf] bg-white p-4 shadow-sm sm:p-6">
            <div className="flex flex-col gap-3 border-b border-[#ece5d3] pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold">Dine tips</h2>
                <p className="mt-2 text-sm leading-6 text-[#615f59]">
                  Bruk kallenavn. Tipsene kan endres frem til fristen.
                </p>
              </div>
              <label className="grid gap-2 text-sm font-semibold">
                Navn
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  disabled={locked}
                  required
                  maxLength={40}
                  className="h-11 min-w-0 rounded-md border border-[#cfc7b7] bg-white px-3 text-base outline-none transition focus:border-[#1c7c54] disabled:bg-[#ece8dd]"
                  placeholder="Kallenavn"
                />
              </label>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {questions.map((question) => (
                <QuestionField
                  key={question.id}
                  question={question}
                  value={answers[question.id]}
                  disabled={locked}
                  onChange={(value) => setAnswers((current) => ({ ...current, [question.id]: value }))}
                />
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="submit"
                disabled={locked || saving || !participantId}
                className="inline-flex h-12 items-center justify-center rounded-md bg-[#1c7c54] px-5 font-bold text-white transition hover:bg-[#145f40] disabled:cursor-not-allowed disabled:bg-[#9ca79f]"
              >
                {saving ? "Lagrer..." : locked ? "Tipsene er låst" : "Lagre tips"}
              </button>
              {message && <p className="text-sm font-medium text-[#315a48]">{message}</p>}
            </div>
          </form>

          <section className="rounded-lg border border-[#d6d0bf] bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Live poengtavle</h2>
                <p className="mt-2 text-sm text-[#615f59]">
                  Oppdateres automatisk hvert femte sekund.
                </p>
              </div>
              {loading && <span className="text-sm text-[#615f59]">Henter...</span>}
            </div>

            <Leaderboard rows={state?.leaderboard ?? []} />
          </section>
        </section>

        <aside className="space-y-6">
          <section className="rounded-lg border border-[#d6d0bf] bg-[#fffaf0] p-4 shadow-sm sm:p-5">
            <h2 className="text-xl font-bold">Fasit underveis</h2>
            <p className="mt-2 text-sm leading-6 text-[#615f59]">
              Legg inn bare det som er avgjort. Historie-spørsmålene kan fylles inn med fasit med en gang.
            </p>

            <form onSubmit={submitResults} className="mt-5 grid gap-4">
              <label className="grid gap-2 text-sm font-semibold">
                Adminkode
                <input
                  value={adminCode}
                  onChange={(event) => setAdminCode(event.target.value)}
                  className="h-11 rounded-md border border-[#cfc7b7] bg-white px-3 text-base outline-none focus:border-[#1c7c54]"
                  placeholder="Skriv adminkode"
                />
              </label>

              {questions.map((question) => (
                <QuestionField
                  key={question.id}
                  question={question}
                  value={results[question.id]}
                  disabled={false}
                  compact
                  allowBlank
                  onChange={(value) => setResults((current) => ({ ...current, [question.id]: value }))}
                />
              ))}

              <button
                type="submit"
                disabled={savingResults}
                className="inline-flex h-12 items-center justify-center rounded-md bg-[#2f3c7e] px-5 font-bold text-white transition hover:bg-[#253066] disabled:bg-[#9ba0bd]"
              >
                {savingResults ? "Oppdaterer..." : "Oppdater fasit"}
              </button>
              <button
                type="button"
                onClick={resetAll}
                className="inline-flex h-11 items-center justify-center rounded-md border border-[#c44c3f] px-4 font-bold text-[#9f3329] transition hover:bg-[#fff1ef]"
              >
                Nullstill konkurransen
              </button>
              {adminMessage && <p className="text-sm font-medium text-[#315a48]">{adminMessage}</p>}
            </form>
          </section>

          <section className="rounded-lg border border-[#d6d0bf] bg-white p-4 shadow-sm sm:p-5">
            <h2 className="text-xl font-bold">Poengregler</h2>
            <div className="mt-4 grid gap-3">
              {questions.map((question) => (
                <div key={question.id} className="flex items-start justify-between gap-3 border-b border-[#eee8d8] pb-3 last:border-b-0 last:pb-0">
                  <p className="text-sm font-medium leading-5">{question.shortLabel}</p>
                  <p className="shrink-0 rounded-md bg-[#edf6f1] px-2 py-1 text-sm font-bold text-[#1c7c54]">
                    {question.points} p
                  </p>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}

function StatusPill({ locked, deadline, now }: { locked: boolean; deadline: string; now: number }) {
  const remaining = Math.max(0, new Date(DEADLINE_ISO).getTime() - now);
  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  const countdown = `${Math.floor(minutes / 60)}t ${String(minutes % 60).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;

  return (
    <div className="rounded-md bg-black/28 p-4">
      <p className="text-sm font-semibold text-white/72">Frist: {deadline}</p>
      <p className="mt-1 text-2xl font-black">{locked ? "Tipsene er låst" : countdown}</p>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md bg-white/14 p-3">
      <p className="text-2xl font-black">{value}</p>
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/68">{label}</p>
    </div>
  );
}

function QuestionField({
  question,
  value,
  disabled,
  onChange,
  compact = false,
  allowBlank = false,
}: {
  question: Question;
  value: string | number | null;
  disabled: boolean;
  onChange: (value: string | number) => void;
  compact?: boolean;
  allowBlank?: boolean;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold">
      <span className="flex items-center justify-between gap-3">
        <span>{compact ? question.shortLabel : question.label}</span>
        <span className="text-xs font-bold text-[#1c7c54]">{question.points} p</span>
      </span>

      {question.type === "select" && (
        <select
          value={String(value ?? "")}
          disabled={disabled}
          required={!allowBlank}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 min-w-0 rounded-md border border-[#cfc7b7] bg-white px-3 text-base outline-none transition focus:border-[#1c7c54] disabled:bg-[#ece8dd]"
        >
          <option value="">{allowBlank ? "Ikke avgjort" : "Velg"}</option>
          {question.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}

      {question.type === "number" && (
        <input
          type="number"
          min="0"
          value={value === null ? "" : String(value ?? "")}
          disabled={disabled}
          required={!allowBlank}
          onChange={(event) => onChange(event.target.value === "" ? "" : Number(event.target.value))}
          className="h-11 min-w-0 rounded-md border border-[#cfc7b7] bg-white px-3 text-base outline-none transition focus:border-[#1c7c54] disabled:bg-[#ece8dd]"
          placeholder={allowBlank ? "Ikke avgjort" : "Antall"}
        />
      )}

      {question.type === "score" && (
        <input
          value={String(value ?? "")}
          disabled={disabled}
          required={!allowBlank}
          onChange={(event) => onChange(event.target.value)}
          pattern="\\d{1,2}-\\d{1,2}"
          className="h-11 min-w-0 rounded-md border border-[#cfc7b7] bg-white px-3 text-base outline-none transition focus:border-[#1c7c54] disabled:bg-[#ece8dd]"
          placeholder={allowBlank ? "Ikke avgjort" : "2-1"}
        />
      )}

      {question.helper && !compact && <span className="text-xs font-normal leading-5 text-[#696760]">{question.helper}</span>}
    </label>
  );
}

function Leaderboard({ rows }: { rows: LeaderboardRow[] }) {
  if (rows.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-[#cfc7b7] bg-[#fffaf0] p-6 text-center">
        <p className="font-bold">Ingen tips ennå</p>
        <p className="mt-2 text-sm text-[#615f59]">Første deltaker dukker opp her straks tipset er lagret.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {rows.map((row) => (
        <article key={row.id} className="rounded-lg border border-[#e0d8c5] bg-[#fffdf7] p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-[#1c7c54] text-lg font-black text-white">
                {row.rank}
              </div>
              <div className="min-w-0">
                <h3 className="truncate text-lg font-black">{row.name}</h3>
                <p className="text-sm text-[#615f59]">{row.possible} mulige poeng avgjort</p>
              </div>
            </div>
            <p className="text-3xl font-black text-[#2f3c7e]">{row.score}</p>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
            {row.breakdown.map((item) => (
              <div key={item.questionId} className={`rounded-md px-2 py-2 ${statusClass(item.status)}`}>
                <p className="truncate text-xs font-semibold">{item.label}</p>
                <p className="text-sm font-black">
                  {item.status === "pending" ? "-" : `${item.points}/${item.maxPoints}`}
                </p>
              </div>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}

function statusClass(status: string) {
  if (status === "hit") return "bg-[#e5f5ec] text-[#12613c]";
  if (status === "partial") return "bg-[#fff0c7] text-[#7a5616]";
  if (status === "miss") return "bg-[#f7e3df] text-[#8d352c]";
  return "bg-[#eeeeea] text-[#686760]";
}

function completedResults(results: Answers) {
  return questions.filter((question) => {
    const value = results[question.id];
    return value !== "" && value !== null && value !== undefined;
  }).length;
}
