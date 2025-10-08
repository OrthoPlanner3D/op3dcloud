create or replace view op3dcloud.view_users as
select
  u.id as id_user,
  r.id as id_role,
  r.name as role_name,
  u.email,
  (u.raw_user_meta_data ->> 'name' ::text) || '' ::text || (u.raw_user_meta_data ->> 'last_name' ::text) as full_name
from
  auth.users u
  join op3dcloud.user_has_role u_h_r on u.id = u_h_r.id_user
  join op3dcloud.roles r on u_h_r.id_role = r.id;