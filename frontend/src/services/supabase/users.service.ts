// import { supabase } from "@/config/supabase.config";
// import { DataBaseError } from "@/errors/dataBaseError";
// import { UnknowError } from "@/errors/unknownError";
// import type { IUser } from "@/types/user/user";

// export async function getViewUserById(id: string): Promise<IUser> {
// 	try {
// 		const { data: user, error } = await supabase
// 			.schema("aut")
// 			.from("users_view")
// 			.select("*")
// 			.eq("id", id)
// 			.maybeSingle();

// 		if (error != null) throw new DataBaseError(error.message);
// 		if (!user) throw new DataBaseError("Usuario no encontrado");

// 		return user;
// 	} catch (error) {
// 		if (error instanceof DataBaseError) throw error;

// 		throw new UnknowError("Error desconocido");
// 	}
// }
