CREATE OR REPLACE FUNCTION op3dcloud.approve_credit_payment(p_payment_id BIGINT)
RETURNS BIGINT
LANGUAGE plpgsql
SET search_path = ''
AS $$
DECLARE
    v_payment op3dcloud.credit_payments%ROWTYPE;
    v_transaction_id BIGINT;
BEGIN
    -- La RLS ya lo frenaría, pero en un UPDATE la RLS no da error: afecta cero
    -- filas y devuelve éxito. Este check convierte eso en un 403 explícito
    IF NOT op3dcloud.is_admin() THEN
        RAISE EXCEPTION 'Solo un admin puede aprobar pagos'
            USING ERRCODE = '42501';
    END IF;

    -- FOR UPDATE bloquea la fila hasta el fin de la transacción: si dos admins
    -- aprueban la misma compra a la vez, el segundo espera y ve status approved
    SELECT * INTO v_payment
    FROM op3dcloud.credit_payments
    WHERE id = p_payment_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'La compra % no existe', p_payment_id
            USING ERRCODE = 'P0002';
    END IF;

    IF v_payment.status <> 'pending' THEN
        RAISE EXCEPTION 'La compra % ya está en estado %', p_payment_id, v_payment.status
            USING ERRCODE = 'P0001';
    END IF;

    IF v_payment.receipt_path IS NULL THEN
        RAISE EXCEPTION 'La compra % no tiene comprobante subido', p_payment_id
            USING ERRCODE = 'P0001';
    END IF;

    UPDATE op3dcloud.credit_payments
    SET status = 'approved'
    WHERE id = p_payment_id;

    INSERT INTO op3dcloud.credit_transactions
        (client_id, amount, type, payment_id, note, created_by)
    VALUES (
        v_payment.client_id,
        v_payment.credits,
        'payment',
        p_payment_id,
        'Aprobación de la compra #' || p_payment_id,
        (SELECT auth.uid())
    )
    RETURNING id INTO v_transaction_id;

    RETURN v_transaction_id;
END;
$$;

COMMENT ON FUNCTION op3dcloud.approve_credit_payment(BIGINT) IS 'Aprueba una compra pending y acredita sus créditos en el ledger, las dos cosas en la misma transacción. Devuelve el id del movimiento generado. Acredita exactamente credit_payments.credits: si hay que ajustar el número (Corporate), se edita la compra antes de aprobarla';
