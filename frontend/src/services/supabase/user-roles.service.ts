import { supabase, supabaseAdmin } from "@/config/supabase.config";

/**
 * Tipos de roles disponibles en el sistema
 */
export type UserRole = "client" | "planner" | "admin";

/**
 * Interfaz para usuario con información de rol
 */
export interface UserWithRole {
	id: string;
	role: UserRole;
	email: string;
	username: string;
}

/**
 * Obtiene el rol de un usuario específico
 * @param userId - ID del usuario
 * @returns Promise<UserRole | null> - Rol del usuario o null si no se encuentra
 */
export async function getUserRole(userId: string): Promise<UserRole | null> {
	try {
		// Buscar en view_clients
		const { data: clientData, error: clientError } = await supabase
			.from("view_clients")
			.select("role")
			.eq("id", userId)
			.maybeSingle();

		if (!clientError && clientData) {
			return clientData.role as UserRole;
		}

		// Buscar en view_planners
		const { data: plannerData, error: plannerError } = await supabase
			.from("view_planners")
			.select("role")
			.eq("id", userId)
			.maybeSingle();

		if (!plannerError && plannerData) {
			return plannerData.role as UserRole;
		}

		// Buscar directamente en user_has_role para admin
		const { data: roleData, error: roleError } = await supabase
			.from("user_has_role")
			.select(`roles!inner(name)`)
			.eq("id_user", userId)
			.eq("roles.name", "admin")
			.maybeSingle();

		if (!roleError && roleData) {
			return "admin";
		}

		return null;
	} catch (error) {
		console.error("Error getting user role:", error);
		return null;
	}
}

/**
 * Obtiene información completa del usuario con su rol
 * @param userId - ID del usuario
 * @returns Promise<UserWithRole | null> - Información del usuario con rol o null si no se encuentra
 */
export async function getUserWithRole(userId: string): Promise<UserWithRole | null> {
	try {
		// Buscar en view_clients
		const { data: clientData, error: clientError } = await supabase
			.from("view_clients")
			.select("*")
			.eq("id", userId)
			.maybeSingle();

		if (!clientError && clientData) {
			return {
				id: clientData.id || "",
				role: clientData.role as UserRole,
				email: clientData.email || "",
				username: clientData.username || "",
			};
		}

		// Buscar en view_planners
		const { data: plannerData, error: plannerError } = await supabase
			.from("view_planners")
			.select("*")
			.eq("id", userId)
			.maybeSingle();

		if (!plannerError && plannerData) {
			return {
				id: plannerData.id || "",
				role: plannerData.role as UserRole,
				email: plannerData.email || "",
				username: plannerData.username || "",
			};
		}

		// Buscar directamente en user_has_role para admin
		const { data: roleData, error: roleError } = await supabase
			.from("user_has_role")
			.select(`roles!inner(name)`)
			.eq("id_user", userId)
			.eq("roles.name", "admin")
			.maybeSingle();

		if (!roleError && roleData) {
			// Obtener información del usuario usando el cliente admin
			const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId);
			
			if (!userError && userData.user) {
				const metadata = userData.user.user_metadata || {};
				const fullName = `${metadata.name || ""} ${metadata.last_name || ""}`.trim();
				
				return {
					id: userData.user.id,
					role: "admin",
					email: userData.user.email || "",
					username: fullName || userData.user.email || "",
				};
			}
		}

		return null;
	} catch (error) {
		console.error("Error getting user with role:", error);
		return null;
	}
}
