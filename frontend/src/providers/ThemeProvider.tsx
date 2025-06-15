import { getSystemTheme } from "@/lib/utils";
import { useThemeStore } from "@/state/stores/useThemeStore";
import { useEffect } from "react";

interface ThemeProviderProps {
	children: React.ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
	const { theme } = useThemeStore();

	useEffect(() => {
		if (theme !== "system") return;

		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

		const handleChange = () => {
			const root = window.document.documentElement;
			root.classList.remove("light", "dark");
			const systemTheme = getSystemTheme();
			root.classList.add(systemTheme);
		};

		mediaQuery.addEventListener("change", handleChange);
		return () => mediaQuery.removeEventListener("change", handleChange);
	}, [theme]);

	return children;
}
