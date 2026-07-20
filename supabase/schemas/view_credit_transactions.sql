-- security_invoker = true por el mismo motivo que view_credit_balances: que la
-- policy "El cliente ve sus movimientos" siga aplicando adentro de la vista
CREATE OR REPLACE VIEW op3dcloud.view_credit_transactions
WITH (security_invoker = true) AS
SELECT
  t.id,
  t.client_id,
  t.amount,
  t.type,
  t.note,
  t.created_by,
  t.created_at,
  t.payment_id,
  pay.status  AS payment_status,
  pay.amount  AS payment_amount,
  pl.name     AS plan_name
FROM op3dcloud.credit_transactions t
LEFT JOIN op3dcloud.credit_payments pay ON pay.id = t.payment_id
LEFT JOIN op3dcloud.plans pl ON pl.id = pay.plan_id;

COMMENT ON VIEW op3dcloud.view_credit_transactions IS 'Historial de movimientos con el plan y el estado de la compra que los originó. Los LEFT JOIN son porque un ajuste manual no tiene compra detrás';
