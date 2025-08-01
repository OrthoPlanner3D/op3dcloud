create table op3dcloud.roles (
  id bigint generated always as identity not null,
  name text not null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone null,
  constraint roles_pkey primary key (id)
);

alter table op3dcloud.roles enable row level security;

create policy "CRUD"
on op3dcloud.roles for all
to authenticated
using(true)
with check (true);
