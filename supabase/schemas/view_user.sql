create view op3dcloud.view_users as
select
  u.id,
  r.name as role,
  u.email,
  concat_ws(' ', u.raw_user_meta_data ->> 'name', u.raw_user_meta_data ->> 'last_name') as username,
  nullif(u.raw_user_meta_data ->> 'credits', '')::integer as credits,
  (u.raw_user_meta_data ->> 'status')::op3dcloud.status as status
from
  auth.users u
  join op3dcloud.user_has_role u_h_r on u.id = u_h_r.id_user
  join op3dcloud.roles r on u_h_r.id_role = r.id;
