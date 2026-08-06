import type { PatientsRow } from "@/types/db/patients/patients";
import type { TreatmentPlanningRow } from "./useTreatmentPlanning";

export type WorkflowStepState = "done" | "current" | "pending" | "locked";

export interface WorkflowStep {
	id: string;
	label: string;
	state: WorkflowStepState;
	/** ISO date, solo cuando el dato existe de verdad. */
	date?: string;
}

/**
 * La documentación se considera completa con los tres grupos que
 * `pages/patient/create.tsx` marca como requeridos, más la declaración jurada.
 * `supplementary_docs` es opcional en el formulario, así que no cuenta.
 */
function hasRequiredDocumentation(patient: PatientsRow): boolean {
	return (
		patient.sworn_declaration &&
		(patient.photos?.length ?? 0) > 0 &&
		(patient.xrays?.length ?? 0) > 0 &&
		(patient.scans?.length ?? 0) > 0
	);
}

/**
 * Estado del caso derivado de los datos que ya existen. No hay tabla de
 * workflow: cada paso se infiere de un campo real.
 *
 * Dos límites del modelo que el stepper no puede tapar:
 * - No hay ninguna columna donde se guarde la aprobación del cliente, así que
 *   el caso nunca avanza más allá de "Pendiente de aprobación".
 * - Como consecuencia, "Entregables" queda siempre bloqueado: el informe
 *   técnico lo sube el planificador junto con la planificación, y darlo por
 *   entregado antes de una aprobación que no existe sería mentir.
 */
export function getCaseWorkflow(
	patient: PatientsRow,
	planning: TreatmentPlanningRow | null,
): WorkflowStep[] {
	const hasDocs = hasRequiredDocumentation(patient);
	const hasPlanning = planning !== null;

	const steps: WorkflowStep[] = [
		{
			id: "loaded",
			label: "Caso cargado",
			state: "done",
			date: patient.created_at,
		},
		{
			id: "documentation",
			label: "Documentación",
			state: hasDocs ? "done" : "pending",
		},
		{
			id: "planning",
			label: "En planificación",
			state: hasPlanning ? "done" : "pending",
			date: planning?.created_at,
		},
		{
			id: "approval",
			label: "Pendiente de aprobación",
			// No existe dónde registrar la aprobación: nunca es "done".
			state: "pending",
		},
		{
			id: "deliverables",
			label: "Entregables",
			// Depende de una aprobación que hoy no puede ocurrir.
			state: "locked",
		},
	];

	return markCurrentStep(steps);
}

/**
 * Marca como `current` al primer paso no completado y deja el resto como
 * estaba. Sin esta pasada podía haber dos pasos actuales a la vez — por
 * ejemplo, un paciente sin declaración jurada al que ya le cargaron la
 * planificación.
 */
function markCurrentStep(steps: WorkflowStep[]): WorkflowStep[] {
	const firstOpen = steps.findIndex((step) => step.state !== "done");
	if (firstOpen === -1) return steps;

	return steps.map((step, index) =>
		index === firstOpen && step.state !== "locked"
			? { ...step, state: "current" }
			: step,
	);
}
