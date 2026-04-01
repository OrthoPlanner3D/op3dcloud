alter table "op3dcloud"."treatment_planning" alter column "lower_aligners" set default 0;

alter table "op3dcloud"."treatment_planning" alter column "lower_aligners" set not null;

alter table "op3dcloud"."treatment_planning" alter column "upper_aligners" set default 0;

alter table "op3dcloud"."treatment_planning" alter column "upper_aligners" set not null;
