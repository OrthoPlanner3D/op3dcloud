CREATE TABLE op3dcloud.patient_models (
  id             BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
  patient_id     BIGINT NOT NULL,
  storage_prefix TEXT NOT NULL,                                -- Carpeta/prefijo en el bucket con los GLB de este caso
  spacings       JSONB NOT NULL DEFAULT '{}'::jsonb,           -- Espaciados por caso (contrato stl-render)
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT patient_models_pkey PRIMARY KEY (id),
  CONSTRAINT patient_models_storage_prefix_key UNIQUE (storage_prefix),   -- 1 fila por caso; habilita el upsert idempotente de la Cloud Function
  CONSTRAINT patient_models_patient_id_fkey FOREIGN KEY (patient_id)
    REFERENCES op3dcloud.patients (id) ON DELETE CASCADE
);

CREATE INDEX patient_models_patient_id_idx ON op3dcloud.patient_models (patient_id);

ALTER TABLE op3dcloud.patient_models ENABLE ROW LEVEL SECURITY;

CREATE POLICY "CRUD"
ON op3dcloud.patient_models FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

COMMENT ON TABLE op3dcloud.patient_models IS 'Sets de modelos 3D (GLB) de un paciente. Cada fila es un caso/escaneo cuyos archivos viven bajo storage_prefix en el bucket patient-models';

COMMENT ON COLUMN op3dcloud.patient_models.id IS 'Identificador único del set de modelos 3D';
COMMENT ON COLUMN op3dcloud.patient_models.patient_id IS 'Referencia al paciente asociado a este set de modelos 3D';
COMMENT ON COLUMN op3dcloud.patient_models.storage_prefix IS 'Prefijo/carpeta en el bucket patient-models que contiene los GLB de este caso';
COMMENT ON COLUMN op3dcloud.patient_models.spacings IS 'Datos de espaciados (JSON) del set de modelos 3D; default {}';
COMMENT ON COLUMN op3dcloud.patient_models.created_at IS 'Fecha y hora de creación del registro';
