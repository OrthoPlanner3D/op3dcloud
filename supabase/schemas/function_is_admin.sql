-- Es plpgsql y no SQL a propósito: esta función se crea antes que las tablas
-- (las policies de user_has_role y roles la necesitan), y Postgres valida el
-- cuerpo de una función SQL al crearla, así que no encontraría user_has_role
CREATE OR REPLACE FUNCTION op3dcloud.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM op3dcloud.user_has_role uhr
    JOIN op3dcloud.roles r ON r.id = uhr.id_role
    WHERE uhr.id_user = (SELECT auth.uid())
      AND r.name = 'admin'
  );
END;
$$;

COMMENT ON FUNCTION op3dcloud.is_admin() IS 'Devuelve true si el usuario de la sesión tiene el rol admin. Es SECURITY DEFINER a propósito: lee user_has_role salteando su RLS, que es lo que evita la recursión infinita al usarla dentro de las policies de esa misma tabla. El search_path vacío obliga a calificar los nombres y cierra el vector clásico de escalada en funciones SECURITY DEFINER. Es plpgsql porque se crea antes que las tablas que lee';
