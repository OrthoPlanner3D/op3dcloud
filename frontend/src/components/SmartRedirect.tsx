import { Navigate } from "react-router";
import { useAuthWithRole } from "@/hooks/useAuthWithRole";

/**
 * Componente que redirige inteligentemente según el rol del usuario
 * - Admin/Planner → Dashboard
 * - Client → Pacientes
 * - No autenticado → Login
 */
export default function SmartRedirect() {
	const { user, isLoading, canAccessDashboard } = useAuthWithRole();

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

	// Redirigir según permisos del usuario
	return canAccessDashboard() ? 
		<Navigate to="/dashboard" replace /> : 
		<Navigate to="/pacientes" replace />;
}
