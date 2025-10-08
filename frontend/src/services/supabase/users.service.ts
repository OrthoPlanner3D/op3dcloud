import { supabase } from "@/config/supabase.config";
import type { UserRow } from "@/types/db/users/user.d";

export type UserRole = "admin" | "planner" | "client";

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

		if (data?.role_name) {
			return data.role_name as UserRole;
		}

		return null;
	} catch (error) {
		console.error("Error getting user role:", error);
		return null;
	}
}
