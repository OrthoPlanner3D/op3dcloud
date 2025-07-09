import { Navigate } from "react-router";
import PatientLayout from "@/layout/PatientLayout";
import { useUserStore } from "@/state/stores/useUserStore";

interface Props {
	children: React.ReactNode;
}

export default function PrivateGuard({ children }: Props): React.ReactNode {
	const user = useUserStore((state) => state.user);

	return user != null ? (
		<PatientLayout>{children}</PatientLayout>
	) : (
		<Navigate to="/inicia-sesion" replace />
	);
}
