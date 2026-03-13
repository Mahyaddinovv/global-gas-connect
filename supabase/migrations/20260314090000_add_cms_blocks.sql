create table if not exists public.cms_blocks (
  id uuid primary key default gen_random_uuid(),
  section text not null unique,
  "order" integer not null,
  visible boolean not null default true,
  bg_type text not null default 'solid',
  bg_value text not null default 'transparent',
  alignment text not null default 'left',
  padding integer not null default 96,
  updated_at timestamptz not null default now()
);

alter table public.cms_blocks enable row level security;

drop policy if exists "Allow public read cms_blocks" on public.cms_blocks;
create policy "Allow public read cms_blocks"
  on public.cms_blocks
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Allow authenticated manage cms_blocks" on public.cms_blocks;
create policy "Allow authenticated manage cms_blocks"
  on public.cms_blocks
  for all
  to authenticated
  using (true)
  with check (true);
