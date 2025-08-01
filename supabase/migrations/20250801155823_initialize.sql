create schema if not exists "op3dcloud";

create type "op3dcloud"."status" as enum ('Active', 'Inactive');

create table "op3dcloud"."patients" (
    "id" bigint generated always as identity not null,
    "id_client" uuid not null,
    "name" text not null,
    "last_name" text not null,
    "type_of_plan" text not null,
    "treatment_approach" text not null,
    "treatment_objective" text not null,
    "dental_restrictions" text not null,
    "declared_limitations" text not null,
    "suggested_adminations_and_actions" text not null,
    "observations_or_instructions" text not null,
    "files" text not null,
    "sworn_declaration" boolean not null default false,
    "created_at" timestamp with time zone not null default now()
);


alter table "op3dcloud"."patients" enable row level security;

create table "op3dcloud"."roles" (
    "id" bigint generated always as identity not null,
    "name" text not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone
);


alter table "op3dcloud"."roles" enable row level security;

create table "op3dcloud"."user_has_role" (
    "id" bigint generated always as identity not null,
    "id_user" uuid not null,
    "id_role" bigint not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone
);


alter table "op3dcloud"."user_has_role" enable row level security;

CREATE UNIQUE INDEX patients_pkey ON op3dcloud.patients USING btree (id);

CREATE UNIQUE INDEX roles_pkey ON op3dcloud.roles USING btree (id);

CREATE UNIQUE INDEX team_user_roles_pkey ON op3dcloud.user_has_role USING btree (id);

alter table "op3dcloud"."patients" add constraint "patients_pkey" PRIMARY KEY using index "patients_pkey";

alter table "op3dcloud"."roles" add constraint "roles_pkey" PRIMARY KEY using index "roles_pkey";

alter table "op3dcloud"."user_has_role" add constraint "team_user_roles_pkey" PRIMARY KEY using index "team_user_roles_pkey";

alter table "op3dcloud"."patients" add constraint "patients_id_client_fkey" FOREIGN KEY (id_client) REFERENCES auth.users(id) not valid;

alter table "op3dcloud"."patients" validate constraint "patients_id_client_fkey";

alter table "op3dcloud"."user_has_role" add constraint "team_user_roles_id_role_fkey" FOREIGN KEY (id_role) REFERENCES op3dcloud.roles(id) not valid;

alter table "op3dcloud"."user_has_role" validate constraint "team_user_roles_id_role_fkey";

alter table "op3dcloud"."user_has_role" add constraint "team_user_roles_id_user_fkey" FOREIGN KEY (id_user) REFERENCES auth.users(id) not valid;

alter table "op3dcloud"."user_has_role" validate constraint "team_user_roles_id_user_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION op3dcloud.assign_client_role(p_id_client uuid)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    v_role_id BIGINT;
BEGIN
    -- Validar que el parámetro no sea NULL
    IF p_id_client IS NULL THEN
        RETURN 'User ID cannot be null';
    END IF;

    -- Buscar el ID del rol "client"
    SELECT id INTO v_role_id
    FROM op3dcloud.roles
    WHERE name = 'client';

    -- Verificar que el rol existe
    IF v_role_id IS NULL THEN
        RETURN 'Role "client" not found';
    END IF;

    -- Verificar que el usuario existe
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = p_id_client) THEN
        RETURN 'User not found';
    END IF;

    -- Verificar que el usuario no tenga ya ese rol asignado
    IF EXISTS (
        SELECT 1 FROM op3dcloud.user_has_role
        WHERE id_user = p_id_client AND id_role = v_role_id
    ) THEN
        RETURN 'User already has client role assigned';
    END IF;

    -- Insertar el nuevo registro
    INSERT INTO op3dcloud.user_has_role (id_user, id_role)
    VALUES (p_id_client, v_role_id);

    -- Retornar SUCCESS si todo fue exitoso
    RETURN 'SUCCESS';

EXCEPTION
    WHEN unique_violation THEN
        RETURN 'Duplicate role assignment detected';
    WHEN foreign_key_violation THEN
        RETURN 'Invalid user or role reference';
    WHEN OTHERS THEN
        RETURN 'Database error: ' || SQLERRM;
END;
$function$
;

CREATE OR REPLACE FUNCTION op3dcloud.assign_planner_role(p_id_planner uuid)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    v_role_id BIGINT;
BEGIN
    -- Validar que el parámetro no sea NULL
    IF p_id_planner IS NULL THEN
        RETURN 'User ID cannot be null';
    END IF;

    -- Buscar el ID del rol "planner"
    SELECT id INTO v_role_id
    FROM op3dcloud.roles
    WHERE name = 'planner';

    -- Verificar que el rol existe
    IF v_role_id IS NULL THEN
        RETURN 'Role "planner" not found';
    END IF;

    -- Verificar que el usuario existe
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = p_id_planner) THEN
        RETURN 'User not found';
    END IF;

    -- Verificar que el usuario no tenga ya ese rol asignado
    IF EXISTS (
        SELECT 1 FROM op3dcloud.user_has_role
        WHERE id_user = p_id_planner AND id_role = v_role_id
    ) THEN
        RETURN 'User already has planner role assigned';
    END IF;

    -- Insertar el nuevo registro
    INSERT INTO op3dcloud.user_has_role (id_user, id_role)
    VALUES (p_id_planner, v_role_id);

    -- Retornar SUCCESS si todo fue exitoso
    RETURN 'SUCCESS';

EXCEPTION
    WHEN unique_violation THEN
        RETURN 'Duplicate role assignment detected';
    WHEN foreign_key_violation THEN
        RETURN 'Invalid user or role reference';
    WHEN OTHERS THEN
        RETURN 'Database error: ' || SQLERRM;
END;
$function$
;

create or replace view "op3dcloud"."view_clients" as  SELECT u.id,
    r.id AS id_role,
    r.name AS role,
    u.email,
    concat_ws(' '::text, (u.raw_user_meta_data ->> 'name'::text), (u.raw_user_meta_data ->> 'last_name'::text)) AS username,
    (NULLIF((u.raw_user_meta_data ->> 'credits'::text), ''::text))::integer AS credits,
    ((u.raw_user_meta_data ->> 'status'::text))::op3dcloud.status AS status,
    (u.raw_user_meta_data ->> 'phone'::text) AS phone,
    (u.raw_user_meta_data ->> 'country'::text) AS country,
    (u.raw_user_meta_data ->> 'entity'::text) AS entity,
    (u.raw_user_meta_data ->> 'user_type'::text) AS user_type,
    (u.raw_user_meta_data ->> 'logo'::text) AS logo,
    (u.raw_user_meta_data ->> 'experience_in_digital_planning'::text) AS experience_in_digital_planning,
    (u.raw_user_meta_data ->> 'digital_model_zocalo_height'::text) AS digital_model_zocalo_height,
    (u.raw_user_meta_data ->> 'treatment_approach'::text) AS treatment_approach,
    (u.raw_user_meta_data ->> 'work_modality'::text) AS work_modality,
    (u.raw_user_meta_data ->> 'reports_language'::text) AS reports_language,
    (u.raw_user_meta_data ->> 'how_did_you_meet_us'::text) AS how_did_you_meet_us,
    u.created_at,
    ((u.created_at + '7 days'::interval))::date AS expiration,
    (NULLIF((u.raw_user_meta_data ->> 'planner'::text), ''::text))::uuid AS planner,
    (u.raw_user_meta_data ->> 'status_files'::text) AS status_files,
    (u.raw_user_meta_data ->> 'case_status'::text) AS case_status,
    (u.raw_user_meta_data ->> 'notes'::text) AS notes
   FROM ((auth.users u
     JOIN op3dcloud.user_has_role u_h_r ON ((u.id = u_h_r.id_user)))
     JOIN op3dcloud.roles r ON ((u_h_r.id_role = r.id)))
  WHERE (r.name = 'client'::text);


create policy "CRUD"
on "op3dcloud"."patients"
as permissive
for all
to authenticated
using (true)
with check (true);


create policy "CRUD"
on "op3dcloud"."roles"
as permissive
for all
to authenticated
using (true)
with check (true);


create policy "CRUD"
on "op3dcloud"."user_has_role"
as permissive
for all
to authenticated
using (true)
with check (true);



