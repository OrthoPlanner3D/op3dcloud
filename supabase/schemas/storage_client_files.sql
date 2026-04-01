create policy "Authenticated users can upload client files"
on storage.objects for insert
to authenticated
with check (bucket_id = 'client-files');

create policy "Authenticated users can read client files"
on storage.objects for select
to authenticated
using (bucket_id = 'client-files');

create policy "Authenticated users can delete client files"
on storage.objects for delete
to authenticated
using (bucket_id = 'client-files');
