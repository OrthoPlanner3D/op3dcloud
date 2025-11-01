import { supabase } from "@/config/supabase.config";

export async function getPlanners() {
	try {
		const { data, error } = await supabase
			.from("view_planners")
			.select("*");
		if (error) throw error;
		return data;
	} catch (error) {
		console.error(error);
	}
}
