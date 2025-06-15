import { getSystemTheme } from "@/lib/utils";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type Theme = "dark" | "light" | "system";

interface ThemeStore {
	theme: Theme;
	setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeStore>()(
	persist(
		(set) => ({
			theme: "system",
			setTheme: (theme) => {
				set({ theme });
				const root = window.document.documentElement;
				root.classList.remove("light", "dark");

				if (theme === "system") {
					const systemTheme = getSystemTheme();
					root.classList.add(systemTheme);
				} else {
					root.classList.add(theme);
				}
			},
		}),
		{
			name: "theme",
			storage: createJSONStorage(() => localStorage),
			onRehydrateStorage: () => (state) => {
				if (state) {
					const root = window.document.documentElement;
					root.classList.remove("light", "dark");

					if (state.theme === "system") {
						const systemTheme = getSystemTheme();
						root.classList.add(systemTheme);
					} else {
						root.classList.add(state.theme);
					}
				}
			},
		},
	),
);
