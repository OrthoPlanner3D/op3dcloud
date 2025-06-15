// import { supabase } from "@/config/supabase.config";
// import { DataBaseError } from "@/errors/dataBaseError";
// import { UnknowError } from "@/errors/unknownError";
// import { useUserStore } from "@/state/stores/useUserStore";
// import { useEffect } from "react";

interface Props {
	children: React.ReactNode;
}

export default function AuthProvider({ children }: Props): React.ReactNode {
	// const setUser = useUserStore((state) => state.setUser);
	// const updateUser = useUserStore((state) => state.updateUser);
	// const removeUser = useUserStore((state) => state.removeUser);

	// useEffect(() => {
	// 	const {
	// 		data: { subscription },
	// 	} = supabase.auth.onAuthStateChange((event, session) => {
	// 		if (session) {
	// 			if (event === "INITIAL_SESSION") {
	// 				getViewUserById(session.user.id)
	// 					.then((user) => {
	// 						setUser({
	// 							...user,
	// 							access_token: session.access_token,
	// 						});
	// 					})
	// 					.catch((error) => {
	// 						if (error instanceof DataBaseError) {
	// 							console.error("Error al obtener el usuario:", error.message);
	// 						} else if (error instanceof UnknowError) {
	// 							console.error("Error desconocido:", error.message);
	// 						}
	// 					});
	// 			} else if (event === "SIGNED_IN") {
	// 				const maxRetries = 3;
	// 				const retryDelay = 1000;

	// 				const retryGetUser = (attemptNumber = 0) => {
	// 					getViewUserById(session.user.id)
	// 						.then((user) => {
	// 							if (user) {
	// 								setUser({
	// 									...user,
	// 									access_token: session.access_token,
	// 								});
	// 							} else if (attemptNumber < maxRetries) {
	// 								console.log(
	// 									`Usuario no encontrado, reintentando (${attemptNumber + 1}/${maxRetries})...`,
	// 								);
	// 								setTimeout(() => retryGetUser(attemptNumber + 1), retryDelay);
	// 							} else {
	// 								console.error(
	// 									"No se pudo obtener el usuario después de varios intentos",
	// 								);
	// 							}
	// 						})
	// 						.catch((error) => {
	// 							if (error instanceof DataBaseError) {
	// 								console.error(error.message);
	// 								if (attemptNumber < maxRetries) {
	// 									setTimeout(
	// 										() => retryGetUser(attemptNumber + 1),
	// 										retryDelay,
	// 									);
	// 								}
	// 							} else if (error instanceof UnknowError) {
	// 								console.error(error.message);
	// 							}
	// 						});
	// 				};

	// 				retryGetUser();
	// 			} else if (event === "TOKEN_REFRESHED") {
	// 				updateUser({
	// 					access_token: session.access_token,
	// 				});
	// 			} else if (event === "SIGNED_OUT") {
	// 				removeUser();
	// 			}
	// 		}
	// 	});

	// 	return () => {
	// 		subscription.unsubscribe();
	// 	};
	// }, [setUser, updateUser, removeUser]);

	return children;
}
