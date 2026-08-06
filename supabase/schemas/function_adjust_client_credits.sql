CREATE OR REPLACE FUNCTION op3dcloud.adjust_client_credits(
    p_client_id UUID,
    p_amount    INTEGER,
    p_note      TEXT
)
RETURNS BIGINT
LANGUAGE plpgsql
SET search_path = ''
AS $$
DECLARE
    v_transaction_id BIGINT;
BEGIN
    IF NOT op3dcloud.is_admin() THEN
        RAISE EXCEPTION 'Solo un admin puede ajustar créditos'
            USING ERRCODE = '42501';
    END IF;

    IF p_amount IS NULL OR p_amount = 0 THEN
        RAISE EXCEPTION 'El ajuste tiene que ser distinto de cero'
            USING ERRCODE = 'P0001';
    END IF;

    -- Obligatoria: es el único registro de por qué se movieron estos créditos
    IF p_note IS NULL OR btrim(p_note) = '' THEN
        RAISE EXCEPTION 'El ajuste necesita un motivo'
            USING ERRCODE = 'P0001';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = p_client_id) THEN
        RAISE EXCEPTION 'El cliente % no existe', p_client_id
            USING ERRCODE = 'P0002';
    END IF;

    INSERT INTO op3dcloud.credit_transactions
        (client_id, amount, type, payment_id, note, created_by)
    VALUES (
        p_client_id,
        p_amount,
        'adjustment',
        NULL,
        btrim(p_note),
        (SELECT auth.uid())
    )
    RETURNING id INTO v_transaction_id;

    RETURN v_transaction_id;
END;
$$;

COMMENT ON FUNCTION op3dcloud.adjust_client_credits(UUID, INTEGER, TEXT) IS 'Inserta un movimiento manual en el ledger: positivo acredita, negativo descuenta. El motivo es obligatorio porque es el único registro de por qué se hizo. Es también la forma de revertir una aprobación equivocada, con un movimiento compensatorio';
