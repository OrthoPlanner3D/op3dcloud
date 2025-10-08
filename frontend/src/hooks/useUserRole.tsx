import { useUserStore } from "@/state/stores/useUserStore";

export function useUserRole() {
	const user = useUserStore((state) => state.user);
	
	return { role: user?.role };
}
