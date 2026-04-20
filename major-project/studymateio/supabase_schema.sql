-- Create a table for public profiles
create table public.profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone,
  full_name text,
  avatar_url text
);

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

create policy "Users can insert their own profile." on public.profiles
  for insert with check ((select auth.uid()) = id);

create policy "Users can update own profile." on public.profiles
  for update using ((select auth.uid()) = id);

-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
-- See https://supabase.com/docs/guides/auth/managing-user-data#using-triggers for more details.
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create table for subjects
create table public.subjects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  name text not null,
  icon text not null,
  color text not null,
  progress integer default 0,
  exam_date timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for subjects
alter table public.subjects enable row level security;

create policy "Users can view their own subjects." on public.subjects
  for select using ((select auth.uid()) = user_id);

create policy "Users can insert their own subjects." on public.subjects
  for insert with check ((select auth.uid()) = user_id);

create policy "Users can update their own subjects." on public.subjects
  for update using ((select auth.uid()) = user_id);

create policy "Users can delete their own subjects." on public.subjects
  for delete using ((select auth.uid()) = user_id);

-- Create table for planner_sessions
create table public.planner_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references public.profiles(id),
  subject_id uuid not null references public.subjects(id) on delete cascade,
  title text not null,
  day_of_week text not null,
  start_time time not null,
  duration_minutes integer not null,
  color text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for planner_sessions
alter table public.planner_sessions enable row level security;

create policy "Users can view their own planner sessions." on public.planner_sessions
  for select using ((select auth.uid()) = user_id);

create policy "Users can insert their own planner sessions." on public.planner_sessions
  for insert with check ((select auth.uid()) = user_id);

create policy "Users can update their own planner sessions." on public.planner_sessions
  for update using ((select auth.uid()) = user_id);

create policy "Users can delete their own planner sessions." on public.planner_sessions
  for delete using ((select auth.uid()) = user_id);
