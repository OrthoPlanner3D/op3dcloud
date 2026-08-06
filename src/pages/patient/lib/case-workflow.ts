import type { PatientsRow } from "@/types/db/patients/patients";
import { countPatientFiles } from "./patient-ui";
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
 * Estado del caso derivado de los datos que ya existen. No hay tabla de
 * workflow: cada paso se infiere de un campo real.
 *
 * Ojo con "Pendiente de aprobación": no hay ninguna columna donde se guarde la
 * aprobación del cliente, así que el caso nunca puede avanzar más allá de este
 * paso. Es una limitación del modelo, no del cálculo.
 */
export function getCaseWorkflow(
	patient: PatientsRow,
	planning: TreatmentPlanningRow | null,
): WorkflowStep[] {
	const hasDocs = patient.sworn_declaration && countPatientFiles(patient) > 0;
	const hasPlanning = planning !== null;
	const hasDeliverables = Boolean(planning?.technical_report_url);

	return [
		{
			id: "loaded",
			label: "Caso cargado",
			state: "done",
			date: patient.created_at,
		},
		{
			id: "documentation",
			label: "Documentación",
			state: hasDocs ? "done" : "current",
		},
		{
			id: "planning",
			label: "En planificación",
			state: hasPlanning ? "done" : hasDocs ? "current" : "pending",
			date: planning?.created_at,
		},
		{
			id: "approval",
			label: "Pendiente de aprobación",
			state: hasPlanning ? "current" : "pending",
		},
		{
			id: "deliverables",
			label: "Entregables",
			state: hasDeliverables ? "done" : "locked",
		},
	];
}
