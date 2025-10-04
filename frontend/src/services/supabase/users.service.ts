import { supabase } from "@/config/supabase.config";

export type UserRole = "admin" | "planner" | "client";

export async function getUserRole(userId: string): Promise<UserRole | null> {
	try {
		const { data, error } = await supabase
			.schema("op3dcloud")
			.from("user_has_role")
			.select(`
				roles!inner(name)
			`)
			.eq("id_user", userId)
			.single();

		if (error) {
			console.error("Error getting user role:", error);
			return null;
		}

		if (data?.roles?.name) {
			return data.roles.name as UserRole;
		}

		return null;
	} catch (error) {
		console.error("Error getting user role:", error);
		return null;
	}
}
