import { useParams } from "react-router";
import TreatmentPlanningView from "@/pages/patient/components/TreatmentPlanningView";

export default function PublicTreatmentPlanningPage() {
	const { patientId } = useParams<{ patientId: string }>();

	if (!patientId || Number.isNaN(Number(patientId))) {
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
				patientId={Number(patientId)}
				isPublic={true}
			/>
		</div>
	);
}
