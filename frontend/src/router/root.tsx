import { createBrowserRouter, Navigate, Outlet } from "react-router";
import PublicLayout from "@/layout/PublicLayout";
import Accesses from "@/pages/accesses";
import FormPlanificadorPdf from "@/pages/formPlanificadorPdf";
import Patients from "@/pages/patient";
import CreatePatient from "@/pages/patient/create";
import Planners from "@/pages/planners";
import PlannersStore from "@/pages/planners/store";
import PrivacyPolicy from "@/pages/privacy";
import Register from "@/pages/register";
import SignIn from "@/pages/sign-in";
import TermsAndConditions from "@/pages/terms";
import TreatmentPlanning from "@/pages/treatment-planning";
import PrivateGuard from "./guards/PrivateGuard";
import PublicGuard from "./guards/PublicGuard";
import RoleGuard from "./guards/RoleGuard";
import RoleRedirectGuard from "./guards/RoleRedirectGuard";

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
			{
				path: "form-planificador-pdf",
				element: <FormPlanificadorPdf />,
			},
		],
	},

	// Private routes with role-based access
	{
		path: "/",
		element: (
			<PrivateGuard>
				<Outlet />
			</PrivateGuard>
		),
		children: [
			{
				index: true,
				element: (
					<RoleGuard allowedRoles={["admin", "planner", "client"]}>
						<RoleRedirectGuard />
					</RoleGuard>
				),
			},
			{
				path: "pacientes",
				children: [
					{
						index: true,
						element: (
							<RoleGuard
								allowedRoles={["admin", "planner", "client"]}
							>
								<Patients />
							</RoleGuard>
						),
					},
					{
						path: "crear",
						element: (
							<RoleGuard
								allowedRoles={["admin", "planner", "client"]}
							>
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
			{
				path: "planificacion-tratamiento",
				element: (
					<RoleGuard allowedRoles={["admin", "planner"]}>
						<TreatmentPlanning />
					</RoleGuard>
				),
			},
		],
	},
	{
		path: "/dashboard",
		element: (
			<PrivateGuard>
				<RoleGuard allowedRoles={["admin", "planner"]}>
					<Outlet />
				</RoleGuard>
			</PrivateGuard>
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
