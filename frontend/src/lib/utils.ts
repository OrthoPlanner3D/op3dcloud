import { type ClassValue, clsx } from "clsx";
import dayjs from "dayjs";
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

export function formatDate(date: Date | string | null | undefined): string {
	if (!date) return dayjs().format("YYYY-MM-DD");
	return dayjs(date).format("YYYY-MM-DD");
}

export function confirm(message: string): boolean {
	return window.confirm(message);
}
