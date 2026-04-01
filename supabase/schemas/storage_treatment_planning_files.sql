create policy "Authenticated users can upload treatment files"
on storage.objects for insert
to authenticated
with check (bucket_id = 'treatment-files');

create policy "Authenticated users can read treatment files"
on storage.objects for select
to authenticated
using (bucket_id = 'treatment-files');

create policy "Authenticated users can delete treatment files"
on storage.objects for delete
to authenticated
using (bucket_id = 'treatment-files');
