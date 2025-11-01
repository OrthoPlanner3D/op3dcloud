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

export async function getPatientsByeCLient(
	id_client: string,
): Promise<PatientsRow[]> {
	try {
		const { data, error } = await supabase
			.from("patients")
			.select("*")
			.eq("id_client", id_client)
			.order("created_at", { ascending: false });

		if (error) throw error.message;

		return data;
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export async function updatePatientPlanningEnabled(
	patientId: number,
	planningEnabled: boolean,
): Promise<void> {
	try {
		const { error } = await supabase
			.from("patients")
			.update({ planning_enabled: planningEnabled })
			.eq("id", patientId);

		if (error) throw error.message;
	} catch (error) {
		console.error(error);
		throw error;
	}
}
