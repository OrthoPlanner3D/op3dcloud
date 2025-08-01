create table op3dcloud.clients (
  id bigint generated always as identity not null,
  password text not null,
  name text not null,
  last_name text not null,
  phone text not null,
  country text not null,
  entity text not null,
  user_type text not null,
  logo text not null,
  experience_in_digital_planning text not null,
  digital_model_zocalo_height text not null,
  treatment_approach text not null,
  work_modality text not null,
  reports_language text not null,
  how_did_you_meet_us text not null,
  credits integer not null,
  status text not null,
  expiration date not null,
  planner uuid not null,
  status_files text not null,
  case_status text not null,
  notes text not null,
  created_at timestamp with time zone not null default now(),
  constraint clients_pkey primary key (id),
  constraint clients_planner_fkey foreign KEY (planner) references auth.users (id)
);

alter table op3dcloud.clients enable row level security;

create policy "CRUD"
on op3dcloud.clients for all
to authenticated
using(true)
with check (true);
