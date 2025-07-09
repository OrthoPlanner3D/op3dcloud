import { Navigate, useLocation } from "react-router";
import { useUserStore } from "@/state/stores/useUserStore";

interface Props {
	children: React.ReactNode;
}

export default function PublicGuard({ children }: Props): React.ReactNode {
	const user = useUserStore((state) => state.user);
	const location = useLocation();
	const isCallback = location.pathname === "/auth/callback";

	if (user) return <Navigate to="/" replace />;

	// Si es la ruta de callback y no hay usuario, mostramos un loading o null
	if (isCallback) return null;

	return children;
}
