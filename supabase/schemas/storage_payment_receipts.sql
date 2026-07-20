-- Ruta: {client_id}/{uuid}.{ext}. El primer segmento es el dueño, y es lo que
-- estas policies comparan contra auth.uid() para aislar a los clientes entre sí
create policy "El cliente sube su comprobante"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'payment-receipts'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy "El cliente ve sus comprobantes"
on storage.objects for select
to authenticated
using (
  bucket_id = 'payment-receipts'
  and (
    (storage.foldername(name))[1] = (select auth.uid())::text
    or op3dcloud.is_admin()
  )
);

-- Sin UPDATE ni DELETE para el cliente a propósito: un comprobante es la prueba
-- de un pago. Corregir uno mal subido es subir otro con uuid nuevo y repuntar
-- credit_payments.receipt_path; el archivo viejo queda, que es lo que se quiere
create policy "Solo el admin borra comprobantes"
on storage.objects for delete
to authenticated
using (bucket_id = 'payment-receipts' and op3dcloud.is_admin());
