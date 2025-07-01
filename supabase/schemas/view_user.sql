create view kickhub.view_users as
select
  u.id,
  r.name as role,
  u.email,
  concat_ws(' ', u.raw_user_meta_data ->> 'name'::text, u.raw_user_meta_data ->> 'last_name'::text) as username
from
  auth.users u
  join op3dcloud.user_has_role u_h_r on u.id = u_h_r.id_user
  join op3dcloud.roles r on u_h_r.id_role = r.id;
