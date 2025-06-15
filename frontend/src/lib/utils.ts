import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export async function sleep(ms: number): Promise<void> {
	await new Promise((resolve) => setTimeout(resolve, ms));
}

export const getSystemTheme = () => {
	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
};

// export function dateFormatForHumans(date: string): string {
// 	return dayjs(date).format("MMMM D, YYYY");
// }

export function confirm(message: string): boolean {
	return window.confirm(message);
}
