drop view if exists "op3dcloud"."view_dashboard_admin";

alter table "op3dcloud"."treatment_planning" drop column "clinical_action_criteria";

alter table "op3dcloud"."treatment_planning" drop column "diagnostic_considerations";

alter table "op3dcloud"."treatment_planning" drop column "lower_quantity";

alter table "op3dcloud"."treatment_planning" drop column "manufacturing";

alter table "op3dcloud"."treatment_planning" drop column "maxillaries";

alter table "op3dcloud"."treatment_planning" drop column "referrals";

alter table "op3dcloud"."treatment_planning" drop column "sales_potential";

alter table "op3dcloud"."treatment_planning" drop column "simulation_render";

alter table "op3dcloud"."treatment_planning" drop column "upper_quantity";

alter table "op3dcloud"."treatment_planning" add column "commercial_potential" text[] default '{}'::text[];

alter table "op3dcloud"."treatment_planning" add column "diagnosis" text[] not null default '{}'::text[];

alter table "op3dcloud"."treatment_planning" add column "laboratory" text[] not null default '{}'::text[];

alter table "op3dcloud"."treatment_planning" add column "lower_aligners" integer;

alter table "op3dcloud"."treatment_planning" add column "planning" text[] not null default '{}'::text[];

alter table "op3dcloud"."treatment_planning" add column "quality_extraoral" text[] not null default '{}'::text[];

alter table "op3dcloud"."treatment_planning" add column "quality_information" text[] not null default '{}'::text[];

alter table "op3dcloud"."treatment_planning" add column "quality_intraoral" text[] not null default '{}'::text[];

alter table "op3dcloud"."treatment_planning" add column "quality_scan" text[] not null default '{}'::text[];

alter table "op3dcloud"."treatment_planning" add column "quality_xrays" text[] not null default '{}'::text[];

alter table "op3dcloud"."treatment_planning" add column "restrictions" text[] not null default '{}'::text[];

alter table "op3dcloud"."treatment_planning" add column "technical_report_url" text;

alter table "op3dcloud"."treatment_planning" add column "tracking_angulations" text;

alter table "op3dcloud"."treatment_planning" add column "tracking_expansion" text;

alter table "op3dcloud"."treatment_planning" add column "tracking_extrusion_buttons" text;

alter table "op3dcloud"."treatment_planning" add column "tracking_extrusions" text;

alter table "op3dcloud"."treatment_planning" add column "tracking_intrusions" text;

alter table "op3dcloud"."treatment_planning" add column "tracking_rotations" text;

alter table "op3dcloud"."treatment_planning" add column "tracking_torque" text;

alter table "op3dcloud"."treatment_planning" add column "tracking_translations" text;

alter table "op3dcloud"."treatment_planning" add column "upper_aligners" integer;

alter table "op3dcloud"."treatment_planning" add column "video_url" text;

alter table "op3dcloud"."treatment_planning" alter column "complexity" drop not null;

alter table "op3dcloud"."treatment_planning" alter column "prognosis" drop not null;

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



