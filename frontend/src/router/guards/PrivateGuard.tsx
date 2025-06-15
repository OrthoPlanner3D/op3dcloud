import PrivateLayout from "@/layout/PrivateLayout";
import { useUserStore } from "@/state/stores/useUserStore";
import { Navigate } from "react-router";

interface Props {
	children: React.ReactNode;
}

export default function PrivateGuard({ children }: Props): React.ReactNode {
	const user = useUserStore((state) => state.user);

	return user != null ? (
		<PrivateLayout>{children}</PrivateLayout>
	) : (
		<Navigate to="/login" replace />
	);
}
