create table op3dcloud.patients (
  id bigint generated always as identity not null,
  id_client uuid not null,
  name text not null,
  last_name text not null,
  type_of_plan text not null,
  treatment_approach text not null,
  treatment_objective text not null,
  dental_restrictions text not null,
  declared_limitations text not null,
  suggested_adminations_and_actions text not null,
  observations_or_instructions text not null,
  files text not null,
  sworn_declaration boolean not null default false,
  expiration date not null,
  id_planner uuid not null,
  status_files text not null,
  case_status text not null,
  notes text not null,
  observations text not null,
  status text not null,
  created_at timestamp with time zone not null default now(),
  constraint patients_pkey primary key (id),
  constraint patients_id_client_fkey foreign key (id_client) references auth.users (id),
  constraint patients_id_planner_fkey foreign KEY (id_planner) references auth.users (id)
);

alter table op3dcloud.patients enable row level security;

create policy "CRUD"
on op3dcloud.patients for all
to authenticated
using(true)
with check (true);
