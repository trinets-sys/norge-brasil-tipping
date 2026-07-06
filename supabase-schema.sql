create table if not exists public.entries (
  id text primary key,
  name text not null,
  answers jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.results (
  id text primary key,
  answers jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.entries enable row level security;
alter table public.results enable row level security;
