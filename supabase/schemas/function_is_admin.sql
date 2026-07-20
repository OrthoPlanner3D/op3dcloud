CREATE OR REPLACE FUNCTION op3dcloud.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM op3dcloud.user_has_role uhr
    JOIN op3dcloud.roles r ON r.id = uhr.id_role
    WHERE uhr.id_user = (SELECT auth.uid())
      AND r.name = 'admin'
  );
$$;

COMMENT ON FUNCTION op3dcloud.is_admin() IS 'Devuelve true si el usuario de la sesión tiene el rol admin. Es SECURITY DEFINER a propósito: lee user_has_role salteando su RLS, que es lo que evita la recursión infinita al usarla dentro de las policies de esa misma tabla. El search_path vacío obliga a calificar los nombres y cierra el vector clásico de escalada en funciones SECURITY DEFINER';
