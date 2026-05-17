# Paciente

## Qué es

El **paciente** es un registro clínico dentro de la plataforma. **No es un usuario que inicia sesión**: es información que el cliente carga sobre una persona real a la que va a tratar, y que sirve de base para que un planner construya el plan de tratamiento.

## Cómo se crea

El paciente lo crea siempre el **cliente** desde su panel. El formulario combina datos administrativos, datos clínicos y archivos del caso.

### Identificación

- Nombre
- Apellido

### Datos clínicos

- Tipo de plan
- Enfoque de tratamiento
- Objetivo(s) del tratamiento
- Restricciones dentales
- Limitaciones declaradas
- Sugerencias y acciones
- Observaciones e instrucciones
- Declaración jurada (aceptación)

### Archivos del caso

- Fotos
- Radiografías
- Escaneos intraorales
- Documentación suplementaria

## Habilitación de la planificación

Cada paciente tiene un flag `planning_enabled` (por defecto desactivado). Cuando el cliente termina de cargar toda la información, **lo activa** para indicarle al planner asignado que el caso está listo para planificar.

Mientras `planning_enabled` esté desactivado, el planner ve el paciente pero no puede crear o editar planes de tratamiento.

## Estado del caso y expiración

El campo `case_status` permite marcar al caso con etiquetas como `Prioridad`. La expiración del caso depende de ese estado:

- **Caso Prioridad**: vence a las **48 horas** desde la creación.
- **Caso regular**: vence a los **7 días** desde la creación.

## Relaciones

- Cada paciente pertenece a **un cliente** (`id_client`).
- Cada paciente puede tener **un planner asignado** (`id_planner`), o ninguno si todavía no fue asignado.
- Cada paciente puede tener **uno o varios planes de tratamiento** asociados.

## Campos del paciente en la base de datos

Los pacientes viven en la tabla `op3dcloud.patients`.

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | bigint (identity) | Identificador único del paciente. |
| `id_client` | uuid (FK → `auth.users.id`) | Cliente propietario del paciente. |
| `id_planner` | uuid (FK → `auth.users.id`, nullable) | Planner asignado al paciente. |
| `name` | text | Nombre del paciente. |
| `last_name` | text | Apellido del paciente. |
| `type_of_plan` | text | Tipo de plan solicitado. |
| `treatment_approach` | text | Enfoque del tratamiento. |
| `treatment_objective` | text[] | Objetivos del tratamiento. |
| `dental_restrictions` | text[] | Restricciones dentales. |
| `declared_limitations` | text[] | Limitaciones declaradas por el cliente. |
| `suggested_adminations_and_actions` | text[] | Sugerencias y acciones propuestas. |
| `observations_or_instructions` | text | Observaciones e instrucciones del cliente. |
| `sworn_declaration` | boolean | Aceptación de la declaración jurada. |
| `planning_enabled` | boolean (default false) | Habilita al planner a generar planes para este paciente. |
| `expiration` | date (nullable) | Fecha de expiración del caso. |
| `case_status` | text[] (nullable) | Etiquetas de estado del caso (ej. `Prioridad`). |
| `status` | text (nullable) | Estado general del paciente. |
| `status_files` | text[] (nullable) | Estado de los archivos cargados. |
| `notes` | text (nullable) | Notas internas. |
| `observations` | text (nullable) | Observaciones adicionales. |
| `photos` | text[] | URLs de las fotos del caso. |
| `xrays` | text[] | URLs de las radiografías. |
| `scans` | text[] | URLs de los escaneos intraorales. |
| `supplementary_docs` | text[] (nullable) | URLs de la documentación suplementaria. |
| `created_at` | timestamptz | Fecha de alta del paciente. |
