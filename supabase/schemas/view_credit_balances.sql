-- El WHERE es el que protege de verdad, no el security_invoker: db diff no emite
-- las opciones de vista y se lo come, así que la opción nunca llega a la base
-- real. Duplica la policy "El cliente ve sus movimientos": si cambia una, la otra
-- también
CREATE OR REPLACE VIEW op3dcloud.view_credit_balances
WITH (security_invoker = true) AS
SELECT
  t.client_id,
  COALESCE(SUM(t.amount), 0)::integer AS balance,
  MAX(t.created_at) AS last_movement_at
FROM op3dcloud.credit_transactions t
WHERE t.client_id = (SELECT auth.uid()) OR op3dcloud.is_admin()
GROUP BY t.client_id;

COMMENT ON VIEW op3dcloud.view_credit_balances IS 'Saldo de créditos por cliente, calculado del ledger. Un cliente sin movimientos no aparece: el frontend tiene que tratar la ausencia de fila como saldo cero';
