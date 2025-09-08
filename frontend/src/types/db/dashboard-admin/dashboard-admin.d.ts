import type { Database } from "../database.types";

export type DashboardAdminViewRow =
	Database["op3dcloud"]["Views"]["view_dashboard_admin"]["Row"];

// Tipo específico para actualizar un paciente basado en los campos editables
export type PatientUpdateData = Pick<
	Database["op3dcloud"]["Tables"]["patients"]["Update"],
	"id_planner" | "status_files" | "case_status" | "notes"
>;
