import { useUserStore } from "@/state/stores/useUserStore";
import type { UserRole } from "@/services/supabase/users.service";

export function useUserRole() {
	const user = useUserStore((state) => state.user);
	
	return { role: user?.role as UserRole | undefined };
}
