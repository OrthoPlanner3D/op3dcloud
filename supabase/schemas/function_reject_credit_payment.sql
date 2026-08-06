CREATE OR REPLACE FUNCTION op3dcloud.reject_credit_payment(p_payment_id BIGINT)
RETURNS VOID
LANGUAGE plpgsql
SET search_path = ''
AS $$
DECLARE
    v_status TEXT;
BEGIN
    IF NOT op3dcloud.is_admin() THEN
        RAISE EXCEPTION 'Solo un admin puede rechazar pagos'
            USING ERRCODE = '42501';
    END IF;

    SELECT status INTO v_status
    FROM op3dcloud.credit_payments
    WHERE id = p_payment_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'La compra % no existe', p_payment_id
            USING ERRCODE = 'P0002';
    END IF;

    -- Solo desde pending: una compra aprobada ya generó su movimiento en el
    -- ledger, y rechazarla acá lo dejaría huérfano. Eso se revierte con un ajuste
    IF v_status <> 'pending' THEN
        RAISE EXCEPTION 'La compra % ya está en estado %', p_payment_id, v_status
            USING ERRCODE = 'P0001';
    END IF;

    UPDATE op3dcloud.credit_payments
    SET status = 'rejected'
    WHERE id = p_payment_id;
END;
$$;

COMMENT ON FUNCTION op3dcloud.reject_credit_payment(BIGINT) IS 'Marca una compra pending como rejected. No toca el ledger: un pago rechazado no acredita nada. Para deshacer una compra ya aprobada hay que usar adjust_client_credits';
