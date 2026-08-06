import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getTreatmentPlanningByPatientId } from "@/services/supabase/treatment-planning.service";
import type { Tables } from "@/types/db/database.types";

export type TreatmentPlanningRow = Tables<
	{ schema: "op3dcloud" },
	"treatment_planning"
>;

/**
 * Planificación del paciente. Vive acá arriba porque la necesitan tanto el
 * resumen del caso (KPIs, workflow, card 3D) como la pestaña de planificación.
 */
export function useTreatmentPlanning(patientId: number | null) {
	const [data, setData] = useState<TreatmentPlanningRow | null>(null);
	const [isLoading, setIsLoading] = useState(patientId !== null);

	useEffect(() => {
		if (patientId === null) {
			setData(null);
			setIsLoading(false);
			return;
		}

		let cancelled = false;
		// Se limpia antes de pedir: si no, al cambiar de paciente la toolbar
		// seguiría ofreciendo el PDF del paciente anterior hasta que resuelva.
		setData(null);
		setIsLoading(true);

		getTreatmentPlanningByPatientId(patientId)
			.then((planning) => {
				if (!cancelled) setData(planning);
			})
			.catch((error) => {
				console.error("Error fetching treatment planning:", error);
				if (!cancelled) {
					setData(null);
					toast.error(
						"Error al cargar la planificación de tratamiento",
					);
				}
			})
			.finally(() => {
				if (!cancelled) setIsLoading(false);
			});

		return () => {
			cancelled = true;
		};
	}, [patientId]);

	return { data, isLoading };
}
