create table op3dcloud.roles (
  id bigint generated always as identity not null,
  name text not null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone null,
  constraint roles_pkey primary key (id)
) TABLESPACE pg_default;
