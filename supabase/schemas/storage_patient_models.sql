create policy "Authenticated users can upload patient models"
on storage.objects for insert
to authenticated
with check (bucket_id = 'patient-models');

create policy "Authenticated users can read patient models"
on storage.objects for select
to authenticated
using (bucket_id = 'patient-models');

create policy "Authenticated users can delete patient models"
on storage.objects for delete
to authenticated
using (bucket_id = 'patient-models');
