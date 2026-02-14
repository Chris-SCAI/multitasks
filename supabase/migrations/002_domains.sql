create table public.domains (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null check (char_length(name) <= 50),
  color text not null,
  icon text not null default 'folder',
  sort_order integer not null default 0,
  is_archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.domains enable row level security;
create policy "Users can manage own domains" on public.domains for all using (auth.uid() = user_id);
