-- Change 6 patient fields from text to text[]

-- Drop the view that depends on these columns (will be recreated by schema)
drop view if exists "op3dcloud"."view_dashboard_admin";

-- Not-null fields: convert existing text to single-element array
alter table "op3dcloud"."patients"
  alter column "treatment_objective" set default '{}'::text[],
  alter column "treatment_objective" set data type text[] using ARRAY["treatment_objective"];

alter table "op3dcloud"."patients"
  alter column "dental_restrictions" set default '{}'::text[],
  alter column "dental_restrictions" set data type text[] using ARRAY["dental_restrictions"];

alter table "op3dcloud"."patients"
  alter column "declared_limitations" set default '{}'::text[],
  alter column "declared_limitations" set data type text[] using ARRAY["declared_limitations"];

alter table "op3dcloud"."patients"
  alter column "suggested_adminations_and_actions" set default '{}'::text[],
  alter column "suggested_adminations_and_actions" set data type text[] using ARRAY["suggested_adminations_and_actions"];

-- Nullable fields: convert existing text to single-element array, keep null as null
alter table "op3dcloud"."patients"
  alter column "status_files" set data type text[] using CASE WHEN "status_files" IS NULL THEN NULL ELSE ARRAY["status_files"] END;

alter table "op3dcloud"."patients"
  alter column "case_status" set data type text[] using CASE WHEN "case_status" IS NULL THEN NULL ELSE ARRAY["case_status"] END;

-- Recreate the view
create or replace view "op3dcloud"."view_dashboard_admin" as  SELECT p.id,
    p.created_at,
    concat(p.name, ' ', p.last_name) AS patient_name,
    p.status,
    ((p.created_at + '7 days'::interval))::date AS expiration,
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
