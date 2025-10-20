-- Add patient_id column to treatment_planning table
alter table "op3dcloud"."treatment_planning"
add column "patient_id" bigint;

-- Add foreign key constraint
alter table "op3dcloud"."treatment_planning"
add constraint "treatment_planning_patient_id_fkey"
foreign key ("patient_id")
references "op3dcloud"."patients" ("id")
on delete cascade;

-- Create index for better query performance
create index "treatment_planning_patient_id_idx"
on "op3dcloud"."treatment_planning" ("patient_id");
