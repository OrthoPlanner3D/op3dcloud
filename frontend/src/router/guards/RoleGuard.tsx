import { Navigate } from "react-router";
import { useAuthWithRole } from "@/hooks/useAuthWithRole";
import AccessDenied from "@/components/AccessDenied";

/**
 * Props para el componente RoleGuard
 */
interface RoleGuardProps {
	children: React.ReactNode;
	allowedRoles?: string[];
	requireDashboardAccess?: boolean;
	fallbackPath?: string;
	showAccessDenied?: boolean;
}

/**
 * Componente guard que protege rutas basado en roles de usuario
 * @param props - Propiedades del componente
 * @returns JSX.Element - Componente protegido o redirección
 */
export default function RoleGuard({ 
	children, 
	allowedRoles = [], 
	requireDashboardAccess = false,
	fallbackPath = "/pacientes",
	showAccessDenied = false
}: RoleGuardProps): React.ReactNode {
	const { user, isLoading, hasAnyRole, canAccessDashboard } = useAuthWithRole();

	// Mostrar loading mientras se obtiene la información del usuario
	if (isLoading) {
		return (
			<div className="flex min-h-svh items-center justify-center">
				<div className="text-center">
					<div className="text-sm text-muted-foreground">Cargando...</div>
				</div>
			</div>
		);
	}

	// Redirigir a login si no hay usuario autenticado
	if (!user) {
		return <Navigate to="/inicia-sesion" replace />;
	}

	// Verificar acceso al dashboard
	if (requireDashboardAccess && !canAccessDashboard()) {
		return showAccessDenied ? 
			<AccessDenied fallbackPath={fallbackPath} /> : 
			<Navigate to={fallbackPath} replace />;
	}

	// Verificar roles permitidos
	if (allowedRoles.length > 0 && !hasAnyRole(allowedRoles)) {
		return showAccessDenied ? 
			<AccessDenied fallbackPath={fallbackPath} /> : 
			<Navigate to={fallbackPath} replace />;
	}

	return <>{children}</>;
}
