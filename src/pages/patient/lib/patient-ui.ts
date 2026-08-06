/**
 * Helpers de presentación locales a la feature de pacientes.
 */

/** Iniciales del paciente para el Avatar. Ej: ("María", "González") -> "MG" */
export function getInitials(
	name?: string | null,
	lastName?: string | null,
): string {
	const first = name?.trim().charAt(0) ?? "";
	const second = lastName?.trim().charAt(0) ?? "";
	const initials = `${first}${second}`.toUpperCase();
	return initials || "?";
}

/**
 * Clases del badge según el estado del caso. Los valores provienen de
 * CASE_STATUS_OPTIONS en `pages/clients/components/modalEditClient.tsx`.
 */
const CASE_STATUS_CLASSES: Record<string, string> = {
	Prioridad:
		"border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200",
	Interconsulta:
		"border-sky-300 bg-sky-50 text-sky-800 dark:border-sky-500/40 dark:bg-sky-500/10 dark:text-sky-200",
	Replanning:
		"border-violet-300 bg-violet-50 text-violet-800 dark:border-violet-500/40 dark:bg-violet-500/10 dark:text-violet-200",
	Baja: "border-slate-300 bg-slate-50 text-slate-700 dark:border-slate-500/40 dark:bg-slate-500/10 dark:text-slate-300",
};

const CASE_STATUS_FALLBACK =
	"border-border bg-muted text-muted-foreground dark:bg-muted/40";

export function getCaseStatusClass(status: string): string {
	return CASE_STATUS_CLASSES[status] ?? CASE_STATUS_FALLBACK;
}

/** Color del puntito que acompaña al badge de estado. */
const CASE_STATUS_DOT_CLASSES: Record<string, string> = {
	Prioridad: "bg-amber-500",
	Interconsulta: "bg-sky-500",
	Replanning: "bg-violet-500",
	Baja: "bg-slate-400",
};

export function getCaseStatusDotClass(status: string): string {
	return CASE_STATUS_DOT_CLASSES[status] ?? "bg-muted-foreground";
}
