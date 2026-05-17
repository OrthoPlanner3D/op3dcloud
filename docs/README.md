# OrthoPlannerCloud — Documentación funcional

OrthoPlannerCloud es una plataforma web para la **planificación ortodóncica colaborativa**. Conecta a profesionales de la ortodoncia (clientes) con planificadores especializados (planners) que generan planes de tratamiento digitales sobre los pacientes que el cliente da de alta, todo bajo la supervisión de un equipo administrador.

Esta documentación describe **qué es cada rol, qué puede hacer y qué entidades intervienen** en la plataforma. Está pensada para el equipo de negocio y para el cliente final, no para desarrolladores.

## Roles del sistema

| Rol | Descripción |
|---|---|
| [Cliente](roles/cliente.md) | Profesional o clínica que se registra en la plataforma y da de alta a sus pacientes. |
| [Paciente](roles/paciente.md) | Registro clínico creado por el cliente. No es un usuario que inicia sesión. |
| [Planner](roles/planner.md) | Planificador asignado a uno o varios pacientes para generar los planes de tratamiento. |
| [Admin](roles/admin.md) | Usuario con acceso superior. Gestiona a los planners y supervisa toda la operación. |

## Glosario

- **Usuario**: persona con cuenta en la plataforma. Puede tener rol `cliente`, `planner` o `admin`.
- **Paciente**: registro clínico de un paciente real, creado por un cliente. No tiene acceso a la plataforma.
- **Caso**: el paciente junto con su historial de planificación, su estado y sus tiempos de expiración. Un caso puede estar marcado como **Prioridad** (expira en 48 horas) o como caso regular (expira a los 7 días).
- **Plan de tratamiento**: documento técnico que el planner crea para un paciente. Incluye diagnóstico, planificación clínica, tracking de movimientos, número de alineadores y observaciones. Un paciente puede tener varios planes.
- **Aprobación pública**: cada plan de tratamiento tiene un link público que el planner comparte con el cliente para que éste lo apruebe o solicite modificaciones.

## Relaciones entre entidades

```
Cliente ──crea──> Paciente ──asignado a──> Planner
                     │
                     └──tiene─────────────> Plan(es) de tratamiento
                                                    │
                                                    └──compartible vía──> Link público (cliente aprueba)

Admin ──gestiona──> Planners (alta, baja, estado activo/inactivo) y asignaciones a pacientes
```

## Modelo de datos (resumen)

Las entidades viven en el schema `op3dcloud` de la base de datos.

| Entidad | Tipo | Propósito |
|---|---|---|
| `roles` | tabla | Catálogo de roles disponibles: `admin`, `planner`, `client`. |
| `user_has_role` | tabla | Vínculo usuario ↔ rol. Un usuario puede tener uno o más roles. |
| `patients` | tabla | Pacientes y su información clínica. |
| `treatment_planning` | tabla | Planes de tratamiento asociados a cada paciente. |
| `view_users` | vista | Listado de usuarios con su rol asignado. |
| `view_clients` | vista | Clientes con sus datos extendidos. |
| `view_planners` | vista | Planners con sus datos extendidos. |
| `view_dashboard_admin` | vista | Vista agregada para el dashboard del admin (paciente + cliente + planner). |
| `status` | enum | Valores `Active` / `Inactive` para activar o desactivar planners. |

Cada documento de rol detalla los campos exactos de las entidades involucradas.

## Cómo navegar esta documentación

1. Comenzá por el [rol Cliente](roles/cliente.md) para entender el flujo de registro y alta de pacientes.
2. Seguí con [Paciente](roles/paciente.md) para conocer la entidad central del sistema.
3. Continuá con [Planner](roles/planner.md) para entender cómo se construye un plan de tratamiento y el flujo de aprobación.
4. Finalmente [Admin](roles/admin.md) cubre la gestión global de la plataforma.
