create table if not exists public.cms_audit (
  id uuid primary key default gen_random_uuid(),
  user_email text not null,
  action text not null,
  section text not null,
  changed_at timestamptz not null default now()
);

create index if not exists cms_audit_changed_at_idx on public.cms_audit (changed_at desc);
create index if not exists cms_audit_section_idx on public.cms_audit (section);

alter table public.cms_audit enable row level security;

drop policy if exists "Allow authenticated read cms_audit" on public.cms_audit;
create policy "Allow authenticated read cms_audit"
  on public.cms_audit
  for select
  to authenticated
  using (true);

drop policy if exists "Allow authenticated insert cms_audit" on public.cms_audit;
create policy "Allow authenticated insert cms_audit"
  on public.cms_audit
  for insert
  to authenticated
  with check (true);
