create schema if not exists op3dcloud;

GRANT USAGE ON SCHEMA op3dcloud TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA op3dcloud TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA op3dcloud TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA op3dcloud TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA op3dcloud GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA op3dcloud GRANT ALL ON ROUTINES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA op3dcloud GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
