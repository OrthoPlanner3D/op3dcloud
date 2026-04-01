  create policy "Authenticated users can delete client files"
  on "storage"."objects"
  as permissive
  for delete
  to authenticated
using ((bucket_id = 'client-files'::text));



  create policy "Authenticated users can read client files"
  on "storage"."objects"
  as permissive
  for select
  to authenticated
using ((bucket_id = 'client-files'::text));



  create policy "Authenticated users can upload client files"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check ((bucket_id = 'client-files'::text));

