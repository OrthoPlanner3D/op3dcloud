import { useEffect } from "react";
import { supabase } from "@/config/supabase.config";
import { useUserStore } from "@/state/stores/useUserStore";

interface Props {
	children: React.ReactNode;
}

export default function AuthProvider({ children }: Props): React.ReactNode {
	const setUser = useUserStore((state) => state.setUser);
	const updateUser = useUserStore((state) => state.updateUser);
	const removeUser = useUserStore((state) => state.removeUser);

	useEffect(() => {
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (event, session) => {
			if (session) {
				if (event === "INITIAL_SESSION" || event === "SIGNED_IN") {
					// Obtener información del usuario desde Supabase Auth
					const {
						data: { user },
						error,
					} = await supabase.auth.getUser();

					if (error) {
						console.error("Error getting user:", error);
						return;
					}

					if (user) {
						// Crear objeto de usuario con la información disponible
						const userData = {
							id: user.id,
							email: user.email || "",
							username:
								user.user_metadata?.username ||
								user.email?.split("@")[0] ||
								"",
							// Incluir metadatos del usuario para verificar primera vez
							user_metadata: user.user_metadata,
						};

						setUser(userData);
					}
				} else if (
					event === "TOKEN_REFRESHED" ||
					event === "USER_UPDATED"
				) {
					// Actualizar token o metadatos del usuario
					const {
						data: { user },
						error,
					} = await supabase.auth.getUser();

					if (!error && user) {
						updateUser({
							id: user.id,
							email: user.email || "",
							username:
								user.user_metadata?.username ||
								user.email?.split("@")[0] ||
								"",
							user_metadata: user.user_metadata,
						});
					}
				}
			} else if (event === "SIGNED_OUT") {
				removeUser();
			}
		});

		return () => {
			subscription.unsubscribe();
		};
	}, [setUser, updateUser, removeUser]);

	return children;
}
