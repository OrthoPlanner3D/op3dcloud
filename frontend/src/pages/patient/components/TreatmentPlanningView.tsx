import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { Download, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { TreatmentPlanningDocument } from "@/pages/formPlanificadorPdf";
import { getTreatmentPlanningByPatientId } from "@/services/supabase/treatment-planning.service";
import type { Tables } from "@/types/db/database.types";

type TreatmentPlanningRow = Tables<
	{ schema: "op3dcloud" },
	"treatment_planning"
>;

type PatientRow = Tables<{ schema: "op3dcloud" }, "patients">;

interface TreatmentPlanningViewProps {
	patientId: number;
	patient?: PatientRow;
}

export default function TreatmentPlanningView({
	patientId,
	patient,
}: TreatmentPlanningViewProps) {
	const [treatmentPlanning, setTreatmentPlanning] =
		useState<TreatmentPlanningRow | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [showPDFPreview, setShowPDFPreview] = useState(false);

	useEffect(() => {
		const fetchTreatmentPlanning = async () => {
			try {
				setIsLoading(true);
				const data = await getTreatmentPlanningByPatientId(patientId);
				setTreatmentPlanning(data);
			} catch (error) {
				console.error("Error fetching treatment planning:", error);
				toast.error("Error al cargar la planificación de tratamiento");
			} finally {
				setIsLoading(false);
			}
		};

		fetchTreatmentPlanning();
	}, [patientId]);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center p-8">
				<div className="text-sm text-muted-foreground">
					Cargando planificación...
				</div>
			</div>
		);
	}

	if (!treatmentPlanning) {
		return (
			<div className="flex items-center justify-center p-8">
				<div className="text-center space-y-2">
					<p className="text-sm text-muted-foreground">
						No hay planificación de tratamiento disponible para este
						paciente
					</p>
					<p className="text-xs text-muted-foreground/70">
						El planificador aún no ha completado el formulario
					</p>
				</div>
			</div>
		);
	}

	const DataField = ({
		label,
		value,
	}: {
		label: string;
		value: string | number | null | React.ReactNode;
	}) => (
		<div className="flex flex-col space-y-1">
			<span className="text-xs text-muted-foreground">{label}</span>
			<div className="text-sm font-medium">
				{value || "No especificado"}
			</div>
		</div>
	);

	const DataArrayField = ({
		label,
		values,
		colorClass,
	}: {
		label: string;
		values: string[];
		colorClass: string;
	}) => (
		<div className="flex flex-col space-y-2">
			<span className="text-xs text-muted-foreground">{label}</span>
			{values && values.length > 0 ? (
				<div className="flex flex-wrap gap-1">
					{values.map((value) => (
						<span
							key={value}
							className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${colorClass}`}
						>
							{value}
						</span>
					))}
				</div>
			) : (
				<span className="text-sm text-muted-foreground">
					No especificado
				</span>
			)}
		</div>
	);

	return (
		<div className="max-w-4xl mx-auto p-6 pb-12">
			<div className="mb-8">
				<div className="flex items-start justify-between mb-4">
					<div>
						<h1 className="text-3xl font-bold text-gray-900 mb-2">
							Planificación de Tratamiento
						</h1>
						<p className="text-gray-600">
							Información detallada del plan de tratamiento
							ortodóntico
						</p>
					</div>
					{patient && (
						<div className="flex gap-2">
							<Button
								onClick={() =>
									setShowPDFPreview(!showPDFPreview)
								}
								variant="outline"
								size="sm"
							>
								<Eye className="w-4 h-4 mr-2" />
								{showPDFPreview ? "Ocultar PDF" : "Ver PDF"}
							</Button>
							<PDFDownloadLink
								document={
									<TreatmentPlanningDocument
										treatmentPlanning={treatmentPlanning}
										patient={patient}
									/>
								}
								fileName={`planificacion-${patient.name}-${patient.last_name}.pdf`}
							>
								{({ loading }) => (
									<Button
										variant="default"
										size="sm"
										disabled={loading}
									>
										<Download className="w-4 h-4 mr-2" />
										{loading
											? "Generando..."
											: "Descargar PDF"}
									</Button>
								)}
							</PDFDownloadLink>
						</div>
					)}
				</div>
			</div>

			{showPDFPreview && patient && (
				<div className="mb-8 bg-white rounded-lg shadow-md p-4">
					<h3 className="text-lg font-semibold mb-4">
						Vista Previa del PDF
					</h3>
					<div className="w-full border border-gray-200 rounded overflow-hidden">
						<PDFViewer width="100%" height="600px">
							<TreatmentPlanningDocument
								treatmentPlanning={treatmentPlanning}
								patient={patient}
							/>
						</PDFViewer>
					</div>
				</div>
			)}

			<div className="space-y-6 pb-8">
				{/* Maxilares y Cantidades */}
				<div className="space-y-4">
					<DataField
						label="Maxilares a Tratar"
						value={treatmentPlanning.maxillaries}
					/>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<DataField
						label="Cantidad en Superior"
						value={treatmentPlanning.upper_quantity}
					/>
					<DataField
						label="Cantidad en Inferior"
						value={treatmentPlanning.lower_quantity}
					/>
				</div>

				{/* Render Simulación */}
				{treatmentPlanning.simulation_render && (
					<DataField
						label="Render Simulación"
						value={
							<a
								href={treatmentPlanning.simulation_render}
								target="_blank"
								rel="noopener noreferrer"
								className="text-sm text-primary hover:underline"
							>
								{treatmentPlanning.simulation_render}
							</a>
						}
					/>
				)}

				{/* Complejidad */}
				<DataField
					label="Complejidad"
					value={treatmentPlanning.complexity}
				/>

				{/* Pronóstico */}
				<DataField
					label="Pronóstico"
					value={treatmentPlanning.prognosis}
				/>

				{/* Manufactura */}
				<DataArrayField
					label="Manufactura - Recomendaciones y Requerimientos"
					values={treatmentPlanning.manufacturing || []}
					colorClass="bg-blue-100 text-blue-800"
				/>

				{/* Consideraciones Diagnósticas */}
				<DataArrayField
					label="Consideraciones Diagnósticas"
					values={treatmentPlanning.diagnostic_considerations || []}
					colorClass="bg-green-100 text-green-800"
				/>

				{/* Criterio de Acción Clínica */}
				<DataArrayField
					label="Criterio de Acción Clínica"
					values={treatmentPlanning.clinical_action_criteria || []}
					colorClass="bg-purple-100 text-purple-800"
				/>

				{/* Derivaciones */}
				{treatmentPlanning.referrals &&
					treatmentPlanning.referrals.length > 0 && (
						<DataArrayField
							label="Derivaciones"
							values={treatmentPlanning.referrals}
							colorClass="bg-orange-100 text-orange-800"
						/>
					)}

				{/* Potencial de Venta */}
				{treatmentPlanning.sales_potential &&
					treatmentPlanning.sales_potential.length > 0 && (
						<DataArrayField
							label="Potencial de Venta"
							values={treatmentPlanning.sales_potential}
							colorClass="bg-pink-100 text-pink-800"
						/>
					)}

				{/* Observaciones Adicionales */}
				{treatmentPlanning.additional_observations && (
					<DataField
						label="Observaciones Adicionales"
						value={
							<p className="text-sm whitespace-pre-wrap">
								{treatmentPlanning.additional_observations}
							</p>
						}
					/>
				)}
			</div>
		</div>
	);
}
