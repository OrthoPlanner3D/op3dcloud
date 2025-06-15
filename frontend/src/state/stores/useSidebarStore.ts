import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SidebarState {
	isOpen: boolean;
	toggleSidebar: () => void;
	setOpen: (isOpen: boolean) => void;
}

export const useSidebarStore = create<SidebarState>()(
	persist(
		(set) => ({
			isOpen: true,
			toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),
			setOpen: (isOpen) => set({ isOpen }),
		}),
		{
			name: "sidebar",
			onRehydrateStorage: () => (state) => {
				if (state) {
					const stored = localStorage.getItem("sidebar");
					if (stored) {
						try {
							const parsed = JSON.parse(stored);
							if (typeof parsed.state?.isOpen === "boolean") {
								state.setOpen(parsed.state.isOpen);
							}
						} catch {
							// Si hay error al parsear, mantenemos el valor por defecto
						}
					}
				}
			},
		},
	),
);
