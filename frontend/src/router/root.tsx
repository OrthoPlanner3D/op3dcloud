import { Navigate, createBrowserRouter } from "react-router";
import PrivateGuard from "./guards/PrivateGuard";
import PublicGuard from "./guards/PublicGuard";
import Register from "@/pages/register";
import SignIn from "@/pages/sign-in";

const router = createBrowserRouter([
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
	{
		path: "/",
		element: (
			<PrivateGuard>
				<h1>Home</h1>
			</PrivateGuard>
		),
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
		element: <Navigate to="/registro" />,
	},
]);

export default router;
