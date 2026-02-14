create table public.analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  task_ids uuid[] not null,
  results jsonb not null,
  summary text,
  tokens_used integer,
  model_used text,
  duration_ms integer,
  created_at timestamptz not null default now()
);

alter table public.analyses enable row level security;
create policy "Users can manage own analyses" on public.analyses for all using (auth.uid() = user_id);
