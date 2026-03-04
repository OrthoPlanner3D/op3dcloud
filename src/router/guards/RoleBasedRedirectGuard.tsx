import { Navigate } from "react-router";
import Clients from "@/pages/clients";
import { useUserStore } from "@/state/stores/useUserStore";

export default function RoleRedirectGuard() {
	const user = useUserStore((state) => state.user);

	if (user?.role === "client") {
		return <Navigate to="/pacientes" replace />;
	}

	return <Clients />;
}
