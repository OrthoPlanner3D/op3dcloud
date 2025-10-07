import { useEffect, useState } from "react";
import { getUserRole, type UserRole } from "@/services/supabase/users.service";
import { useUserStore } from "@/state/stores/useUserStore";

export function useUserRole() {
	const [role, setRole] = useState<UserRole | null>(null);
	const [loading, setLoading] = useState(true);
	const user = useUserStore((state) => state.user);

	useEffect(() => {
		async function fetchRole() {
			if (!user?.id) {
				setRole(null);
				setLoading(false);
				return;
			}

			try {
				const userRole = await getUserRole(user.id);
				setRole(userRole);
			} catch (error) {
				console.error("Error fetching user role:", error);
				setRole(null);
			} finally {
				setLoading(false);
			}
		}

		fetchRole();
	}, [user?.id]);

	return { role, loading };
}
