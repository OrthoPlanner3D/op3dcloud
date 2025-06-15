import { DataBaseError } from "@/errors/dataBaseError";
import { UnknowError } from "@/errors/unknownError";
import { signOutUser } from "@/services/supabase/auth.service";
import { useUserStore } from "@/state/stores/useUserStore";
import { useNavigate } from "react-router";

export const useSignOut = () => {
	const removeUser = useUserStore((state) => state.removeUser);
	const navigate = useNavigate();

	const signOut = async (): Promise<void> => {
		try {
			await signOutUser();
			removeUser();
			navigate("/", { replace: true });
		} catch (error) {
			if (error instanceof DataBaseError) {
				//   notifyError('Error al obtener los deals')
			} else if (error instanceof UnknowError) {
				//   notifyError(`Error: ${error.message}`)
			}
		}
	};

	return { signOut };
};
