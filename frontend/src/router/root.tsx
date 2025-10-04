import { createBrowserRouter, Navigate, Outlet } from "react-router";
import PatientLayout from "@/layout/PatientLayout";
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
import WelcomeGuard from "./guards/WelcomeGuard";
import { useUserRole } from "@/hooks/useUserRole";

// Component to handle role-based redirection
function RoleBasedRedirect() {
	const { role } = useUserRole();
	
	if (role === "client") {
		return <Navigate to="/pacientes" replace />;
	}
	
	return <Clients />;
}

const router = createBrowserRouter([
	// Public routes
	{
		path: "/",
		element: (
			<PublicGuard>
				<PublicLayout>
					<Outlet />
				</PublicLayout>
			</PublicGuard>
		),
		children: [
			{
				path: "registro",
				element: <Register />,
			},
			{
				index: true,
				path: "inicia-sesion",
				element: <SignIn />,
			},
			{
				path: "terminos-y-condiciones",
				element: <TermsAndConditions />,
			},
			{
				path: "politica-de-privacidad",
				element: <PrivacyPolicy />,
			},
		],
	},

	// Private routes with role-based access
	{
		path: "/",
		element: (
			<WelcomeGuard>
				<PrivateGuard>
					<PatientLayout>
						<Outlet />
					</PatientLayout>
				</PrivateGuard>
			</WelcomeGuard>
		),
		children: [
			{
				index: true,
				element: (
					<RoleGuard allowedRoles={["admin", "planner", "client"]}>
						<RoleBasedRedirect />
					</RoleGuard>
				),
			},
			{
				path: "pacientes",
				children: [
					{
						index: true,
						element: (
							<RoleGuard allowedRoles={["admin", "planner", "client"]}>
								<Patients />
							</RoleGuard>
						),
					},
					{
						path: "crear",
						element: (
							<RoleGuard allowedRoles={["admin", "planner", "client"]}>
								<CreatePatient />
							</RoleGuard>
						),
					},
				],
			},
			{
				path: "planificadores",
				children: [
					{
						index: true,
						element: (
							<RoleGuard allowedRoles={["admin"]}>
								<Planners />
							</RoleGuard>
						),
					},
					{
						path: "crear",
						element: (
							<RoleGuard allowedRoles={["admin"]}>
								<PlannersStore />
							</RoleGuard>
						),
					},
				],
			},
			{
				path: "accesos",
				element: (
					<RoleGuard allowedRoles={["admin"]}>
						<Accesses />
					</RoleGuard>
				),
			},
		],
	},
	{
		path: "/dashboard",
		element: (
			<WelcomeGuard>
				<PrivateGuard>
					<Outlet />
				</PrivateGuard>
			</WelcomeGuard>
		),
		children: [
			{
				index: true,
			},
		],
	},
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
	{
		path: "*",
		element: <Navigate to="/inicia-sesion" />,
	},
]);

export default router;
