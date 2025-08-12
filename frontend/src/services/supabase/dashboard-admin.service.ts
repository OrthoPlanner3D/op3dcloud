import { supabase } from "@/config/supabase.config";
import type { DashboardAdminViewRow } from "@/types/db/dashboard-admin/dashboard-admin";

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
