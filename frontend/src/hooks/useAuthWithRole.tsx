import { useEffect, useState } from "react";
import { useUserStore } from "@/state/stores/useUserStore";
import { getUserWithRole, type UserWithRole } from "@/services/supabase/user-roles.service";

/**
 * Hook personalizado para manejar autenticación con información de roles
 * Proporciona funciones para verificar permisos y roles del usuario actual
 */
export function useAuthWithRole() {
	const user = useUserStore((state) => state.user);
	const setUser = useUserStore((state) => state.setUser);
	const [userWithRole, setUserWithRole] = useState<UserWithRole | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchUserRole = async () => {
			if (!user?.id) {
				setUserWithRole(null);
				setIsLoading(false);
				return;
			}

			try {
				setIsLoading(true);
				const userRoleData = await getUserWithRole(user.id);
				
				if (userRoleData) {
					setUserWithRole(userRoleData);
					// Actualizar el store con el rol
					setUser({
						...user,
						role: userRoleData.role,
					});
				} else {
					setUserWithRole(null);
				}
			} catch (error) {
				console.error("Error fetching user role:", error);
				setUserWithRole(null);
			} finally {
				setIsLoading(false);
			}
		};

		fetchUserRole();
	}, [user?.id, setUser]);

	// Funciones de verificación de roles
	const hasRole = (role: string) => userWithRole?.role === role;
	const hasAnyRole = (roles: string[]) => userWithRole?.role ? roles.includes(userWithRole.role) : false;

	// Funciones específicas de roles
	const isAdmin = () => hasRole("admin");
	const isPlanner = () => hasRole("planner");
	const isClient = () => hasRole("client");

	// Funciones de permisos
	const canAccessDashboard = () => hasAnyRole(["admin", "planner"]);
	const canManageUsers = () => isAdmin();
	const canManagePlanners = () => isAdmin();
	const canManageClients = () => hasAnyRole(["admin", "planner"]);
	const canViewAllPatients = () => hasAnyRole(["admin", "planner"]);
	const canEditPatients = () => hasAnyRole(["admin", "planner"]);
	const canDeletePatients = () => isAdmin();

	return {
		user: userWithRole,
		isLoading,
		hasRole,
		hasAnyRole,
		canAccessDashboard,
		isAdmin,
		isPlanner,
		isClient,
		canManageUsers,
		canManagePlanners,
		canManageClients,
		canViewAllPatients,
		canEditPatients,
		canDeletePatients,
	};
}
