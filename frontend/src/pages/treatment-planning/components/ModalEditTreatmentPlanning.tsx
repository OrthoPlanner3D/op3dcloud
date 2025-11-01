import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import useEditTreatmentPlanningModalStore from "../state/stores/useEditTreatmentPlanningModalStore";
import TreatmentPlanningForm from "./TreatmentPlanningForm";

interface ModalEditTreatmentPlanningProps {
	onPlanningUpdated?: () => void;
}

export default function ModalEditTreatmentPlanning({
	onPlanningUpdated,
}: ModalEditTreatmentPlanningProps) {
	const isOpen = useEditTreatmentPlanningModalStore((state) => state.isOpen);
	const close = useEditTreatmentPlanningModalStore((state) => state.close);
	const patientId = useEditTreatmentPlanningModalStore((state) => state.id);

	const handleSuccess = () => {
		close();
		if (onPlanningUpdated) {
			onPlanningUpdated();
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={close}>
			<DialogContent className="max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>
						Editar Planificación de Tratamiento
					</DialogTitle>
				</DialogHeader>
				{patientId && (
					<TreatmentPlanningForm
						patientId={Number(patientId)}
						onSuccess={handleSuccess}
					/>
				)}
			</DialogContent>
		</Dialog>
	);
}
