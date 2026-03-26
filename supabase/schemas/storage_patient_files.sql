create policy "Authenticated users can upload patient files"
on storage.objects for insert
to authenticated
with check (bucket_id = 'patient-files');

create policy "Authenticated users can read patient files"
on storage.objects for select
to authenticated
using (bucket_id = 'patient-files');

create policy "Authenticated users can delete patient files"
on storage.objects for delete
to authenticated
using (bucket_id = 'patient-files');
