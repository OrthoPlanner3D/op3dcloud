# Sistema de créditos — estado, decisiones y pendientes

Documento técnico. A diferencia del resto de `docs/`, que es funcional y está pensado para negocio, esto está dirigido a quien tenga que retomar o revisar el sistema de créditos.

**Última actualización:** 20 de julio de 2026.

---

## 1. Qué es

Los clientes compran packs de créditos. La cobranza es **manual**: no hay pasarela de pago.

```
El cliente elige un pack  →  transfiere por banco  →  sube el comprobante
                                                            │
                       el admin lo verifica contra su extracto bancario
                                                            │
                                    aprueba  →  se acreditan los créditos
                                    rechaza  →  no se acredita nada
```

Los cuatro packs, todos de compra única (no hay suscripción):

| Pack | Créditos | Precio |
|---|---|---|
| Individual | 1 | ⚠️ de relleno |
| Plus | 50 | ⚠️ de relleno |
| Business | 100 | ⚠️ de relleno |
| Corporate | desde 150 | cotización personalizada |

> **Los precios cargados hoy son falsos** (créditos × $10.000), puestos para poder probar el circuito. Están en `supabase/seed.sql`. Reemplazar por la lista real antes de producción.

Corporate no tiene precio de lista: se negocia por fuera y los créditos se cargan a mano con `adjust_client_credits`.

---

## 2. Estado actual

| Pieza | Estado |
|---|---|
| Tablas, RLS, funciones y vistas | escritas |
| Bucket `payment-receipts` | declarado en `config.toml` (solo local) |
| Migración `20260720161044_add_credits_system.sql` | generada y aplicada en local |
| Tipos TS regenerados | verificar |
| **Verificación en ejecución** | **pendiente — ver sección 4** |
| Frontend | sin empezar |

---

## 3. Modelo de datos

Todo vive en el schema `op3dcloud`.

| Entidad | Tipo | Propósito |
|---|---|---|
| `plans` | tabla | Catálogo de packs. `price` en NULL = cotización personalizada. |
| `credit_payments` | tabla | Compras. Estados: `pending`, `approved`, `rejected`, `cancelled`. |
| `credit_transactions` | tabla | Ledger de movimientos. **El saldo es `SUM(amount)`; no se guarda en ninguna columna.** |
| `view_credit_balances` | vista | Saldo por cliente. |
| `view_credit_transactions` | vista | Historial con el plan y el estado de la compra que originó cada movimiento. |
| `approve_credit_payment(id)` | función | Aprueba una compra y acredita, en una sola transacción. |
| `reject_credit_payment(id)` | función | Marca `rejected`. No toca el ledger. |
| `adjust_client_credits(cliente, monto, motivo)` | función | Movimiento manual del admin. El motivo es obligatorio. |
| `is_admin()` | función | Predicado que usan todas las policies de "solo el admin". |

Dos índices que son reglas de negocio, no optimizaciones:

- `credit_payments_one_pending_per_client_idx` — un cliente no puede tener dos compras en curso.
- `credit_transactions_payment_id_key` — una compra no puede acreditarse dos veces.

---

## 4. Verificación pendiente ⚠️

**Estas dos consultas todavía no se corrieron.** Todo lo demás de este documento describe código que se escribió y que la base aceptó al aplicar la migración, pero *aceptar* no es *comportarse bien*. Hasta que estas dos den el resultado esperado, no conviene construir UI encima.

**1. Recursión de `is_admin()`.** Logueado como cualquier usuario:

```sql
select * from op3dcloud.user_has_role;
```

Si tira `42P17 infinite recursion detected in policy`, el `SECURITY DEFINER` de `is_admin()` no está cortando el ciclo con la policy de esa misma tabla. Arreglo: sacar el `or op3dcloud.is_admin()` de la policy de SELECT en `table_user_has_role.sql`.

**2. Aislamiento del ledger.** Como un cliente cualquiera:

```sql
select * from op3dcloud.view_credit_balances;
```

Tiene que devolver **una sola fila**, la propia. Si aparecen otros clientes, el `WHERE` de la vista no está filtrando y los saldos de todos quedan expuestos.

---

## 5. Decisiones de diseño

Cosas que parecen raras y no lo son. Antes de "corregir" alguna, leer el porqué.

**El ledger es append-only.** `credit_transactions` no tiene policies de UPDATE ni de DELETE, y eso es deliberado: con RLS activa, lo que no tiene policy no se puede hacer, ni siquiera siendo admin. Un error se corrige con un **movimiento compensatorio** (`adjust_client_credits` con monto negativo), nunca reescribiendo el pasado.

**`credit_payments` guarda su propia copia de `amount` y `credits`.** No son redundantes con `plans`: congelan la oferta que vio el cliente para que subir un precio no altere las compras viejas. Y para que el cliente no se los invente, el `WITH CHECK` de la policy de INSERT los verifica contra la fila real de `plans`. Ese mismo `EXISTS` se repite en la policy de UPDATE porque **una policy no puede comparar la fila vieja contra la nueva**: sin él se compra barato y después se edita mientras sigue `pending`.

**`is_admin()` es `LANGUAGE plpgsql` y no `SQL`.** Hay una dependencia circular: la función lee `user_has_role`, y las policies de `user_has_role` llaman a la función. Postgres valida el cuerpo de una función SQL al crearla, así que en el orden de carga la tabla todavía no existe y falla con `42P01`. plpgsql solo chequea sintaxis al crear. El costo es que se pierde el inlining y la validación temprana de nombres.

**Las vistas repiten en un `WHERE` lo que ya dice una policy.** `view_credit_balances` y `view_credit_transactions` filtran con `WHERE t.client_id = (SELECT auth.uid()) OR op3dcloud.is_admin()`, duplicando la policy de `credit_transactions`. No es descuido: ver la primera trampa de la sección 6. **Si cambia quién puede ver qué, hay que tocar los dos lugares.**

**Aprobar es una RPC y no dos updates desde el frontend.** Aprobar son dos escrituras en tablas distintas: cambiar el `status` e insertar el movimiento. Separadas, un fallo entre medio deja al cliente pagado sin créditos, o con créditos y la compra todavía aprobable. Adentro de una función van en la misma transacción: o pasan las dos, o ninguna.

**Las tres RPC son `SECURITY INVOKER`.** Las policies ya le dan al admin exactamente los permisos que necesitan, así que la RLS sigue aplicando adentro de la función como segunda barrera. El `IF NOT is_admin()` del principio está para devolver un 403 explícito en vez de un UPDATE que afecta cero filas y parece exitoso.

---

## 6. Trampas conocidas

**`supabase db diff` descarta `security_invoker` y todos los `COMMENT ON`.** Los schemas declarativos los tienen; la migración generada, no. Por eso la autorización de las vistas está en el `WHERE` — es lo único que la herramienta copia textual y que por lo tanto llega a la base real. Vale para cualquier vista nueva que se agregue.

**Cambiar el precio de un plan traba las compras en `pending` de ese plan.** La policy de UPDATE del cliente compara su compra contra la fila actual de `plans`; si el precio cambió, la comparación falla y ese cliente no puede ni subir el comprobante ni cancelar. El admin sí puede tocarla. Conviene revisar la bandeja de pendientes antes de tocar precios.

**El bucket `payment-receipts` no se crea solo en producción.** El bloque `[storage.buckets.*]` de `config.toml` aplica al entorno local; `db push` no lo replica. Hay que darlo de alta a mano en el dashboard, con ese nombre exacto y **privado**.

**`view_credit_balances` no devuelve fila para un cliente sin movimientos.** Agrupa sobre `credit_transactions`, así que quien nunca compró nada simplemente no está — no está con saldo cero. En el frontend va `.maybeSingle()` y `null` se muestra como 0; un `.single()` revienta con el primer usuario nuevo.

**El seed no sincroniza precios.** `supabase/seed.sql` usa `ON CONFLICT (name) DO NOTHING`, que protege de duplicados pero no actualiza. Si cambiás los precios en el archivo y lo corrés sobre una base que ya tiene los planes, no pasa nada. Y al revés: un `db reset` borra los precios que hayas cargado a mano y restaura los del archivo.

**El comprobante no se puede reemplazar.** El bucket no tiene policy de UPDATE ni de DELETE para el cliente, así que `upsert: true` falla. Corregir un comprobante mal subido es subir otro con `uuid` nuevo y repuntar `receipt_path`; el anterior queda como huérfano. Es a propósito: un comprobante es la prueba de un pago.

---

## 7. Próximos pasos

En este orden.

**1. Sacar `VITE_SUPABASE_SERVICE_ROLE` del bundle.** ⚠️ **Bloqueante para producción.** La clave se compila dentro del JavaScript que baja el navegador (`src/config/supabase.config.ts:14`), y con ella se saltea toda la RLS descrita en este documento, el filtro de las vistas y el guard de las tres RPC — `service_role` es administrador de la base. La usan `storage.service.ts:28` y `src/pages/patient/create.tsx:315` para el alta pública de pacientes. Sacarla implica mover esos dos usos a una Edge Function y **rotar la clave** en Supabase, porque ya estuvo expuesta.

**2. Cargar los precios reales** en `supabase/seed.sql` y en la base (los dos lados, ver sección 6).

**3. Crear el bucket `payment-receipts` en el proyecto remoto**, privado.

**4. El frontend.** Cuatro pantallas:

- **Vitrina de planes** — leer `plans` filtrando `is_active` en la query (la policy deja ver todos a propósito, para que el historial de un plan discontinuado no pierda el nombre).
- **Compra y comprobante** — insertar en `credit_payments` con `credits` y `amount` copiados del plan, y subir el archivo a `payment-receipts` con la ruta **`${userId}/${crypto.randomUUID()}.${ext}`**. Distinto del resto de `storage.service.ts`, que usa rutas planas. Nunca `upsert: true`.
- **Bandeja del admin** — compras `pending` con comprobante, y los botones que llaman a `approve_credit_payment` / `reject_credit_payment`.
- **Saldo e historial** — desde `view_credit_balances` y `view_credit_transactions`.

---

## 8. Deuda técnica

| # | Qué | Dónde | Por qué importa |
|---|---|---|---|
| 1 | `VITE_SUPABASE_SERVICE_ROLE` en el bundle | `src/config/supabase.config.ts:14` | Anula toda la seguridad de este documento. Ver paso 1. |
| 2 | `view_clients` sin `security_invoker` ni filtro | `supabase/schemas/view_clients.sql` | Corre como dueño: expone mails, teléfonos **y ahora los saldos** de todos los clientes a cualquier autenticado. Arreglarlo rompe `sendPlanningEnabledEmail` (`email.service.ts:11`), así que primero hay que definir qué ve un planner. |
| 3 | `GRANT TRUNCATE` a `anon` | `supabase/schemas/grants_op3dcloud.sql` | **TRUNCATE no pasa por RLS.** Hoy no es alcanzable vía PostgREST, pero con el ledger de por medio conviene reemplazar el `GRANT ALL` por la lista explícita. |
| 4 | Los `COMMENT ON` no llegan a la base | — | El diseño está documentado en los schemas, no en la base. Studio muestra las columnas sin descripción. |
| 5 | `credits` de `user_metadata` quedó muerto | `register/index.tsx:122`, `profile/index.tsx:194` | Se sigue escribiendo pero ya no lo lee nadie. Confunde sobre cuál es el saldo real. |
| 6 | `view_clients.status` castea a enum sin `NULLIF` | `view_clients.sql` | Un `status` vacío en metadata hace fallar **la consulta entera** de la vista, no solo esa fila. |
| 7 | `assign_client_role` sin guard de llamador | `supabase/schemas/function_assign_client_role.sql` | Es `SECURITY DEFINER` y cualquiera puede llamarla. No se cerró porque en el registro todavía no hay sesión y un guard con `auth.uid()` lo rompería. |
| 8 | `patients`, `treatment_planning`, `patient_models` con `using(true)` | sus `table_*.sql` | Cualquier autenticado lee y escribe todo. `treatment_planning` además es legible por `anon` sin filtro, y es dato clínico. |
| 9 | Los otros cuatro buckets no aíslan por usuario | `supabase/schemas/storage_*.sql` | Rutas planas y policies que solo miran `bucket_id`: cualquiera lee y borra archivos ajenos. Dos son públicos. |
| 10 | Un rechazo no registra el motivo | `table_credit_payments.sql` | El cliente ve `rejected` y nada más. La explicación tiene que salir por fuera del sistema. |
