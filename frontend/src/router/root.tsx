import { Navigate, createBrowserRouter } from "react-router";
import PrivateGuard from "./guards/PrivateGuard";
import PublicGuard from "./guards/PublicGuard";

const router = createBrowserRouter([
	{
		path: "/login",
		element: (
			<PublicGuard>
				<h1>Login</h1>
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
		element: <Navigate to="/login" />,
	},
]);

export default router;
