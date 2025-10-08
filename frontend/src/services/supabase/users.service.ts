import { supabase } from "@/config/supabase.config";
import type { UserRole } from "@/types/db/users/roles";

export async function getUserRole(userId: string): Promise<UserRole | null> {
	try {
		const { data, error } = await supabase
			.schema("op3dcloud")
			.from("view_users")
			.select("role_name")
			.eq("id_user", userId)
			.single();

		if (error) {
			console.error("Error getting user role:", error);
			return null;
		}

		return data.role_name as UserRole;
	} catch (error) {
		console.error("Error getting user role:", error);
		return null;
	}
}
