-- Enable RLS on tables
alter table users enable row level security;
alter table dreams enable row level security;
alter table proof_posts enable row level security;

-- Users table policies
-- Allow users to read their own data
create policy "Users can read own data" on users
  for select using (auth.uid() = id);

-- Allow users to update their own data
create policy "Users can update own data" on users
  for update using (auth.uid() = id);

create policy "Users can update own name" on users
  for update using (auth.uid() = id);

create policy "Users can update own venmo" on users
  for update using (auth.uid() = id);

-- Allow new users to insert their own data during signup
create policy "Users can insert own data" on users
  for insert with check (auth.uid() = id);

-- Dreams table policies
-- Allow anyone to read dreams (for explore page)
create policy "Dreams are viewable by everyone" on dreams
  for select using (true);

-- Allow authenticated users to create their own dreams
create policy "Users can create own dreams" on dreams
  for insert with check (auth.uid() = user_id);

-- Allow users to update their own dreams
create policy "Users can update own dreams" on dreams
  for update using (auth.uid() = user_id);

create policy "Users can delete own dreams" on dreams
  for delete using (auth.uid() = user_id);

-- Proof posts table policies
-- Allow anyone to read proof posts
create policy "Proof posts are viewable by everyone" on proof_posts
  for select using (true);

-- Allow authenticated users to create their own proof posts
create policy "Users can create own proof posts" on proof_posts
  for insert with check (auth.uid() = user_id);

-- Allow users to update/delete their own proof posts
create policy "Users can update own proof posts" on proof_posts
  for update using (auth.uid() = user_id);

create policy "Users can delete own proof posts" on proof_posts
  for delete using (auth.uid() = user_id);