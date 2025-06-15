import router from "@/router/root";
import { RouterProvider } from "react-router";

export default function ReactRouterProvider() {
	return (
		<>
			<RouterProvider router={router} />
		</>
	);
}
