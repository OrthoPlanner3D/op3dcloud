import { createBrowserRouter, Navigate, Outlet } from "react-router";
import Clients from "@/pages/clients";
import Patients from "@/pages/patient";
import CreatePatient from "@/pages/patient/create";
import Register from "@/pages/register";
import SignIn from "@/pages/sign-in";
import PrivateGuard from "./guards/PrivateGuard";
import PublicGuard from "./guards/PublicGuard";

const router = createBrowserRouter([
	// Public routes
	{
		path: "/registro",
		element: (
			<PublicGuard>
				<Register />
			</PublicGuard>
		),
	},
	{
		path: "/inicia-sesion",
		element: (
			<PublicGuard>
				<SignIn />
			</PublicGuard>
		),
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
