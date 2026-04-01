  create policy "Authenticated users can delete treatment files"
  on "storage"."objects"
  as permissive
  for delete
  to authenticated
using ((bucket_id = 'treatment-files'::text));



  create policy "Authenticated users can read treatment files"
  on "storage"."objects"
  as permissive
  for select
  to authenticated
using ((bucket_id = 'treatment-files'::text));



  create policy "Authenticated users can upload treatment files"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check ((bucket_id = 'treatment-files'::text));
