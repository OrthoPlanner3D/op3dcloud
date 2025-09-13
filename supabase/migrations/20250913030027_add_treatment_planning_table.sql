create table "op3dcloud"."treatment_planning" (
    "id" bigint generated always as identity not null,
    "maxillaries" text not null,
    "upper_quantity" integer not null,
    "lower_quantity" integer not null,
    "simulation_render" text,
    "complexity" text not null,
    "prognosis" text not null,
    "manufacturing" text[] not null default '{}'::text[],
    "diagnostic_considerations" text[] not null default '{}'::text[],
    "clinical_action_criteria" text[] not null default '{}'::text[],
    "referrals" text[] default '{}'::text[],
    "sales_potential" text[] default '{}'::text[],
    "additional_observations" text,
    "created_at" timestamp with time zone not null default now()
);


alter table "op3dcloud"."treatment_planning" enable row level security;

CREATE UNIQUE INDEX treatment_planning_pkey ON op3dcloud.treatment_planning USING btree (id);

alter table "op3dcloud"."treatment_planning" add constraint "treatment_planning_pkey" PRIMARY KEY using index "treatment_planning_pkey";

create policy "CRUD"
on "op3dcloud"."treatment_planning"
as permissive
for all
to authenticated
using (true)
with check (true);



