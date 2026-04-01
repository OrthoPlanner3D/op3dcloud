import { Download, Eye, LinkIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TreatmentPlanningDocument } from "@/pages/formPlanificadorPdf";
import { getTreatmentFilePublicUrl } from "@/services/supabase/storage.service";
import { getTreatmentPlanningByPatientId } from "@/services/supabase/treatment-planning.service";
import type { Tables } from "@/types/db/database.types";
import { usePDF } from "@react-pdf/renderer";

type TreatmentPlanningRow = Tables<
	{ schema: "op3dcloud" },
	"treatment_planning"
>;
type PatientRow = Tables<{ schema: "op3dcloud" }, "patients">;

interface TreatmentPlanningViewProps {
	patientId: number;
	patient?: PatientRow;
	isPublic?: boolean;
}

function PDFPreview({ document }: { document: React.ReactElement }) {
	const [instance] = usePDF({ document });
	if (instance.loading)
		return (
			<p className="text-sm text-muted-foreground">Generando PDF...</p>
		);
	if (instance.error)
		return <p className="text-sm text-red-500">Error al generar el PDF</p>;
	return (
		<object
			data={instance.url ?? ""}
			type="application/pdf"
			width="100%"
			height="100%"
		>
			<p className="text-sm text-muted-foreground">
				Tu navegador no puede mostrar el PDF.
			</p>
		</object>
	);
}

function PDFDownloadButton({
	doc,
	fileName,
}: {
	doc: React.ReactElement;
	fileName: string;
}) {
	const [instance] = usePDF({ document: doc });

	const handleDownload = () => {
		if (!instance.url) return;
		const a = window.document.createElement("a");
		a.href = instance.url;
		a.download = fileName;
		a.click();
	};

	return (
		<Button
			variant="default"
			size="sm"
			disabled={instance.loading || !!instance.error}
			onClick={handleDownload}
			className="min-w-[140px]"
		>
			<Download className="w-4 h-4 mr-2" />
			{instance.loading ? "Generando..." : "Descargar PDF"}
		</Button>
	);
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
		const fetch = async () => {
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
		fetch();
	}, [patientId]);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center p-8">
				<p className="text-sm text-muted-foreground">
					Cargando planificación...
				</p>
			</div>
		);
	}

	if (!treatmentPlanning) {
		return (
			<div className="flex items-center justify-center p-8">
				<div className="text-center space-y-2">
					<p className="text-sm text-muted-foreground">
						No hay planificación de tratamiento disponible para este
						paciente.
					</p>
					<p className="text-xs text-muted-foreground/70">
						El planificador aún no ha completado el formulario.
					</p>
				</div>
			</div>
		);
	}

	const tp = treatmentPlanning;

	const DataField = ({
		label,
		value,
	}: {
		label: string;
		value: React.ReactNode;
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
	}: {
		label: string;
		values: string[];
	}) => (
		<div className="flex flex-col space-y-2">
			<span className="text-xs text-muted-foreground">{label}</span>
			{values && values.length > 0 ? (
				<div className="flex flex-wrap gap-1">
					{values.map((v) => (
						<Badge key={v} variant="default">
							{v}
						</Badge>
					))}
				</div>
			) : (
				<span className="text-sm text-muted-foreground">
					No especificado
				</span>
			)}
		</div>
	);

	const Section = ({
		title,
		children,
	}: {
		title?: string;
		children: React.ReactNode;
	}) => (
		<div className="space-y-4">
			{title && (
				<div>
					<h2 className="text-base font-semibold">{title}</h2>
					<Separator className="mt-1" />
				</div>
			)}
			{children}
		</div>
	);

	return (
		<div className="max-w-4xl mx-auto p-6 pb-12">
			{/* Header */}
			<div className="flex items-start justify-between mb-8">
				<div>
					<h1 className="text-3xl font-bold text-gray-900 mb-2">
						Planificación de Tratamiento
					</h1>
					<p className="text-gray-600">
						Información detallada del plan de tratamiento
						ortodóntico
					</p>
				</div>
				<div className="flex gap-2">
					{patient && (
						<>
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
							<PDFDownloadButton
								doc={
									<TreatmentPlanningDocument
										treatmentPlanning={treatmentPlanning}
										patient={patient}
									/>
								}
								fileName={`planificacion-${patient.name}-${patient.last_name}.pdf`}
							/>
						</>
					)}
				</div>
			</div>

			{showPDFPreview && patient && (
				<div className="mb-8 bg-white rounded-lg shadow-md p-4">
					<h3 className="text-lg font-semibold mb-4">
						Vista Previa del PDF
					</h3>
					<div className="w-full h-[600px]">
						<PDFPreview
							document={
								<TreatmentPlanningDocument
									treatmentPlanning={treatmentPlanning}
									patient={patient}
								/>
							}
						/>
					</div>
				</div>
			)}

			<div className="space-y-8 pb-8">
				{/* Assets */}
				{(tp.video_url || tp.technical_report_url) && (
					<Section>
						{tp.video_url && (
							<DataField
								label="Video"
								value={
									<a
										href={getTreatmentFilePublicUrl(
											tp.video_url,
										)}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex items-center gap-1 text-primary hover:underline"
									>
										<LinkIcon className="w-3 h-3" />
										Ver enlace
									</a>
								}
							/>
						)}
						{tp.technical_report_url && (
							<DataField
								label="Informe Técnico"
								value={
									<a
										href={getTreatmentFilePublicUrl(
											tp.technical_report_url,
										)}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex items-center gap-1 text-primary hover:underline"
									>
										<LinkIcon className="w-3 h-3" />
										Ver enlace
									</a>
								}
							/>
						)}
					</Section>
				)}

				{/* Datos Clínicos */}
				<Section>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<DataField
							label="N Alineadores Max. Superior"
							value={tp.upper_aligners}
						/>
						<DataField
							label="N Alineadores Max. Inferior"
							value={tp.lower_aligners}
						/>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<DataField label="Complejidad" value={tp.complexity} />
						<DataField label="Pronóstico" value={tp.prognosis} />
					</div>
				</Section>

				{/* Diagnóstico */}
				<Section title="EVALUACIÓN CLÍNICA">
					<DataArrayField
						label="Diagnóstico Presuntivo General"
						values={tp.diagnosis || []}
					/>
				</Section>

				{/* Laboratorio */}
				<Section title="MANUFACTURA">
					<DataArrayField
						label="Laboratorio"
						values={tp.laboratory || []}
					/>
				</Section>

				{/* Planificación */}
				<Section title="PLAN DE ACCIÓN">
					<DataArrayField
						label="Criterio de Planificación y Accionar Clínico"
						values={tp.planning || []}
					/>
				</Section>

				{/* Restricciones */}
				{tp.restrictions && tp.restrictions.length > 0 && (
					<Section>
						<DataArrayField
							label="Restricciones Biomecánicas"
							values={tp.restrictions}
						/>
					</Section>
				)}

				{/* Tracking */}
				{[
					tp.tracking_rotations,
					tp.tracking_extrusions,
					tp.tracking_extrusion_buttons,
					tp.tracking_intrusions,
					tp.tracking_torque,
					tp.tracking_angulations,
					tp.tracking_translations,
					tp.tracking_expansion,
				].some(Boolean) && (
					<Section title="Control de Tracking para Movimientos Complejos">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{tp.tracking_rotations && (
								<DataField
									label="Rotaciones"
									value={tp.tracking_rotations}
								/>
							)}
							{tp.tracking_extrusions && (
								<DataField
									label="Extrusiones (controles clínicos)"
									value={tp.tracking_extrusions}
								/>
							)}
							{tp.tracking_extrusion_buttons && (
								<DataField
									label="Extrusiones (botones programados)"
									value={tp.tracking_extrusion_buttons}
								/>
							)}
							{tp.tracking_intrusions && (
								<DataField
									label="Intrusiones"
									value={tp.tracking_intrusions}
								/>
							)}
							{tp.tracking_torque && (
								<DataField
									label="Torque/Inclinaciones"
									value={tp.tracking_torque}
								/>
							)}
							{tp.tracking_angulations && (
								<DataField
									label="Angulaciones"
									value={tp.tracking_angulations}
								/>
							)}
							{tp.tracking_translations && (
								<DataField
									label="Traslaciones"
									value={tp.tracking_translations}
								/>
							)}
							{tp.tracking_expansion && (
								<DataField
									label="Expansión/Compresión"
									value={tp.tracking_expansion}
								/>
							)}
						</div>
					</Section>
				)}

				{/* Observaciones */}
				{tp.additional_observations && (
					<Section>
						<DataField
							label="Observaciones Adicionales"
							value={tp.additional_observations}
						/>
					</Section>
				)}

				{/* Análisis Comercial */}
				{tp.commercial_potential &&
					tp.commercial_potential.length > 0 && (
						<Section title="ANÁLISIS COMERCIAL">
							<DataArrayField
								label="Potencial Clínico-Comercial"
								values={tp.commercial_potential}
							/>
						</Section>
					)}

				{/* Calidad */}
				{[
					tp.quality_information,
					tp.quality_scan,
					tp.quality_xrays,
					tp.quality_intraoral,
					tp.quality_extraoral,
				].some((a) => a && a.length > 0) && (
					<Section title="ESPACIO DE MEJORA CONTINUA">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{tp.quality_information &&
								tp.quality_information.length > 0 && (
									<DataArrayField
										label="Calidad de la Información"
										values={tp.quality_information}
									/>
								)}
							{tp.quality_scan && tp.quality_scan.length > 0 && (
								<DataArrayField
									label="Calidad de Escaneo"
									values={tp.quality_scan}
								/>
							)}
							{tp.quality_xrays &&
								tp.quality_xrays.length > 0 && (
									<DataArrayField
										label="Calidad de Radiografías"
										values={tp.quality_xrays}
									/>
								)}
							{tp.quality_intraoral &&
								tp.quality_intraoral.length > 0 && (
									<DataArrayField
										label="Calidad de Fotos Intraorales"
										values={tp.quality_intraoral}
									/>
								)}
							{tp.quality_extraoral &&
								tp.quality_extraoral.length > 0 && (
									<DataArrayField
										label="Calidad de Fotos Extraorales"
										values={tp.quality_extraoral}
									/>
								)}
						</div>
					</Section>
				)}
			</div>
		</div>
	);
}
