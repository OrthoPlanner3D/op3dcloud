import { supabase } from "@/config/supabase.config";
import type { PlanRow } from "@/types/db/plans/plans";

/**
 * Trae el catálogo de planes activos desde op3dcloud.plans, ordenado por
 * créditos. Se lee con el cliente anon (la página de suscripción es pública),
 * lo que depende de la policy "Lectura pública del catálogo" en la tabla.
 */
export async function getPlans(): Promise<PlanRow[]> {
	try {
		const { data, error } = await supabase
			.from("plans")
			.select("*")
			.eq("is_active", true)
			.order("credits", { ascending: true });

		if (error) throw error.message;

		return data;
	} catch (error) {
		console.error(error);
		throw error;
	}
}
