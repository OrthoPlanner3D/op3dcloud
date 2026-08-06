import { supabase } from "@/config/supabase.config";
import type { Tables } from "@/types/db/database.types";

type PatientModelRow = Tables<{ schema: "op3dcloud" }, "patient_models">;

/**
 * Casos 3D de un paciente. Cada fila es un caso/escaneo cargado desde
 * `stl-render`: los GLB viven bajo `storage_prefix` en el bucket
 * `patient-models`, la tabla sólo guarda el prefijo.
 */
export async function getPatientModelsByPatientId(
	patientId: number,
): Promise<PatientModelRow[]> {
	try {
		const { data, error } = await supabase
			.from("patient_models")
			.select("*")
			.eq("patient_id", patientId)
			.order("created_at", { ascending: false });

		if (error) throw error;

		return data;
	} catch (error) {
		console.error("Error fetching patient models:", error);
		throw error;
	}
}
