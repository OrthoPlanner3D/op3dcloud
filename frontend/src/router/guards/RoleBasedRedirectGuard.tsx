import { Navigate } from "react-router";
import { useUserStore } from "@/state/stores/useUserStore";
import Clients from "@/pages/clients";

export default function RoleRedirectGuard() {
	const user = useUserStore((state) => state.user);
	
	if (user?.role === "client") {
		return <Navigate to="/pacientes" replace />;
	}
	
	return <Clients />;
}
