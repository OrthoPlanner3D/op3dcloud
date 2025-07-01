create table kickhub.user_has_role (
  id bigint generated always as identity not null,
  id_user uuid not null,
  id_role bigint not null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone null,
  constraint team_user_roles_pkey primary key (id),
  constraint team_user_roles_id_role_fkey foreign KEY (id_role) references kickhub.roles (id),
  constraint team_user_roles_id_user_fkey foreign KEY (id_user) references auth.users (id)
) TABLESPACE pg_default;
