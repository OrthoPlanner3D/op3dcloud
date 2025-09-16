import { Shield, User, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthWithRole } from "@/hooks/useAuthWithRole";

/**
 * Componente que muestra información del rol del usuario actual
 * Incluye icono, badge de color y descripción de permisos
 */
export default function RoleInfo() {
	const { user, isAdmin, isPlanner, isClient } = useAuthWithRole();

	if (!user) return null;

	// Configuración de iconos por rol
	const getRoleIcon = () => {
		if (isAdmin()) return <Shield className="h-4 w-4" />;
		if (isPlanner()) return <Users className="h-4 w-4" />;
		if (isClient()) return <User className="h-4 w-4" />;
		return <User className="h-4 w-4" />;
	};

	// Configuración de colores por rol
	const getRoleColor = () => {
		if (isAdmin()) return "bg-red-100 text-red-800 border-red-200";
		if (isPlanner()) return "bg-blue-100 text-blue-800 border-blue-200";
		if (isClient()) return "bg-green-100 text-green-800 border-green-200";
		return "bg-gray-100 text-gray-800 border-gray-200";
	};

	// Descripción de permisos por rol
	const getRoleDescription = () => {
		if (isAdmin()) {
			return "Tienes acceso completo a todas las funcionalidades del sistema. Puedes gestionar usuarios, planificadores, clientes y pacientes.";
		}
		if (isPlanner()) {
			return "Puedes acceder al dashboard y gestionar pacientes. Tienes permisos limitados para administración.";
		}
		if (isClient()) {
			return "Puedes ver y gestionar tus propios pacientes. Acceso limitado a funcionalidades básicas.";
		}
		return "Rol no identificado.";
	};

	return (
		<Card className="mb-4">
			<CardHeader className="pb-3">
				<div className="flex items-center gap-2">
					{getRoleIcon()}
					<CardTitle className="text-sm">Información de Rol</CardTitle>
				</div>
			</CardHeader>
			<CardContent className="pt-0">
				<div className="flex items-center gap-2 mb-2">
					<Badge variant="outline" className={getRoleColor()}>
						{user.role?.toUpperCase() || "SIN ROL"}
					</Badge>
				</div>
				<CardDescription className="text-xs">
					{getRoleDescription()}
				</CardDescription>
			</CardContent>
		</Card>
	);
}
