import { createBrowserRouter, Navigate, Outlet } from "react-router";
import PublicLayout from "@/layout/PublicLayout";
import Accesses from "@/pages/accesses";
import Clients from "@/pages/clients";
import Patients from "@/pages/patient";
import CreatePatient from "@/pages/patient/create";
import Planners from "@/pages/planners";
import PlannersStore from "@/pages/planners/store";
import PrivacyPolicy from "@/pages/privacy";
import Register from "@/pages/register";
import SignIn from "@/pages/sign-in";
import TermsAndConditions from "@/pages/terms";
import PrivateGuard from "./guards/PrivateGuard";
import PublicGuard from "./guards/PublicGuard";
import RoleGuard from "./guards/RoleGuard";
import SmartRedirect from "@/components/SmartRedirect";

const router = createBrowserRouter([
	// Ruta raíz - redirección inteligente
	{
		path: "/",
		element: <SmartRedirect />,
	},

	// Public routes
	{
		path: "/inicia-sesion",
		element: (
			<PublicGuard>
				<PublicLayout>
					<SignIn />
				</PublicLayout>
			</PublicGuard>
		),
	},
	{
		path: "/registro",
		element: (
			<PublicGuard>
				<PublicLayout>
					<Register />
				</PublicLayout>
			</PublicGuard>
		),
	},
	{
		path: "/terminos-y-condiciones",
		element: (
			<PublicGuard>
				<PublicLayout>
					<TermsAndConditions />
				</PublicLayout>
			</PublicGuard>
		),
	},
	{
		path: "/politica-de-privacidad",
		element: (
			<PublicGuard>
				<PublicLayout>
					<PrivacyPolicy />
				</PublicLayout>
			</PublicGuard>
		),
	},

	// Private routes - Dashboard (solo admin y planner)
	{
		path: "/dashboard",
		element: (
			<PrivateGuard>
				<RoleGuard requireDashboardAccess={true}>
					<Outlet />
				</RoleGuard>
			</PrivateGuard>
		),
		children: [
			{
				index: true,
				element: <Clients />,
			},
		],
	},

	// Private routes - Accesos (solo admin)
	{
		path: "/accesos",
		element: (
			<PrivateGuard>
				<RoleGuard allowedRoles={["admin"]}>
					<Accesses />
				</RoleGuard>
			</PrivateGuard>
		),
	},

	// Private routes - Planificadores (solo admin)
	{
		path: "/planificadores",
		element: (
			<PrivateGuard>
				<RoleGuard allowedRoles={["admin"]}>
					<Outlet />
				</RoleGuard>
			</PrivateGuard>
		),
		children: [
			{
				index: true,
				element: <Planners />,
			},
			{
				path: "crear",
				element: <PlannersStore />,
			},
		],
	},

	// Private routes - Pacientes (todos los usuarios autenticados)
	{
		path: "/pacientes",
		element: (
			<PrivateGuard>
				<Outlet />
			</PrivateGuard>
		),
		children: [
			{
				index: true,
				element: <Patients />,
			},
			{
				path: "crear",
				element: <CreatePatient />,
			},
		],
	},

	// Auth callback
	{
		path: "/auth/callback",
		element: (
			<PublicGuard>
				<div className="flex min-h-svh items-center justify-center">
					<span>Loading...</span>
				</div>
			</PublicGuard>
		),
	},

	// Catch all - redirigir a login
	{
		path: "*",
		element: <Navigate to="/inicia-sesion" />,
	},
]);

export default router;
