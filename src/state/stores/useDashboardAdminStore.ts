import { create } from "zustand";

interface IDashboardAdminStore {
	id: string | null;
	setId: (id: string | null) => void;
}

export const useDashboardAdminStore = create<IDashboardAdminStore>((set) => ({
	id: null,
	setId: (id) => set({ id }),
}));
