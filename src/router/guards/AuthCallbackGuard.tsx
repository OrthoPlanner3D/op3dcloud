import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useUserStore } from "@/state/stores/useUserStore";

interface Props {
	children: React.ReactNode;
}

export default function AuthCallbackGuard({
	children,
}: Props): React.ReactNode {
	const navigate = useNavigate();
	const user = useUserStore((state) => state.user);

	useEffect(() => {
		if (user) {
			navigate("/", { replace: true });
		}
	}, [user, navigate]);

	return children;
}
