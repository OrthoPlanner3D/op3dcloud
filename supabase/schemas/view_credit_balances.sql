-- security_invoker = true: sin esto la vista corre como el dueño y saltea la RLS
-- de credit_transactions, o sea que cualquiera vería el saldo de todos
CREATE OR REPLACE VIEW op3dcloud.view_credit_balances
WITH (security_invoker = true) AS
SELECT
  t.client_id,
  COALESCE(SUM(t.amount), 0)::integer AS balance,
  MAX(t.created_at) AS last_movement_at
FROM op3dcloud.credit_transactions t
GROUP BY t.client_id;

COMMENT ON VIEW op3dcloud.view_credit_balances IS 'Saldo de créditos por cliente, calculado del ledger. Un cliente sin movimientos no aparece: el frontend tiene que tratar la ausencia de fila como saldo cero';
