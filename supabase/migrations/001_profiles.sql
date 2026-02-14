create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  display_name text,
  plan text not null default 'free' check (plan in ('free', 'ia_quotidienne', 'pro_sync')),
  stripe_customer_id text,
  stripe_subscription_id text,
  analyses_used_total integer not null default 0,
  analyses_used_period integer not null default 0,
  period_reset_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
