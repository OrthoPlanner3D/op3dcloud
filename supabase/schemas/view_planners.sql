create view op3dcloud.view_planners as
select
  u.id,
  r.id as id_role,
  r.name as role,
  u.email,
  concat_ws(
    ' '::text,
    u.raw_user_meta_data ->> 'name'::text,
    u.raw_user_meta_data ->> 'last_name'::text
  ) as username,
  NULLIF(
    u.raw_user_meta_data ->> 'credits'::text,
    ''::text
  )::integer as credits,
  (u.raw_user_meta_data ->> 'status'::text)::op3dcloud.status as status,
  u.raw_user_meta_data ->> 'phone'::text as phone,
  u.raw_user_meta_data ->> 'country'::text as country,
  u.raw_user_meta_data ->> 'entity'::text as entity,
  u.raw_user_meta_data ->> 'user_type'::text as user_type,
  u.raw_user_meta_data ->> 'logo'::text as logo,
  u.raw_user_meta_data ->> 'experience_in_digital_planning'::text as experience_in_digital_planning,
  u.raw_user_meta_data ->> 'digital_model_zocalo_height'::text as digital_model_zocalo_height,
  u.raw_user_meta_data ->> 'treatment_approach'::text as treatment_approach,
  u.raw_user_meta_data ->> 'work_modality'::text as work_modality,
  u.raw_user_meta_data ->> 'reports_language'::text as reports_language,
  u.raw_user_meta_data ->> 'how_did_you_meet_us'::text as how_did_you_meet_us,
  u.created_at,
  (u.created_at + '7 days'::interval)::date as expiration,
  NULLIF(
    u.raw_user_meta_data ->> 'planner'::text,
    ''::text
  )::uuid as planner,
  u.raw_user_meta_data ->> 'status_files'::text as status_files,
  u.raw_user_meta_data ->> 'case_status'::text as case_status,
  u.raw_user_meta_data ->> 'notes'::text as notes
from
  auth.users u
  join op3dcloud.user_has_role u_h_r on u.id = u_h_r.id_user
  join op3dcloud.roles r on u_h_r.id_role = r.id
where
  r.name = 'planner'::text;