import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useThemeStore } from "@/state/stores/useThemeStore";
import { Monitor, Moon, Sun } from "lucide-react";

export function ModeToggle() {
	const { theme, setTheme } = useThemeStore();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon">
					{theme === "light" && <Sun className="size-5" />}
					{theme === "dark" && <Moon className="size-5" />}
					{theme === "system" && <Monitor className="size-5" />}
					<span className="sr-only">Cambiar tema</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem onClick={() => setTheme("light")}>
					<Sun className="mr-2 h-4 size-4" />
					<span>Claro</span>
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("dark")}>
					<Moon className="mr-2 h-4 size-4" />
					<span>Oscuro</span>
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("system")}>
					<Monitor className="mr-2 size-4" />
					<span>Sistema</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
