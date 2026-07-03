# Planner

## Quién es

El **planner** es el profesional encargado de construir los **planes de tratamiento** sobre los pacientes que los clientes dan de alta. El planner es asignado a un paciente por el cliente o por el admin, y a partir de allí trabaja sobre la información clínica y los archivos cargados.

## Asignación

- Un planner puede estar asignado a **varios pacientes** y, por lo tanto, a varios clientes.
- La asignación se realiza desde la tabla de pacientes (campo `id_planner` de cada paciente).
- El planner ve únicamente los pacientes que tiene asignados; el admin ve todos.

## Qué puede hacer

- **Ver el listado de pacientes asignados** y el detalle clínico de cada uno.
- **Crear planes de tratamiento** para cada paciente, una vez que el cliente habilita la planificación (`planning_enabled`).
- **Editar planes existentes** y agregar nuevos planes al mismo paciente cuando hace falta.

Un paciente puede tener **varios planes de tratamiento** a lo largo del tiempo (por ejemplo, planes refinados o iteraciones del tratamiento).

## Contenido de un plan de tratamiento

Un plan de tratamiento está compuesto por varios bloques de información:

### Diagnóstico

- Diagnóstico presuntivo general.
- Pronóstico (favorable / reservada).
- Complejidad del caso (baja / moderada / alta).
- Evaluación de la calidad de la información, escaneo, radiografías, fotos intraorales y extraorales.
- Restricciones biomecánicas identificadas.

### Planificación

- Criterios de planificación y accionar clínico.
- Recomendaciones para el laboratorio.
- Potencial comercial (tratamientos complementarios sugeridos).
- Observaciones adicionales.

### Recursos del plan

- URL del **informe técnico** (PDF).
- URL del **video** de simulación del tratamiento.

### Tracking de movimientos

Cada uno de estos campos describe las piezas dentarias que requieren un control especial:

- Rotaciones
- Extrusiones
- Botones de extrusión
- Intrusiones
- Torque / inclinaciones
- Angulaciones
- Traslaciones
- Expansión / compresión

### Alineadores

- Cantidad de alineadores para el **maxilar superior**.
- Cantidad de alineadores para el **maxilar inferior**.

## Flujo de aprobación pública

Cada plan de tratamiento cuenta con un **link público** que el planner copia desde la plataforma y comparte con el cliente (por mail, mensajería o el medio que prefiera).

- URL pública: `/planificacion/:patientId`.
- La vista pública es **de solo lectura**: muestra el plan completo (datos clínicos, tracking, alineadores, informe técnico y video).
- Sobre esa vista, el cliente puede:
  - **Aprobar** el plan: confirma que el plan satisface las necesidades del caso.
  - **Solicitar modificación**: pedir cambios al planner sobre alguno de los aspectos del plan.

Cada acción queda registrada con los datos del paciente para que tanto el planner como el admin puedan dar seguimiento.

## Campos del plan de tratamiento en la base de datos

Los planes viven en la tabla `op3dcloud.treatment_planning`. La tabla permite **lectura pública** (rol `anon`), lo que habilita el flujo de aprobación por link público.

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | bigint (identity) | Identificador único del plan. |
| `patient_id` | bigint (FK → `patients.id`, ON DELETE CASCADE) | Paciente al que pertenece el plan. |
| `created_at` | timestamptz | Fecha de creación del plan. |
| `render_3d` | text | URL del render 3D del tratamiento. |
| `technical_report_url` | text | URL del PDF con el informe técnico. |
| `upper_aligners` | integer | Cantidad de alineadores del maxilar superior. |
| `lower_aligners` | integer | Cantidad de alineadores del maxilar inferior. |
| `complexity` | text | Complejidad del caso (baja / moderada / alta). |
| `prognosis` | text | Pronóstico (favorable / reservada). |
| `diagnosis` | text[] | Items del diagnóstico presuntivo general. |
| `laboratory` | text[] | Recomendaciones para el laboratorio. |
| `planning` | text[] | Criterios de planificación y accionar clínico. |
| `restrictions` | text[] | Restricciones biomecánicas del caso. |
| `tracking_rotations` | text | Piezas con rotaciones a controlar. |
| `tracking_extrusions` | text | Piezas con extrusiones a controlar. |
| `tracking_extrusion_buttons` | text | Piezas con botones de extrusión programados. |
| `tracking_intrusions` | text | Piezas con intrusiones a controlar. |
| `tracking_torque` | text | Piezas con torque / inclinaciones. |
| `tracking_angulations` | text | Piezas con angulaciones complejas. |
| `tracking_translations` | text | Piezas con traslaciones. |
| `tracking_expansion` | text | Piezas con expansión / compresión. |
| `commercial_potential` | text[] | Tratamientos complementarios con potencial comercial. |
| `quality_information` | text[] | Evaluación de la calidad de la información enviada. |
| `quality_scan` | text[] | Evaluación de la calidad del escaneo intraoral. |
| `quality_xrays` | text[] | Evaluación de la calidad de las radiografías. |
| `quality_intraoral` | text[] | Evaluación de la calidad de las fotos intraorales. |
| `quality_extraoral` | text[] | Evaluación de la calidad de las fotos extraorales. |
| `additional_observations` | text | Observaciones adicionales del caso. |
