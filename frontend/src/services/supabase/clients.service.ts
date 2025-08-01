import { supabase } from "@/config/supabase.config";
import type { ClientsViewRow } from "@/types/db/clients/clients";

export async function getClients(): Promise<ClientsViewRow[]> {
	try {
		const { data, error } = await supabase
			.from("view_clients")
			.select("*")
			.order("created_at", { ascending: false });

		if (error) throw error.message;

		return data;
	} catch (error) {
		console.error(error);
		throw error;
	}
}
