import { useEffect, useState } from "react";
import { useUserStore } from "@/state/stores/useUserStore";
import { getUserWithRole } from "@/services/supabase/user-roles.service";
import type { UserWithRole } from "@/types/db/users/user";

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
				const userRoleData = await getUserWithRole();
				
				if (userRoleData) {
					setUserWithRole(userRoleData);
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

	const hasRole = (role: string) => userWithRole?.role === role;
	const hasAnyRole = (roles: string[]) => userWithRole?.role ? roles.includes(userWithRole.role) : false;

	const isAdmin = () => hasRole("admin");
	const isPlanner = () => hasRole("planner");
	const isClient = () => hasRole("client");

	return {
		user: userWithRole,
		isLoading,
		hasRole,
		hasAnyRole,
		isAdmin,
		isPlanner,
		isClient,
	};
}
