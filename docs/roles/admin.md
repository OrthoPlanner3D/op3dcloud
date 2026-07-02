# Admin

## Quién es

El **admin** es el usuario con acceso superior de la plataforma. Supervisa toda la operación: ve a todos los clientes, todos los pacientes y todos los planners, y es el responsable de gestionar el ciclo de vida de los planners.

## Qué puede hacer

El admin tiene todas las capacidades del planner y, además, capacidades exclusivas de gestión:

### Dashboard global

- Ve todos los pacientes de la plataforma en una sola tabla.
- Por cada paciente muestra: cliente propietario, planner asignado, estado del caso, estado de los archivos, fecha de expiración y si la planificación está habilitada.
- Indicador de expiración: **48 horas** para casos `Prioridad`, **7 días** para el resto.

### Gestión de planners (página de Accesos)

- Listar todos los planners de la plataforma.
- Buscar planners por nombre.
- Cambiar el estado de cada planner entre **Activo** e **Inactivo**.
  - Un planner **Inactivo** queda deshabilitado: no puede operar en la plataforma ni se le pueden asignar nuevos casos.

### Asignación de planners a pacientes

- Asignar o reasignar un planner a cualquier paciente desde la tabla principal.
- Cambiar el planner asignado a un cliente.

### Gestión de clientes

- Editar la información de los clientes.

## Tablas y vistas que dan soporte al admin

### Tabla `op3dcloud.roles`

Catálogo de roles disponibles en la plataforma.

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | bigint (identity) | Identificador del rol. |
| `name` | text | Nombre del rol (`admin`, `planner`, `client`). |
| `created_at` | timestamptz | Fecha de alta del rol. |
| `updated_at` | timestamptz (nullable) | Fecha de última modificación. |

### Tabla `op3dcloud.user_has_role`

Vínculo entre usuarios y roles. Un usuario puede tener uno o más roles.

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | bigint (identity) | Identificador del vínculo. |
| `id_user` | uuid (FK → `auth.users.id`) | Usuario. |
| `id_role` | bigint (FK → `roles.id`) | Rol asignado. |
| `created_at` | timestamptz | Fecha de asignación. |
| `updated_at` | timestamptz (nullable) | Fecha de última modificación. |

### Vista `op3dcloud.view_users`

Listado de usuarios con su rol asociado, ideal para consultas rápidas de quién es quién en el sistema.

| Campo | Tipo | Descripción |
|---|---|---|
| `id_user` | uuid | ID del usuario. |
| `id_role` | bigint | ID del rol. |
| `role_name` | text | Nombre del rol. |
| `email` | text | Email del usuario. |
| `full_name` | text | Nombre completo. |

### Vista `op3dcloud.view_planners`

Información extendida de los planners. Contiene los mismos campos que la vista de clientes (créditos, estado, datos de contacto, preferencias) filtrada por el rol `planner`. Permite al admin gestionar el estado y los datos de cada planner.

### Vista `op3dcloud.view_dashboard_admin`

Vista agregada que alimenta el dashboard del admin: un registro por paciente con los datos del cliente y del planner ya unidos.

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | bigint | ID del paciente. |
| `created_at` | timestamptz | Fecha de alta del paciente. |
| `patient_name` | text | Nombre completo del paciente. |
| `status` | text | Estado del paciente. |
| `expiration` | date | 48 horas si el caso es `Prioridad`, si no `created_at + 7 días`. |
| `planner_id` | uuid | ID del planner asignado. |
| `planner_name` | text | Nombre del planner asignado. |
| `client_id` | uuid | ID del cliente propietario. |
| `client_name` | text | Nombre del cliente propietario. |
| `status_files` | text[] | Estado de los archivos del paciente. |
| `case_status` | text[] | Estado del caso (ej. `Prioridad`). |
| `notes` | text | Notas del paciente. |
| `planning_enabled` | boolean | Indica si el cliente habilitó la planificación. |

### Enum `op3dcloud.status`

Valores posibles del estado de un usuario: `Active`, `Inactive`. Se usa principalmente para activar o desactivar planners desde la página de Accesos.
