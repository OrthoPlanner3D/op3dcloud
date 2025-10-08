import { supabase } from "@/config/supabase.config";

export type UserRole = "admin" | "planner" | "client";

export async function getUserRole(userId: string): Promise<UserRole | undefined> {
	try {
		const { data, error } = await supabase
			.schema("op3dcloud")
			.from("view_users")
			.select("role_name")
			.eq("id_user", userId)
			.single();

		if (error) {
			console.error("Error getting user role:", error);
			return undefined;
		}

		if (data?.role_name) {
			return data.role_name as UserRole;
		}

		return undefined;
	} catch (error) {
		console.error("Error getting user role:", error);
		return undefined;
	}
}
