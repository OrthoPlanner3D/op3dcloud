import { Navigate } from "react-router";
import { useUserStore } from "@/state/stores/useUserStore";
import type { UserRole } from "@/types/db/users/roles";

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
	const user = useUserStore((state) => state.user);

	if (!user?.role || !allowedRoles.includes(user.role)) {
		return <Navigate to={fallbackPath} replace />;
	}

	return children;
}
