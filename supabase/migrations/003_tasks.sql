create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  domain_id uuid references public.domains(id) on delete set null,
  title text not null check (char_length(title) <= 200),
  description text default '' check (char_length(description) <= 2000),
  status text not null default 'todo' check (status in ('todo', 'in_progress', 'done', 'cancelled')),
  deadline date,
  estimated_duration integer,
  priority text not null default 'non_definie' check (priority in ('haute', 'moyenne', 'basse', 'non_definie')),
  eisenhower_quadrant text,
  next_action text check (char_length(next_action) <= 300),
  ai_analysis_id uuid,
  reminder_at timestamptz,
  reminder_sent boolean not null default false,
  recurrence_rule jsonb,
  sort_order integer not null default 0,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.tasks enable row level security;
create policy "Users can manage own tasks" on public.tasks for all using (auth.uid() = user_id);
create index idx_tasks_user_status on public.tasks(user_id, status);
create index idx_tasks_user_deadline on public.tasks(user_id, deadline);
create index idx_tasks_user_domain on public.tasks(user_id, domain_id);
