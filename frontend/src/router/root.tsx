import { createBrowserRouter, Navigate, Outlet } from "react-router";
import Accesses from "@/pages/accesses";
import Clients from "@/pages/clients";
import Patients from "@/pages/patient";
import CreatePatient from "@/pages/patient/create";
import Planners from "@/pages/planners";
import PlannersStore from "@/pages/planners/store";
import Register from "@/pages/register";
import SignIn from "@/pages/sign-in";
import TermsAndConditions from "@/pages/terms";
import PrivacyPolicy from "@/pages/privacy";
import PrivateGuard from "./guards/PrivateGuard";
import PublicGuard from "./guards/PublicGuard";
import PublicLayout from "@/layout/PublicLayout";

const router = createBrowserRouter([
	// Public routes
	{
		path: "/public",
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
	
	// Private routes for clients
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
				element: <Clients />,
			},
			{
				path: "pacientes",
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
			{
				path: "planificadores",
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
			{
				path: "accesos",
				element: <Accesses />,
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
		element: <Navigate to="/public/inicia-sesion" />,
	},
]);

export default router;
