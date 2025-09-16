import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

/**
 * Tipos de roles disponibles en el sistema
 */
export type UserRole = "client" | "planner" | "admin";

/**
 * Interfaz para el usuario
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
