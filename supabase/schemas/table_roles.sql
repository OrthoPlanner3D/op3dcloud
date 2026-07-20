create table op3dcloud.roles (
  id bigint generated always as identity not null,
  name text not null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone null,
  constraint roles_pkey primary key (id)
);

alter table op3dcloud.roles enable row level security;

create policy "Todos leen el catálogo de roles"
on op3dcloud.roles for select
to authenticated
using (true);

-- name es texto libre, sin CHECK ni enum: poder editarlo era otro camino de escalada
create policy "Solo el admin modifica el catálogo de roles"
on op3dcloud.roles for all
to authenticated
using (op3dcloud.is_admin())
with check (op3dcloud.is_admin());
