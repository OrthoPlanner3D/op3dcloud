import { supabase } from "@/config/supabase.config";
import type { UserRole, UserWithRole } from "@/types/db/users/user";

export async function getUserRole(): Promise<UserRole | null> {
	try {
		const { data: { user }, error } = await supabase.auth.getUser();
		
		if (error || !user) {
			console.error("Error getting current user:", error);
			return null;
		}

		const { data, error: roleError } = await supabase
			.from("user_has_role")
			.select(`roles!inner(name)`)
			.eq("id_user", user.id)
			.maybeSingle();

		if (roleError || !data) {
			console.error("Error getting user role:", roleError);
			return null;
		}

		return data.roles.name as UserRole;
	} catch (error) {
		console.error("Error getting user role:", error);
		return null;
	}
}

export async function getUserWithRole(): Promise<UserWithRole | null> {
	try {
		const { data: { user }, error } = await supabase.auth.getUser();
		
		if (error || !user) {
			console.error("Error getting current user:", error);
			return null;
		}

		const { data, error: userError } = await supabase
			.from("user_has_role")
			.select(`roles(name)`)
			.eq("id_user", user.id)
			.maybeSingle();

		if (userError || !data) {
			console.error("Error getting user with role:", userError);
			return null;
		}

		const metadata = user.user_metadata || {};
		const fullName = `${metadata.name || ""} ${metadata.last_name || ""}`.trim();

		return {
			id: user.id,
			role: data.roles.name as UserRole,
			email: user.email || "",
			username: fullName || user.email || "",
		};
	} catch (error) {
		console.error("Error getting user with role:", error);
		return null;
	}
}
