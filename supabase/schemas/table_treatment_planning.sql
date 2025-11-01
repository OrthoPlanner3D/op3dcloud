create table op3dcloud.treatment_planning (
  id bigint generated always as identity not null,
  maxillaries text not null,
  upper_quantity integer not null,
  lower_quantity integer not null,
  simulation_render text null,
  complexity text not null,
  prognosis text not null,
  manufacturing text[] not null default '{}',
  diagnostic_considerations text[] not null default '{}',
  clinical_action_criteria text[] not null default '{}',
  referrals text[] null default '{}',
  sales_potential text[] null default '{}',
  additional_observations text null,
  created_at timestamp with time zone not null default now(),
  
  constraint treatment_planning_pkey primary key (id)
);

alter table op3dcloud.treatment_planning enable row level security;

create policy "CRUD"
on op3dcloud.treatment_planning for all
to authenticated
using(true)
with check (true);
