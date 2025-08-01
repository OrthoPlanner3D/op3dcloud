import { supabase } from "@/config/supabase.config";
import type { PatientsRow } from "@/types/db/patients/patients";

export async function getPatients(): Promise<PatientsRow[]> {
	try {
		const { data, error } = await supabase
			.from("patients")
			.select("*")
			.order("id", { ascending: false });

		if (error) throw error.message;

		return data;
	} catch (error) {
		console.error(error);
		throw error;
	}
}
