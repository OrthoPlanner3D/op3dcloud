import { Navigate } from "react-router";
import { useAuthWithRole } from "@/hooks/useAuthWithRole";

interface RoleGuardProps {
	children: React.ReactNode;
	allowedRoles?: string[];
	requireDashboardAccess?: boolean;
	fallbackPath?: string;
}

export default function RoleGuard({ 
	children, 
	allowedRoles = [], 
	requireDashboardAccess = false,
	fallbackPath = "/pacientes"
}: RoleGuardProps): React.ReactNode {
	const { user, isLoading, hasAnyRole } = useAuthWithRole();

	if (isLoading) {
		return (
			<div className="flex min-h-svh items-center justify-center">
				<div className="text-center">
					<div className="text-sm text-muted-foreground">Cargando...</div>
				</div>
			</div>
		);
	}

	if (!user) {
		return <Navigate to="/inicia-sesion" replace />;
	}

	if (requireDashboardAccess && !hasAnyRole(["admin", "planner"])) {
		return <Navigate to={fallbackPath} replace />;
	}

	if (allowedRoles.length > 0 && !hasAnyRole(allowedRoles)) {
		return <Navigate to={fallbackPath} replace />;
	}

	return <>{children}</>;
}
