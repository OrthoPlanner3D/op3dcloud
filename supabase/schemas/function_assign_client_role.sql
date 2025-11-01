CREATE OR REPLACE FUNCTION op3dcloud.assign_client_role(p_id_client UUID)
RETURNS TEXT AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;