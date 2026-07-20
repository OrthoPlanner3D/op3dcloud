CREATE TABLE op3dcloud.credit_payments (
  id           BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
  client_id    UUID NOT NULL,
  plan_id      BIGINT NOT NULL,
  amount       NUMERIC(12,2) NULL,
  credits      INTEGER NOT NULL,
  receipt_path TEXT NULL,
  status       TEXT NOT NULL DEFAULT 'pending',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT credit_payments_pkey PRIMARY KEY (id),
  CONSTRAINT credit_payments_client_id_fkey FOREIGN KEY (client_id)
    REFERENCES auth.users (id) ON DELETE CASCADE,
  CONSTRAINT credit_payments_plan_id_fkey FOREIGN KEY (plan_id)
    REFERENCES op3dcloud.plans (id) ON DELETE RESTRICT,
  CONSTRAINT credit_payments_amount_check CHECK (amount IS NULL OR amount > 0),
  CONSTRAINT credit_payments_credits_check CHECK (credits > 0),
  CONSTRAINT credit_payments_status_check
    CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled'))
);

-- Un cliente no puede tener dos compras en curso a la vez. Si se arrepiente,
-- cancela la actual (status = 'cancelled') y el índice lo deja comprar de nuevo
CREATE UNIQUE INDEX credit_payments_one_pending_per_client_idx
  ON op3dcloud.credit_payments (client_id) WHERE status = 'pending';

CREATE INDEX credit_payments_status_idx
  ON op3dcloud.credit_payments (status, created_at DESC);

alter table op3dcloud.credit_payments enable row level security;

create policy "El cliente ve sus compras"
on op3dcloud.credit_payments for select
to authenticated
using (client_id = (select auth.uid()) or op3dcloud.is_admin());

-- credits y amount son copias de plans: el WITH CHECK las obliga a coincidir
-- con el plan real, así el cliente puede insertar directo sin poder mentir
create policy "El cliente compra para sí mismo"
on op3dcloud.credit_payments for insert
to authenticated
with check (
  client_id = (select auth.uid())
  and status = 'pending'
  and exists (
    select 1 from op3dcloud.plans p
    where p.id = credit_payments.plan_id
      and p.is_active
      and p.credits = credit_payments.credits
      and p.price is not distinct from credit_payments.amount
  )
);

-- USING mira la fila vieja y WITH CHECK la nueva: solo se toca lo pending, y
-- solo puede quedar pending (subió el comprobante) o cancelled. El EXISTS se
-- repite acá porque una policy no puede comparar la fila vieja contra la nueva:
-- sin él se compra barato y después se edita el pedido mientras sigue pending
create policy "El cliente sube el comprobante o cancela"
on op3dcloud.credit_payments for update
to authenticated
using (client_id = (select auth.uid()) and status = 'pending')
with check (
  client_id = (select auth.uid())
  and status in ('pending', 'cancelled')
  and exists (
    select 1 from op3dcloud.plans p
    where p.id = credit_payments.plan_id
      and p.is_active
      and p.credits = credit_payments.credits
      and p.price is not distinct from credit_payments.amount
  )
);

-- Sin policy de DELETE a propósito: arrepentirse es cancelled, y deja rastro
create policy "El admin gestiona todas las compras"
on op3dcloud.credit_payments for all
to authenticated
using (op3dcloud.is_admin())
with check (op3dcloud.is_admin());

COMMENT ON TABLE op3dcloud.credit_payments IS 'Compras de packs de crédito. Se crean al hacer click en Comprar y quedan pending hasta que el admin verifica la transferencia';

COMMENT ON COLUMN op3dcloud.credit_payments.id IS 'Identificador único de la compra';
COMMENT ON COLUMN op3dcloud.credit_payments.client_id IS 'Cliente que hizo la compra';
COMMENT ON COLUMN op3dcloud.credit_payments.plan_id IS 'Pack de créditos comprado';
COMMENT ON COLUMN op3dcloud.credit_payments.amount IS 'Copia de plans.price al momento de la compra: congela la oferta que vio el cliente aunque después se actualice el plan. NULL en Corporate, que se cotiza a medida';
COMMENT ON COLUMN op3dcloud.credit_payments.credits IS 'Copia de plans.credits al momento de la compra, por el mismo motivo que amount. Nunca es NULL: todo plan tiene cantidad de créditos, aunque no tenga precio de lista';
COMMENT ON COLUMN op3dcloud.credit_payments.receipt_path IS 'Ruta del comprobante en el bucket payment-receipts. Mientras sea NULL la compra no entra a la bandeja del admin. El bucket se crea en la etapa de storage';
COMMENT ON COLUMN op3dcloud.credit_payments.status IS 'pending al comprar; cancelled si el cliente se arrepiente; approved o rejected cuando el admin revisa';
COMMENT ON COLUMN op3dcloud.credit_payments.created_at IS 'Fecha y hora en que el cliente hizo click en Comprar';
