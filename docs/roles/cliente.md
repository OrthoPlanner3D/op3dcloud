# Cliente

## Quién es

El **cliente** es el profesional de la ortodoncia (o la clínica) que contrata la plataforma. Es el punto de entrada del negocio: se registra desde el sitio público, gestiona a sus pacientes y solicita planes de tratamiento al planner que tiene asignado.

## Registro

El alta de un cliente es **autoservicio** y se hace desde la página pública `/registro`. El formulario está dividido en 4 pasos:

### Paso 1 — Datos personales

- Nombre
- Apellido
- Email
- Confirmación de email
- Contraseña (mínimo 6 caracteres)
- Teléfono
- País
- Entidad (clínica o empresa a la que pertenece)
- Tipo de usuario

### Paso 2 — Branding

- Logo (PNG, JPG o WebP)

### Paso 3 — Experiencia

- Experiencia en planificación digital
- Altura del zócalo del modelo digital

### Paso 4 — Preferencias

- Enfoque de tratamiento
- Modalidad de trabajo
- Idioma de los reportes
- Cómo conoció la plataforma

Al completar el registro, el cliente recibe automáticamente el rol `client` y queda listo para iniciar sesión.

## Login

El cliente ingresa por `/inicia-sesion` con su email y contraseña.

## Bienvenida (onboarding)

La primera vez que el cliente entra a la plataforma se le muestra una pantalla de bienvenida con la presentación inicial. Esa pantalla se muestra **una sola vez**: a partir de la segunda sesión el cliente entra directo al dashboard.

## Qué puede hacer

Una vez dentro de la plataforma, el cliente puede:

- **Dar de alta pacientes**: completar el formulario clínico y subir los archivos del caso (fotos, radiografías, escaneos intraorales y documentación suplementaria).
- **Listar y editar sus pacientes**: ver toda su cartera de pacientes con su estado.
- **Habilitar la planificación** de un paciente: cuando considera que la información del caso está completa, activa el flag para que el planner pueda empezar a trabajar.
- **Asignar un planner** a cada paciente desde su tabla de pacientes (cuando aplica).
- **Compartir el link público** del plan de tratamiento con su propio paciente o equipo, una vez que el planner lo publicó.

## Campos del cliente en la base de datos

Los datos del cliente se exponen a través de la vista `op3dcloud.view_clients`, que combina los datos de autenticación de Supabase con la información extendida almacenada en `raw_user_meta_data`.

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | uuid | Identificador único del usuario en Supabase Auth. |
| `id_role` / `role` | bigint / text | Rol asociado (siempre `client` en esta vista). |
| `email` | text | Email de login. |
| `username` | text | Nombre + apellido concatenados. |
| `credits` | integer | Créditos disponibles del cliente. |
| `status` | enum `status` | `Active` o `Inactive`. |
| `phone` | text | Teléfono de contacto. |
| `country` | text | País. |
| `entity` | text | Entidad (clínica o empresa). |
| `user_type` | text | Tipo de usuario. |
| `logo` | text | URL del logo del cliente. |
| `experience_in_digital_planning` | text | Nivel de experiencia digital declarado. |
| `digital_model_zocalo_height` | text | Altura del zócalo de modelo digital. |
| `treatment_approach` | text | Enfoque de tratamiento preferido. |
| `work_modality` | text | Modalidad de trabajo. |
| `reports_language` | text | Idioma elegido para los reportes. |
| `how_did_you_meet_us` | text | Origen del contacto con la plataforma. |
| `created_at` | timestamptz | Fecha de registro. |
| `expiration` | date | Fecha de vencimiento (created_at + 7 días). |
| `planner` | uuid | Planner asociado al cliente. |
| `status_files` | text | Estado de los archivos del cliente. |
| `case_status` | text | Estado del caso. |
| `notes` | text | Notas internas del cliente. |
