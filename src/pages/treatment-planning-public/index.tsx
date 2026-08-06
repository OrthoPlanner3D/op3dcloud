import { useParams } from "react-router";
import TreatmentPlanningView from "@/pages/patient/components/TreatmentPlanningView";
import { useTreatmentPlanning } from "@/pages/patient/lib/useTreatmentPlanning";

export default function PublicTreatmentPlanningPage() {
	const { patientId } = useParams<{ patientId: string }>();
	const isValid = Boolean(patientId) && !Number.isNaN(Number(patientId));

	const { data, isLoading } = useTreatmentPlanning(
		isValid ? Number(patientId) : null,
	);

	if (!isValid) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<p className="text-sm text-muted-foreground">
					ID de paciente no válido.
				</p>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background">
			<TreatmentPlanningView
				treatmentPlanning={data}
				isLoading={isLoading}
				isPublic
			/>
		</div>
	);
}
