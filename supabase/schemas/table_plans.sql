CREATE TABLE op3dcloud.plans (
  id         BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
  name       TEXT NOT NULL,
  credits    INTEGER NOT NULL,
  price      NUMERIC(12,2) NULL,           -- NULL = cotización personalizada (Corporate)
  is_active  BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT plans_pkey PRIMARY KEY (id),
  CONSTRAINT plans_name_key UNIQUE (name),
  CONSTRAINT plans_credits_check CHECK (credits > 0),
  CONSTRAINT plans_price_check CHECK (price IS NULL OR price >= 0)
);

COMMENT ON TABLE op3dcloud.plans IS 'Catálogo de packs de créditos. Compra única, no hay suscripción recurrente';

COMMENT ON COLUMN op3dcloud.plans.id IS 'Identificador único del plan';
COMMENT ON COLUMN op3dcloud.plans.name IS 'Nombre comercial del pack (Individual, Plus, Business, Corporate)';
COMMENT ON COLUMN op3dcloud.plans.credits IS 'Créditos que otorga el pack; en Corporate es el mínimo de referencia';
COMMENT ON COLUMN op3dcloud.plans.price IS 'Precio en ARS. NULL cuando se cotiza a medida (Corporate)';
COMMENT ON COLUMN op3dcloud.plans.is_active IS 'Los planes discontinuados se desactivan, no se borran: los pagos viejos los siguen referenciando';
COMMENT ON COLUMN op3dcloud.plans.created_at IS 'Fecha y hora de creación del registro';
