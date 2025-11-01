import { supabase } from "@/config/supabase.config";
import type {
	DashboardAdminViewRow,
	PatientUpdateData,
} from "@/types/db/dashboard-admin/dashboard-admin";

export async function getDashboardAdmin(): Promise<DashboardAdminViewRow[]> {
	try {
		const { data, error } = await supabase
			.from("view_dashboard_admin")
			.select("*")
			.order("created_at", { ascending: false });
		if (error) throw error;
		return data;
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export async function getPatientById(
	id: string,
): Promise<DashboardAdminViewRow> {
	try {
		const { data, error } = await supabase
			.from("view_dashboard_admin")
			.select("*")
			.eq("id", Number.parseInt(id))
			.single();

		if (error) throw error;
		return data;
	} catch (error) {
		console.error("Error in getPatientById:", error);
		throw error;
	}
}

export async function updatePatient(
	id: string,
	updates: PatientUpdateData,
): Promise<void> {
	try {
		const { error } = await supabase
			.from("patients")
			.update(updates)
			.eq("id", Number.parseInt(id));
		if (error) throw error;
	} catch (error) {
		console.error(error);
		throw error;
	}
}
