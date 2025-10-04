import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { getUserRole, type UserRole } from "@/services/supabase/users.service";
import { useUserStore } from "@/state/stores/useUserStore";

interface RoleGuardProps {
	children: React.ReactNode;
	allowedRoles: UserRole[];
	fallbackPath?: string;
}

export default function RoleGuard({
	children,
	allowedRoles,
	fallbackPath = "/",
}: RoleGuardProps): React.ReactNode {
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

	if (loading) {
		return (
			<div className="flex min-h-svh items-center justify-center">
				Cargando...
			</div>
		);
	}

	if (!role || !allowedRoles.includes(role)) {
		return <Navigate to={fallbackPath} replace />;
	}

	return children;
}
