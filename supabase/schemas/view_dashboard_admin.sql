CREATE OR REPLACE VIEW op3dcloud.view_dashboard_admin AS
SELECT
	p.id,
	p.created_at,
	CONCAT(p.name, ' ', p.last_name) AS patient_name,
	p.status,
    (p.created_at + INTERVAL '7 days')::date AS expiration,
	vp.id AS planner_id,
	vp.username AS planner_name,
	vc.id AS client_id,
	vc.username AS client_name,
	p.status_files,
	p.case_status,
	p.notes
FROM
	op3dcloud.patients p
	LEFT JOIN op3dcloud.view_clients vc ON p.id_client = vc.id
	LEFT JOIN op3dcloud.view_planners vp ON p.id_planner = vp.id;
