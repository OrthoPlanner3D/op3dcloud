import { supabase } from "@/config/supabase.config";
import { DataBaseError } from "@/errors/dataBaseError";
import { UnknowError } from "@/errors/unknownError";

export async function authUser(): Promise<void> {
	try {
		const { error } = await supabase.auth.signInWithOAuth({
			provider: "google",
			options: {
				redirectTo: `${import.meta.env.VITE_SUPABASE_SITE_URL}/auth/callback`,
			},
		});

		if (error != null) throw new DataBaseError(error.message);
	} catch (error) {
		if (error instanceof DataBaseError) throw error;
		throw new UnknowError("Error desconocido");
	}
}

export async function signOutUser(): Promise<void> {
	try {
		const { error } = await supabase.auth.signOut();

		if (error != null) throw new DataBaseError(error.message);
	} catch (error) {
		if (error instanceof DataBaseError) throw error;
		throw new UnknowError("Error desconocido");
	}
}
