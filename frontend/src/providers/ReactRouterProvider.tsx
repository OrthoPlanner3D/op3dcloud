import { RouterProvider } from "react-router";
import router from "@/router/root";

export default function ReactRouterProvider() {
	return <RouterProvider router={router} />;
}
