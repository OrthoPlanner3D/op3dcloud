import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { UserRole } from "@/types/db/users/user";

/**
 * Interfaz para el usuario en el store (versión simplificada para persistencia)
 */
interface IUser {
	id: string;
	email: string;
	username: string;
	role?: UserRole;
}

/**
 * Interfaz para el store de usuario
 */
interface UserStore {
	user: IUser | null;
	setUser: (user: IUser) => void;
	updateUser: (partialUser: Partial<IUser>) => void;
	removeUser: () => void;
}

export const useUserStore = create<UserStore>()(
	persist(
		(set) => ({
			user: null,
			setUser: (user) => set({ user }),
			updateUser: (partialUser) =>
				set((state) => ({
					user:
						state.user !== null
							? { ...state.user, ...partialUser }
							: null,
				})),
			removeUser: () => set({ user: null }),
		}),
		{
			name: "user",
			storage: createJSONStorage(() => localStorage),
		},
	),
);
