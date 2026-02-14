-- Additional RLS policies for insert
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users can insert own domains" on public.domains for insert with check (auth.uid() = user_id);
create policy "Users can insert own tasks" on public.tasks for insert with check (auth.uid() = user_id);
create policy "Users can insert own analyses" on public.analyses for insert with check (auth.uid() = user_id);
