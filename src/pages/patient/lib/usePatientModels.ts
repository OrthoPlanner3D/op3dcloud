import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getPatientModelsByPatientId } from "@/services/supabase/patient-models.service";
import { listPatientModelFiles } from "@/services/supabase/storage.service";

export interface PatientModelCase {
	id: number;
	storagePrefix: string;
	createdAt: string;
	/** Rutas completas de los GLB dentro del bucket `patient-models`. */
	files: string[];
}

/**
 * Casos 3D del paciente, cargados desde `stl-render`. La tabla sólo guarda el
 * prefijo de cada caso, así que después de traer las filas hay que listar el
 * bucket para saber qué archivos tiene cada una.
 */
export function usePatientModels(patientId: number | null) {
	const [cases, setCases] = useState<PatientModelCase[]>([]);
	const [isLoading, setIsLoading] = useState(patientId !== null);

	useEffect(() => {
		if (patientId === null) {
			setCases([]);
			setIsLoading(false);
			return;
		}

		let cancelled = false;
		// Se limpia antes de pedir: si no, al cambiar de paciente se seguirían
		// viendo los modelos del anterior hasta que resuelva.
		setCases([]);
		setIsLoading(true);

		getPatientModelsByPatientId(patientId)
			.then((rows) =>
				Promise.all(
					rows.map(async (row) => ({
						id: row.id,
						storagePrefix: row.storage_prefix,
						createdAt: row.created_at,
						// Un caso sin archivos se conserva con la lista vacía:
						// la fila existe, y eso es un dato en sí mismo.
						files: await listPatientModelFiles(row.storage_prefix),
					})),
				),
			)
			.then((result) => {
				if (!cancelled) setCases(result);
			})
			.catch((error) => {
				console.error("Error fetching patient models:", error);
				if (!cancelled) {
					setCases([]);
					toast.error("Error al cargar los modelos 3D del paciente");
				}
			})
			.finally(() => {
				if (!cancelled) setIsLoading(false);
			});

		return () => {
			cancelled = true;
		};
	}, [patientId]);

	return { cases, isLoading };
}
