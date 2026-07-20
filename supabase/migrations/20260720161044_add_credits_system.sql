drop policy "CRUD" on "op3dcloud"."roles";

drop policy "CRUD" on "op3dcloud"."user_has_role";

drop view if exists "op3dcloud"."view_dashboard_admin";


  create table "op3dcloud"."credit_payments" (
    "id" bigint generated always as identity not null,
    "client_id" uuid not null,
    "plan_id" bigint not null,
    "amount" numeric(12,2),
    "credits" integer not null,
    "receipt_path" text,
    "status" text not null default 'pending'::text,
    "created_at" timestamp with time zone not null default now()
      );


alter table "op3dcloud"."credit_payments" enable row level security;


  create table "op3dcloud"."credit_transactions" (
    "id" bigint generated always as identity not null,
    "client_id" uuid not null,
    "amount" integer not null,
    "type" text not null,
    "payment_id" bigint,
    "note" text,
    "created_by" uuid,
    "created_at" timestamp with time zone not null default now()
      );


alter table "op3dcloud"."credit_transactions" enable row level security;


  create table "op3dcloud"."plans" (
    "id" bigint generated always as identity not null,
    "name" text not null,
    "credits" integer not null,
    "price" numeric(12,2),
    "is_active" boolean not null default true,
    "created_at" timestamp with time zone not null default now()
      );


alter table "op3dcloud"."plans" enable row level security;

CREATE UNIQUE INDEX credit_payments_one_pending_per_client_idx ON op3dcloud.credit_payments USING btree (client_id) WHERE (status = 'pending'::text);

CREATE UNIQUE INDEX credit_payments_pkey ON op3dcloud.credit_payments USING btree (id);

CREATE INDEX credit_payments_status_idx ON op3dcloud.credit_payments USING btree (status, created_at DESC);

CREATE INDEX credit_transactions_client_id_idx ON op3dcloud.credit_transactions USING btree (client_id);

CREATE UNIQUE INDEX credit_transactions_payment_id_key ON op3dcloud.credit_transactions USING btree (payment_id) WHERE (payment_id IS NOT NULL);

CREATE UNIQUE INDEX credit_transactions_pkey ON op3dcloud.credit_transactions USING btree (id);

CREATE UNIQUE INDEX plans_name_key ON op3dcloud.plans USING btree (name);

CREATE UNIQUE INDEX plans_pkey ON op3dcloud.plans USING btree (id);

alter table "op3dcloud"."credit_payments" add constraint "credit_payments_pkey" PRIMARY KEY using index "credit_payments_pkey";

alter table "op3dcloud"."credit_transactions" add constraint "credit_transactions_pkey" PRIMARY KEY using index "credit_transactions_pkey";

alter table "op3dcloud"."plans" add constraint "plans_pkey" PRIMARY KEY using index "plans_pkey";

alter table "op3dcloud"."credit_payments" add constraint "credit_payments_amount_check" CHECK (((amount IS NULL) OR (amount > (0)::numeric))) not valid;

alter table "op3dcloud"."credit_payments" validate constraint "credit_payments_amount_check";

alter table "op3dcloud"."credit_payments" add constraint "credit_payments_client_id_fkey" FOREIGN KEY (client_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "op3dcloud"."credit_payments" validate constraint "credit_payments_client_id_fkey";

alter table "op3dcloud"."credit_payments" add constraint "credit_payments_credits_check" CHECK ((credits > 0)) not valid;

alter table "op3dcloud"."credit_payments" validate constraint "credit_payments_credits_check";

alter table "op3dcloud"."credit_payments" add constraint "credit_payments_plan_id_fkey" FOREIGN KEY (plan_id) REFERENCES op3dcloud.plans(id) ON DELETE RESTRICT not valid;

alter table "op3dcloud"."credit_payments" validate constraint "credit_payments_plan_id_fkey";

alter table "op3dcloud"."credit_payments" add constraint "credit_payments_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text, 'cancelled'::text]))) not valid;

alter table "op3dcloud"."credit_payments" validate constraint "credit_payments_status_check";

alter table "op3dcloud"."credit_transactions" add constraint "credit_transactions_amount_check" CHECK ((amount <> 0)) not valid;

alter table "op3dcloud"."credit_transactions" validate constraint "credit_transactions_amount_check";

alter table "op3dcloud"."credit_transactions" add constraint "credit_transactions_client_id_fkey" FOREIGN KEY (client_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "op3dcloud"."credit_transactions" validate constraint "credit_transactions_client_id_fkey";

alter table "op3dcloud"."credit_transactions" add constraint "credit_transactions_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL not valid;

alter table "op3dcloud"."credit_transactions" validate constraint "credit_transactions_created_by_fkey";

alter table "op3dcloud"."credit_transactions" add constraint "credit_transactions_payment_id_fkey" FOREIGN KEY (payment_id) REFERENCES op3dcloud.credit_payments(id) ON DELETE SET NULL not valid;

alter table "op3dcloud"."credit_transactions" validate constraint "credit_transactions_payment_id_fkey";

alter table "op3dcloud"."credit_transactions" add constraint "credit_transactions_type_check" CHECK ((type = ANY (ARRAY['payment'::text, 'adjustment'::text]))) not valid;

alter table "op3dcloud"."credit_transactions" validate constraint "credit_transactions_type_check";

alter table "op3dcloud"."plans" add constraint "plans_credits_check" CHECK ((credits > 0)) not valid;

alter table "op3dcloud"."plans" validate constraint "plans_credits_check";

alter table "op3dcloud"."plans" add constraint "plans_name_key" UNIQUE using index "plans_name_key";

alter table "op3dcloud"."plans" add constraint "plans_price_check" CHECK (((price IS NULL) OR (price >= (0)::numeric))) not valid;

alter table "op3dcloud"."plans" validate constraint "plans_price_check";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION op3dcloud.adjust_client_credits(p_client_id uuid, p_amount integer, p_note text)
 RETURNS bigint
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
DECLARE
    v_transaction_id BIGINT;
BEGIN
    IF NOT op3dcloud.is_admin() THEN
        RAISE EXCEPTION 'Solo un admin puede ajustar créditos'
            USING ERRCODE = '42501';
    END IF;

    IF p_amount IS NULL OR p_amount = 0 THEN
        RAISE EXCEPTION 'El ajuste tiene que ser distinto de cero'
            USING ERRCODE = 'P0001';
    END IF;

    -- Obligatoria: es el único registro de por qué se movieron estos créditos
    IF p_note IS NULL OR btrim(p_note) = '' THEN
        RAISE EXCEPTION 'El ajuste necesita un motivo'
            USING ERRCODE = 'P0001';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = p_client_id) THEN
        RAISE EXCEPTION 'El cliente % no existe', p_client_id
            USING ERRCODE = 'P0002';
    END IF;

    INSERT INTO op3dcloud.credit_transactions
        (client_id, amount, type, payment_id, note, created_by)
    VALUES (
        p_client_id,
        p_amount,
        'adjustment',
        NULL,
        btrim(p_note),
        (SELECT auth.uid())
    )
    RETURNING id INTO v_transaction_id;

    RETURN v_transaction_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION op3dcloud.approve_credit_payment(p_payment_id bigint)
 RETURNS bigint
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
DECLARE
    v_payment op3dcloud.credit_payments%ROWTYPE;
    v_transaction_id BIGINT;
BEGIN
    -- La RLS ya lo frenaría, pero en un UPDATE la RLS no da error: afecta cero
    -- filas y devuelve éxito. Este check convierte eso en un 403 explícito
    IF NOT op3dcloud.is_admin() THEN
        RAISE EXCEPTION 'Solo un admin puede aprobar pagos'
            USING ERRCODE = '42501';
    END IF;

    -- FOR UPDATE bloquea la fila hasta el fin de la transacción: si dos admins
    -- aprueban la misma compra a la vez, el segundo espera y ve status approved
    SELECT * INTO v_payment
    FROM op3dcloud.credit_payments
    WHERE id = p_payment_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'La compra % no existe', p_payment_id
            USING ERRCODE = 'P0002';
    END IF;

    IF v_payment.status <> 'pending' THEN
        RAISE EXCEPTION 'La compra % ya está en estado %', p_payment_id, v_payment.status
            USING ERRCODE = 'P0001';
    END IF;

    IF v_payment.receipt_path IS NULL THEN
        RAISE EXCEPTION 'La compra % no tiene comprobante subido', p_payment_id
            USING ERRCODE = 'P0001';
    END IF;

    UPDATE op3dcloud.credit_payments
    SET status = 'approved'
    WHERE id = p_payment_id;

    INSERT INTO op3dcloud.credit_transactions
        (client_id, amount, type, payment_id, note, created_by)
    VALUES (
        v_payment.client_id,
        v_payment.credits,
        'payment',
        p_payment_id,
        'Aprobación de la compra #' || p_payment_id,
        (SELECT auth.uid())
    )
    RETURNING id INTO v_transaction_id;

    RETURN v_transaction_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION op3dcloud.is_admin()
 RETURNS boolean
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM op3dcloud.user_has_role uhr
    JOIN op3dcloud.roles r ON r.id = uhr.id_role
    WHERE uhr.id_user = (SELECT auth.uid())
      AND r.name = 'admin'
  );
END;
$function$
;

CREATE OR REPLACE FUNCTION op3dcloud.reject_credit_payment(p_payment_id bigint)
 RETURNS void
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
DECLARE
    v_status TEXT;
BEGIN
    IF NOT op3dcloud.is_admin() THEN
        RAISE EXCEPTION 'Solo un admin puede rechazar pagos'
            USING ERRCODE = '42501';
    END IF;

    SELECT status INTO v_status
    FROM op3dcloud.credit_payments
    WHERE id = p_payment_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'La compra % no existe', p_payment_id
            USING ERRCODE = 'P0002';
    END IF;

    -- Solo desde pending: una compra aprobada ya generó su movimiento en el
    -- ledger, y rechazarla acá lo dejaría huérfano. Eso se revierte con un ajuste
    IF v_status <> 'pending' THEN
        RAISE EXCEPTION 'La compra % ya está en estado %', p_payment_id, v_status
            USING ERRCODE = 'P0001';
    END IF;

    UPDATE op3dcloud.credit_payments
    SET status = 'rejected'
    WHERE id = p_payment_id;
END;
$function$
;

create or replace view "op3dcloud"."view_credit_balances" as  SELECT t.client_id,
    (COALESCE(sum(t.amount), (0)::bigint))::integer AS balance,
    max(t.created_at) AS last_movement_at
   FROM op3dcloud.credit_transactions t
  WHERE ((t.client_id = ( SELECT auth.uid() AS uid)) OR op3dcloud.is_admin())
  GROUP BY t.client_id;


create or replace view "op3dcloud"."view_credit_transactions" as  SELECT t.id,
    t.client_id,
    t.amount,
    t.type,
    t.note,
    t.created_by,
    t.created_at,
    t.payment_id,
    pay.status AS payment_status,
    pay.amount AS payment_amount,
    pl.name AS plan_name
   FROM ((op3dcloud.credit_transactions t
     LEFT JOIN op3dcloud.credit_payments pay ON ((pay.id = t.payment_id)))
     LEFT JOIN op3dcloud.plans pl ON ((pl.id = pay.plan_id)))
  WHERE ((t.client_id = ( SELECT auth.uid() AS uid)) OR op3dcloud.is_admin());


CREATE OR REPLACE FUNCTION op3dcloud.assign_planner_role(p_id_planner uuid)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
    v_role_id BIGINT;
BEGIN
    -- Es SECURITY DEFINER, así que saltea la RLS de user_has_role: sin este
    -- check cualquiera puede promoverse a planner con una llamada RPC
    IF NOT op3dcloud.is_admin() THEN
        RETURN 'Only an admin can assign the planner role';
    END IF;

    -- Validar que el parámetro no sea NULL
    IF p_id_planner IS NULL THEN
        RETURN 'User ID cannot be null';
    END IF;

    -- Buscar el ID del rol "planner"
    SELECT id INTO v_role_id
    FROM op3dcloud.roles
    WHERE name = 'planner';

    -- Verificar que el rol existe
    IF v_role_id IS NULL THEN
        RETURN 'Role "planner" not found';
    END IF;

    -- Verificar que el usuario existe
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = p_id_planner) THEN
        RETURN 'User not found';
    END IF;

    -- Verificar que el usuario no tenga ya ese rol asignado
    IF EXISTS (
        SELECT 1 FROM op3dcloud.user_has_role
        WHERE id_user = p_id_planner AND id_role = v_role_id
    ) THEN
        RETURN 'User already has planner role assigned';
    END IF;

    -- Insertar el nuevo registro
    INSERT INTO op3dcloud.user_has_role (id_user, id_role)
    VALUES (p_id_planner, v_role_id);

    -- Retornar SUCCESS si todo fue exitoso
    RETURN 'SUCCESS';

EXCEPTION
    WHEN unique_violation THEN
        RETURN 'Duplicate role assignment detected';
    WHEN foreign_key_violation THEN
        RETURN 'Invalid user or role reference';
    WHEN OTHERS THEN
        RETURN 'Database error: ' || SQLERRM;
END;
$function$
;

create or replace view "op3dcloud"."view_clients" as  SELECT u.id,
    r.id AS id_role,
    r.name AS role,
    u.email,
    concat_ws(' '::text, (u.raw_user_meta_data ->> 'name'::text), (u.raw_user_meta_data ->> 'last_name'::text)) AS username,
    (COALESCE(( SELECT sum(t.amount) AS sum
           FROM op3dcloud.credit_transactions t
          WHERE (t.client_id = u.id)), (0)::bigint))::integer AS credits,
    ((u.raw_user_meta_data ->> 'status'::text))::op3dcloud.status AS status,
    (u.raw_user_meta_data ->> 'phone'::text) AS phone,
    (u.raw_user_meta_data ->> 'country'::text) AS country,
    (u.raw_user_meta_data ->> 'entity'::text) AS entity,
    (u.raw_user_meta_data ->> 'user_type'::text) AS user_type,
    (u.raw_user_meta_data ->> 'logo'::text) AS logo,
    (u.raw_user_meta_data ->> 'experience_in_digital_planning'::text) AS experience_in_digital_planning,
    (u.raw_user_meta_data ->> 'digital_model_zocalo_height'::text) AS digital_model_zocalo_height,
    (u.raw_user_meta_data ->> 'treatment_approach'::text) AS treatment_approach,
    (u.raw_user_meta_data ->> 'work_modality'::text) AS work_modality,
    (u.raw_user_meta_data ->> 'reports_language'::text) AS reports_language,
    (u.raw_user_meta_data ->> 'how_did_you_meet_us'::text) AS how_did_you_meet_us,
    u.created_at,
    ((u.created_at + '7 days'::interval))::date AS expiration,
    (NULLIF((u.raw_user_meta_data ->> 'planner'::text), ''::text))::uuid AS planner,
    (u.raw_user_meta_data ->> 'status_files'::text) AS status_files,
    (u.raw_user_meta_data ->> 'case_status'::text) AS case_status,
    (u.raw_user_meta_data ->> 'notes'::text) AS notes
   FROM ((auth.users u
     JOIN op3dcloud.user_has_role u_h_r ON ((u.id = u_h_r.id_user)))
     JOIN op3dcloud.roles r ON ((u_h_r.id_role = r.id)))
  WHERE (r.name = 'client'::text);


create or replace view "op3dcloud"."view_dashboard_admin" as  SELECT p.id,
    p.created_at,
    concat(p.name, ' ', p.last_name) AS patient_name,
    p.status,
        CASE
            WHEN ('Prioridad'::text = ANY (p.case_status)) THEN ((now() + '48:00:00'::interval))::date
            ELSE ((p.created_at + '7 days'::interval))::date
        END AS expiration,
    vp.id AS planner_id,
    vp.username AS planner_name,
    vc.id AS client_id,
    vc.username AS client_name,
    p.status_files,
    p.case_status,
    p.notes,
    p.planning_enabled
   FROM ((op3dcloud.patients p
     LEFT JOIN op3dcloud.view_clients vc ON ((p.id_client = vc.id)))
     LEFT JOIN op3dcloud.view_planners vp ON ((p.id_planner = vp.id)));


grant delete on table "op3dcloud"."credit_payments" to "anon";

grant insert on table "op3dcloud"."credit_payments" to "anon";

grant references on table "op3dcloud"."credit_payments" to "anon";

grant select on table "op3dcloud"."credit_payments" to "anon";

grant trigger on table "op3dcloud"."credit_payments" to "anon";

grant truncate on table "op3dcloud"."credit_payments" to "anon";

grant update on table "op3dcloud"."credit_payments" to "anon";

grant delete on table "op3dcloud"."credit_payments" to "authenticated";

grant insert on table "op3dcloud"."credit_payments" to "authenticated";

grant references on table "op3dcloud"."credit_payments" to "authenticated";

grant select on table "op3dcloud"."credit_payments" to "authenticated";

grant trigger on table "op3dcloud"."credit_payments" to "authenticated";

grant truncate on table "op3dcloud"."credit_payments" to "authenticated";

grant update on table "op3dcloud"."credit_payments" to "authenticated";

grant delete on table "op3dcloud"."credit_payments" to "service_role";

grant insert on table "op3dcloud"."credit_payments" to "service_role";

grant references on table "op3dcloud"."credit_payments" to "service_role";

grant select on table "op3dcloud"."credit_payments" to "service_role";

grant trigger on table "op3dcloud"."credit_payments" to "service_role";

grant truncate on table "op3dcloud"."credit_payments" to "service_role";

grant update on table "op3dcloud"."credit_payments" to "service_role";

grant delete on table "op3dcloud"."credit_transactions" to "anon";

grant insert on table "op3dcloud"."credit_transactions" to "anon";

grant references on table "op3dcloud"."credit_transactions" to "anon";

grant select on table "op3dcloud"."credit_transactions" to "anon";

grant trigger on table "op3dcloud"."credit_transactions" to "anon";

grant truncate on table "op3dcloud"."credit_transactions" to "anon";

grant update on table "op3dcloud"."credit_transactions" to "anon";

grant delete on table "op3dcloud"."credit_transactions" to "authenticated";

grant insert on table "op3dcloud"."credit_transactions" to "authenticated";

grant references on table "op3dcloud"."credit_transactions" to "authenticated";

grant select on table "op3dcloud"."credit_transactions" to "authenticated";

grant trigger on table "op3dcloud"."credit_transactions" to "authenticated";

grant truncate on table "op3dcloud"."credit_transactions" to "authenticated";

grant update on table "op3dcloud"."credit_transactions" to "authenticated";

grant delete on table "op3dcloud"."credit_transactions" to "service_role";

grant insert on table "op3dcloud"."credit_transactions" to "service_role";

grant references on table "op3dcloud"."credit_transactions" to "service_role";

grant select on table "op3dcloud"."credit_transactions" to "service_role";

grant trigger on table "op3dcloud"."credit_transactions" to "service_role";

grant truncate on table "op3dcloud"."credit_transactions" to "service_role";

grant update on table "op3dcloud"."credit_transactions" to "service_role";

grant delete on table "op3dcloud"."plans" to "anon";

grant insert on table "op3dcloud"."plans" to "anon";

grant references on table "op3dcloud"."plans" to "anon";

grant select on table "op3dcloud"."plans" to "anon";

grant trigger on table "op3dcloud"."plans" to "anon";

grant truncate on table "op3dcloud"."plans" to "anon";

grant update on table "op3dcloud"."plans" to "anon";

grant delete on table "op3dcloud"."plans" to "authenticated";

grant insert on table "op3dcloud"."plans" to "authenticated";

grant references on table "op3dcloud"."plans" to "authenticated";

grant select on table "op3dcloud"."plans" to "authenticated";

grant trigger on table "op3dcloud"."plans" to "authenticated";

grant truncate on table "op3dcloud"."plans" to "authenticated";

grant update on table "op3dcloud"."plans" to "authenticated";

grant delete on table "op3dcloud"."plans" to "service_role";

grant insert on table "op3dcloud"."plans" to "service_role";

grant references on table "op3dcloud"."plans" to "service_role";

grant select on table "op3dcloud"."plans" to "service_role";

grant trigger on table "op3dcloud"."plans" to "service_role";

grant truncate on table "op3dcloud"."plans" to "service_role";

grant update on table "op3dcloud"."plans" to "service_role";


  create policy "El admin gestiona todas las compras"
  on "op3dcloud"."credit_payments"
  as permissive
  for all
  to authenticated
using (op3dcloud.is_admin())
with check (op3dcloud.is_admin());



  create policy "El cliente compra para sí mismo"
  on "op3dcloud"."credit_payments"
  as permissive
  for insert
  to authenticated
with check (((client_id = ( SELECT auth.uid() AS uid)) AND (status = 'pending'::text) AND (EXISTS ( SELECT 1
   FROM op3dcloud.plans p
  WHERE ((p.id = credit_payments.plan_id) AND p.is_active AND (p.credits = credit_payments.credits) AND (NOT (p.price IS DISTINCT FROM credit_payments.amount)))))));



  create policy "El cliente sube el comprobante o cancela"
  on "op3dcloud"."credit_payments"
  as permissive
  for update
  to authenticated
using (((client_id = ( SELECT auth.uid() AS uid)) AND (status = 'pending'::text)))
with check (((client_id = ( SELECT auth.uid() AS uid)) AND (status = ANY (ARRAY['pending'::text, 'cancelled'::text])) AND (EXISTS ( SELECT 1
   FROM op3dcloud.plans p
  WHERE ((p.id = credit_payments.plan_id) AND p.is_active AND (p.credits = credit_payments.credits) AND (NOT (p.price IS DISTINCT FROM credit_payments.amount)))))));



  create policy "El cliente ve sus compras"
  on "op3dcloud"."credit_payments"
  as permissive
  for select
  to authenticated
using (((client_id = ( SELECT auth.uid() AS uid)) OR op3dcloud.is_admin()));



  create policy "El cliente ve sus movimientos"
  on "op3dcloud"."credit_transactions"
  as permissive
  for select
  to authenticated
using (((client_id = ( SELECT auth.uid() AS uid)) OR op3dcloud.is_admin()));



  create policy "Solo el admin genera movimientos"
  on "op3dcloud"."credit_transactions"
  as permissive
  for insert
  to authenticated
with check (op3dcloud.is_admin());



  create policy "Solo el admin edita el catálogo de planes"
  on "op3dcloud"."plans"
  as permissive
  for all
  to authenticated
using (op3dcloud.is_admin())
with check (op3dcloud.is_admin());



  create policy "Todos leen el catálogo de planes"
  on "op3dcloud"."plans"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Solo el admin modifica el catálogo de roles"
  on "op3dcloud"."roles"
  as permissive
  for all
  to authenticated
using (op3dcloud.is_admin())
with check (op3dcloud.is_admin());



  create policy "Todos leen el catálogo de roles"
  on "op3dcloud"."roles"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Cada usuario ve sus propios roles"
  on "op3dcloud"."user_has_role"
  as permissive
  for select
  to authenticated
using (((id_user = ( SELECT auth.uid() AS uid)) OR op3dcloud.is_admin()));



  create policy "Solo el admin asigna roles"
  on "op3dcloud"."user_has_role"
  as permissive
  for all
  to authenticated
using (op3dcloud.is_admin())
with check (op3dcloud.is_admin());



  create policy "El cliente sube su comprobante"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check (((bucket_id = 'payment-receipts'::text) AND ((storage.foldername(name))[1] = (( SELECT auth.uid() AS uid))::text)));



  create policy "El cliente ve sus comprobantes"
  on "storage"."objects"
  as permissive
  for select
  to authenticated
using (((bucket_id = 'payment-receipts'::text) AND (((storage.foldername(name))[1] = (( SELECT auth.uid() AS uid))::text) OR op3dcloud.is_admin())));



  create policy "Solo el admin borra comprobantes"
  on "storage"."objects"
  as permissive
  for delete
  to authenticated
using (((bucket_id = 'payment-receipts'::text) AND op3dcloud.is_admin()));



