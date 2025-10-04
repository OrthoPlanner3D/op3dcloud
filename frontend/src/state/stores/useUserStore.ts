// import type { IUser } from "@/types/user/user";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface IUser {
	id: string;
	email: string;
	username: string;
	user_metadata?: {
		has_seen_welcome?: boolean;
		[key: string]: unknown;
	};
}

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
