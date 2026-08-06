create table op3dcloud.user_has_role (
  id bigint generated always as identity not null,
  id_user uuid not null,
  id_role bigint not null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone null,
  constraint team_user_roles_pkey primary key (id),
  constraint team_user_roles_id_role_fkey foreign KEY (id_role) references op3dcloud.roles (id),
  constraint team_user_roles_id_user_fkey foreign KEY (id_user) references auth.users (id)
);

alter table op3dcloud.user_has_role enable row level security;

create policy "Cada usuario ve sus propios roles"
on op3dcloud.user_has_role for select
to authenticated
using (id_user = (select auth.uid()) or op3dcloud.is_admin());

-- Sin esto cualquier usuario logueado puede insertarse la fila del rol admin
create policy "Solo el admin asigna roles"
on op3dcloud.user_has_role for all
to authenticated
using (op3dcloud.is_admin())
with check (op3dcloud.is_admin());
