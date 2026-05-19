-- Discovery Matrix: books leaderboard
create table if not exists public.books (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  author text not null,
  cover_url text,
  unique_clicks integer not null default 0,
  active_reading_sessions integer not null default 0,
  engagement_score numeric generated always as (
    unique_clicks + (active_reading_sessions * 2.5)
  ) stored,
  created_at timestamptz not null default now()
);

alter table public.books enable row level security;

create policy "Anyone can read books"
  on public.books for select
  using (true);

create or replace function public.increment_unique_click(book_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.books
  set unique_clicks = unique_clicks + 1
  where id = book_id;
end;
$$;

grant execute on function public.increment_unique_click(uuid) to anon, authenticated;

-- Seed starter data (safe to re-run: only inserts when table is empty)
insert into public.books (title, author, cover_url, unique_clicks, active_reading_sessions)
select * from (values
  ('The Great Gatsby', 'F. Scott Fitzgerald', 'https://books.google.com/books/content?id=iXn5U2IzVH0C&printsec=frontcover&img=1&zoom=1', 350, 40),
  ('1984', 'George Orwell', 'https://books.google.com/books/content?id=kotPYEqx7kMC&printsec=frontcover&img=1&zoom=1', 220, 40)
) as seed(title, author, cover_url, unique_clicks, active_reading_sessions)
where not exists (select 1 from public.books limit 1);
