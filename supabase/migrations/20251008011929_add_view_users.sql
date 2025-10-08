create or replace view "op3dcloud"."view_users" as  SELECT u.id AS id_user,
    r.id AS id_role,
    r.name AS role_name,
    u.email,
    (((u.raw_user_meta_data ->> 'name'::text) || ''::text) || (u.raw_user_meta_data ->> 'last_name'::text)) AS full_name
   FROM ((auth.users u
     JOIN op3dcloud.user_has_role u_h_r ON ((u.id = u_h_r.id_user)))
     JOIN op3dcloud.roles r ON ((u_h_r.id_role = r.id)));



