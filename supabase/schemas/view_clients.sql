CREATE OR REPLACE VIEW op3dcloud.view_clients AS
SELECT
  u.id,
  r.id as id_role,
  r.name AS role,
  u.email,
  CONCAT_WS(
    ' '::text,
    u.raw_user_meta_data ->> 'name'::text,
    u.raw_user_meta_data ->> 'last_name'::text
  ) AS username,
  NULLIF(
    u.raw_user_meta_data ->> 'credits'::text,
    ''::text
  )::integer AS credits,
  (u.raw_user_meta_data ->> 'status'::text)::op3dcloud.status AS status,

  -- Campos adicionales de raw_user_meta_data
  u.raw_user_meta_data ->> 'phone'::text AS phone,
  u.raw_user_meta_data ->> 'country'::text AS country,
  u.raw_user_meta_data ->> 'entity'::text AS entity,
  u.raw_user_meta_data ->> 'user_type'::text AS user_type,
  u.raw_user_meta_data ->> 'logo'::text AS logo,
  u.raw_user_meta_data ->> 'experience_in_digital_planning'::text AS experience_in_digital_planning,
  u.raw_user_meta_data ->> 'digital_model_zocalo_height'::text AS digital_model_zocalo_height,
  u.raw_user_meta_data ->> 'treatment_approach'::text AS treatment_approach,
  u.raw_user_meta_data ->> 'work_modality'::text AS work_modality,
  u.raw_user_meta_data ->> 'reports_language'::text AS reports_language,
  u.raw_user_meta_data ->> 'how_did_you_meet_us'::text AS how_did_you_meet_us,

  u.created_at,
  -- Campos con conversión de tipo
  (u.created_at + INTERVAL '7 days')::date AS expiration,

  NULLIF(
    u.raw_user_meta_data ->> 'planner'::text,
    ''::text
  )::uuid AS planner,

  u.raw_user_meta_data ->> 'status_files'::text AS status_files,
  u.raw_user_meta_data ->> 'case_status'::text AS case_status,
  u.raw_user_meta_data ->> 'notes'::text AS notes

FROM
  auth.users u
  JOIN op3dcloud.user_has_role u_h_r ON u.id = u_h_r.id_user
  JOIN op3dcloud.roles r ON u_h_r.id_role = r.id
WHERE
  r.name = 'client';