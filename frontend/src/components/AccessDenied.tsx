import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router";

/**
 * Props para el componente AccessDenied
 */
interface AccessDeniedProps {
	title?: string;
	description?: string;
	fallbackPath?: string;
	fallbackLabel?: string;
}

/**
 * Componente que muestra una pantalla de acceso denegado
 * @param props - Propiedades del componente
 * @returns JSX.Element - Pantalla de acceso denegado
 */
export default function AccessDenied({
	title = "Acceso Restringido",
	description = "No tienes permisos para acceder a esta sección. Solo los administradores y planificadores pueden ver el dashboard.",
	fallbackPath = "/pacientes",
	fallbackLabel = "Ir a Pacientes"
}: AccessDeniedProps) {
	return (
		<div className="flex min-h-[calc(100vh-2.75rem)] items-center justify-center p-4">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
						<AlertCircle className="h-6 w-6 text-destructive" />
					</div>
					<CardTitle className="text-xl">{title}</CardTitle>
					<CardDescription className="text-sm text-muted-foreground">
						{description}
					</CardDescription>
				</CardHeader>
				<CardContent className="text-center">
					<Button asChild className="w-full">
						<Link to={fallbackPath}>
							{fallbackLabel}
						</Link>
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
