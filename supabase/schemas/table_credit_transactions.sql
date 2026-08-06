CREATE TABLE op3dcloud.credit_transactions (
  id         BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
  client_id  UUID NOT NULL,
  amount     INTEGER NOT NULL,
  type       TEXT NOT NULL,
  payment_id BIGINT NULL,
  note       TEXT NULL,
  created_by UUID NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT credit_transactions_pkey PRIMARY KEY (id),
  CONSTRAINT credit_transactions_client_id_fkey FOREIGN KEY (client_id)
    REFERENCES auth.users (id) ON DELETE CASCADE,
  CONSTRAINT credit_transactions_payment_id_fkey FOREIGN KEY (payment_id)
    REFERENCES op3dcloud.credit_payments (id) ON DELETE SET NULL,
  CONSTRAINT credit_transactions_created_by_fkey FOREIGN KEY (created_by)
    REFERENCES auth.users (id) ON DELETE SET NULL,
  CONSTRAINT credit_transactions_amount_check CHECK (amount <> 0),
  CONSTRAINT credit_transactions_type_check
    CHECK (type IN ('payment', 'adjustment'))
);

CREATE INDEX credit_transactions_client_id_idx
  ON op3dcloud.credit_transactions (client_id);

-- Una compra aprobada no puede acreditarse dos veces, pase lo que pase arriba
CREATE UNIQUE INDEX credit_transactions_payment_id_key
  ON op3dcloud.credit_transactions (payment_id) WHERE payment_id IS NOT NULL;

alter table op3dcloud.credit_transactions enable row level security;

create policy "El cliente ve sus movimientos"
on op3dcloud.credit_transactions for select
to authenticated
using (client_id = (select auth.uid()) or op3dcloud.is_admin());

-- Sin policies de UPDATE ni DELETE a propósito: la tabla es append-only. Con RLS
-- activa, lo que no tiene policy no se puede hacer, ni siquiera siendo admin. Un
-- error se corrige con un movimiento compensatorio, no reescribiendo el pasado
create policy "Solo el admin genera movimientos"
on op3dcloud.credit_transactions for insert
to authenticated
with check (op3dcloud.is_admin());

COMMENT ON TABLE op3dcloud.credit_transactions IS 'Movimientos de crédito. El saldo de un cliente es SUM(amount); no se guarda en ninguna columna. Tabla append-only: las correcciones se hacen con movimientos compensatorios, no editando ni borrando filas';

COMMENT ON COLUMN op3dcloud.credit_transactions.id IS 'Identificador único del movimiento';
COMMENT ON COLUMN op3dcloud.credit_transactions.client_id IS 'Cliente dueño del movimiento';
COMMENT ON COLUMN op3dcloud.credit_transactions.amount IS 'Créditos con signo: positivo acredita, negativo descuenta. Nunca cero';
COMMENT ON COLUMN op3dcloud.credit_transactions.type IS 'payment cuando sale de aprobar una compra; adjustment para cargas y correcciones manuales del admin';
COMMENT ON COLUMN op3dcloud.credit_transactions.payment_id IS 'Compra que originó el movimiento. NULL en las cargas manuales del admin';
COMMENT ON COLUMN op3dcloud.credit_transactions.note IS 'Motivo del movimiento. Es el único registro de por qué se hizo una carga o corrección manual';
COMMENT ON COLUMN op3dcloud.credit_transactions.created_by IS 'Admin que generó el movimiento; nullable para no perder el historial si se borra el usuario';
COMMENT ON COLUMN op3dcloud.credit_transactions.created_at IS 'Fecha y hora del movimiento';
