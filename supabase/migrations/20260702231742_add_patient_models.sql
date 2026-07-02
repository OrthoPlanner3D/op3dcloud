drop view if exists "op3dcloud"."view_dashboard_admin";


  create table "op3dcloud"."patient_models" (
    "id" bigint generated always as identity not null,
    "patient_id" bigint not null,
    "storage_prefix" text not null,
    "created_at" timestamp with time zone not null default now()
      );


alter table "op3dcloud"."patient_models" enable row level security;

CREATE INDEX patient_models_patient_id_idx ON op3dcloud.patient_models USING btree (patient_id);

CREATE UNIQUE INDEX patient_models_pkey ON op3dcloud.patient_models USING btree (id);

alter table "op3dcloud"."patient_models" add constraint "patient_models_pkey" PRIMARY KEY using index "patient_models_pkey";

alter table "op3dcloud"."patient_models" add constraint "patient_models_patient_id_fkey" FOREIGN KEY (patient_id) REFERENCES op3dcloud.patients(id) ON DELETE CASCADE not valid;

alter table "op3dcloud"."patient_models" validate constraint "patient_models_patient_id_fkey";

create or replace view "op3dcloud"."view_dashboard_admin" as  SELECT p.id,
    p.created_at,
    concat(p.name, ' ', p.last_name) AS patient_name,
    p.status,
        CASE
            WHEN ('Prioridad'::text = ANY (p.case_status)) THEN ((now() + '48:00:00'::interval))::date
            ELSE ((p.created_at + '7 days'::interval))::date
        END AS expiration,
    vp.id AS planner_id,
    vp.username AS planner_name,
    vc.id AS client_id,
    vc.username AS client_name,
    p.status_files,
    p.case_status,
    p.notes,
    p.planning_enabled
   FROM ((op3dcloud.patients p
     LEFT JOIN op3dcloud.view_clients vc ON ((p.id_client = vc.id)))
     LEFT JOIN op3dcloud.view_planners vp ON ((p.id_planner = vp.id)));


grant delete on table "op3dcloud"."patient_models" to "anon";

grant insert on table "op3dcloud"."patient_models" to "anon";

grant references on table "op3dcloud"."patient_models" to "anon";

grant select on table "op3dcloud"."patient_models" to "anon";

grant trigger on table "op3dcloud"."patient_models" to "anon";

grant truncate on table "op3dcloud"."patient_models" to "anon";

grant update on table "op3dcloud"."patient_models" to "anon";

grant delete on table "op3dcloud"."patient_models" to "authenticated";

grant insert on table "op3dcloud"."patient_models" to "authenticated";

grant references on table "op3dcloud"."patient_models" to "authenticated";

grant select on table "op3dcloud"."patient_models" to "authenticated";

grant trigger on table "op3dcloud"."patient_models" to "authenticated";

grant truncate on table "op3dcloud"."patient_models" to "authenticated";

grant update on table "op3dcloud"."patient_models" to "authenticated";

grant delete on table "op3dcloud"."patient_models" to "service_role";

grant insert on table "op3dcloud"."patient_models" to "service_role";

grant references on table "op3dcloud"."patient_models" to "service_role";

grant select on table "op3dcloud"."patient_models" to "service_role";

grant trigger on table "op3dcloud"."patient_models" to "service_role";

grant truncate on table "op3dcloud"."patient_models" to "service_role";

grant update on table "op3dcloud"."patient_models" to "service_role";


  create policy "CRUD"
  on "op3dcloud"."patient_models"
  as permissive
  for all
  to authenticated
using (true)
with check (true);



  create policy "Authenticated users can delete patient models"
  on "storage"."objects"
  as permissive
  for delete
  to authenticated
using ((bucket_id = 'patient-models'::text));



  create policy "Authenticated users can read patient models"
  on "storage"."objects"
  as permissive
  for select
  to authenticated
using ((bucket_id = 'patient-models'::text));



  create policy "Authenticated users can upload patient models"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check ((bucket_id = 'patient-models'::text));



