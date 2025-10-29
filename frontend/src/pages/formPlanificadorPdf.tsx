import {
	Document,
	Image,
	Link,
	Page,
	PDFDownloadLink,
	PDFViewer,
	StyleSheet,
	Text,
	View,
} from "@react-pdf/renderer";
import { useState } from "react";
import logo from "@/assets/images/logos/logo-black.png";
import type { Tables } from "@/types/db/database.types";

type TreatmentPlanningRow = Tables<
	{ schema: "op3dcloud" },
	"treatment_planning"
>;

type PatientRow = Tables<{ schema: "op3dcloud" }, "patients">;

// Register Helvetica (system font, always available in PDFs)
// This is similar to system-ui and ui-sans-serif
// No need to register as it's a standard PDF font

const styles = StyleSheet.create({
	page: {
		flexDirection: "column",
		backgroundColor: "#ffffff",
		padding: 40,
		fontFamily: "Helvetica",
	},
	header: {
		backgroundColor: "#000000",
		padding: 20,
		marginBottom: 30,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#ffffff",
		marginBottom: 8,
		textAlign: "center",
		letterSpacing: 0.5,
	},
	subtitle: {
		fontSize: 10,
		color: "#ffffff",
		textAlign: "center",
		marginTop: 4,
	},
	logo: {
		width: 120,
		position: "absolute",
		bottom: 40,
		right: 40,
		opacity: 0.08,
	},
	sectionContainer: {
		marginBottom: 24,
	},
	sectionTitle: {
		fontSize: 14,
		fontWeight: "bold",
		color: "#000000",
		marginBottom: 12,
		paddingBottom: 6,
		borderBottom: "2px solid #000000",
		textTransform: "uppercase",
		letterSpacing: 0.5,
	},
	card: {
		backgroundColor: "#f8f8f8",
		borderRadius: 6,
		border: "1px solid #e5e5e5",
		padding: 0,
		overflow: "hidden",
	},
	row: {
		flexDirection: "row",
		borderBottom: "1px solid #e5e5e5",
		minHeight: 32,
	},
	rowLast: {
		flexDirection: "row",
		minHeight: 32,
	},
	rowLabel: {
		width: "40%",
		backgroundColor: "#000000",
		padding: 10,
		fontSize: 10,
		fontWeight: "bold",
		color: "#ffffff",
		borderRight: "1px solid #e5e5e5",
	},
	rowValue: {
		width: "60%",
		padding: 10,
		fontSize: 10,
		color: "#171717",
		backgroundColor: "#ffffff",
	},
	rowValueLink: {
		width: "60%",
		padding: 10,
		fontSize: 10,
		color: "#000000",
		backgroundColor: "#ffffff",
		textDecoration: "underline",
	},
	arrayValue: {
		fontSize: 9,
		color: "#404040",
		lineHeight: 1.4,
	},
	footer: {
		position: "absolute",
		bottom: 30,
		left: 40,
		right: 40,
		textAlign: "center",
		fontSize: 8,
		color: "#737373",
		borderTop: "1px solid #e5e5e5",
		paddingTop: 8,
	},
});

interface TreatmentPlanningDocumentProps {
	treatmentPlanning: TreatmentPlanningRow;
	patient: PatientRow;
}

const TreatmentPlanningDocument = ({
	treatmentPlanning,
	patient,
}: TreatmentPlanningDocumentProps) => {
	const renderArrayField = (values: string[] | null) => {
		if (!values || values.length === 0) {
			return "No especificado";
		}
		return values.join(", ");
	};

	return (
		<Document>
			<Page size="A4" style={styles.page}>
				{/* Header */}
				<View style={styles.header}>
					<Text style={styles.title}>
						PLAN DE TRATAMIENTO DIGITAL
					</Text>
					<Text style={styles.subtitle}>
						OrtoPlanner3D™ | Planificación Ortodóntica Profesional
					</Text>
				</View>

				{/* Datos del Paciente */}
				<View style={styles.sectionContainer}>
					<Text style={styles.sectionTitle}>Datos del Paciente</Text>
					<View style={styles.card}>
						<View style={styles.row}>
							<Text style={styles.rowLabel}>Nombre</Text>
							<Text style={styles.rowValue}>{patient.name}</Text>
						</View>
						<View style={styles.rowLast}>
							<Text style={styles.rowLabel}>Apellido</Text>
							<Text style={styles.rowValue}>
								{patient.last_name}
							</Text>
						</View>
					</View>
				</View>

				{/* Planificación de Tratamiento */}
				<View style={styles.sectionContainer}>
					<Text style={styles.sectionTitle}>
						Planificación de Tratamiento
					</Text>
					<View style={styles.card}>
						<View style={styles.row}>
							<Text style={styles.rowLabel}>
								Maxilares a Tratar
							</Text>
							<Text style={styles.rowValue}>
								{treatmentPlanning.maxillaries}
							</Text>
						</View>
						<View style={styles.row}>
							<Text style={styles.rowLabel}>
								Cantidad Superior
							</Text>
							<Text style={styles.rowValue}>
								{treatmentPlanning.upper_quantity}
							</Text>
						</View>
						<View style={styles.row}>
							<Text style={styles.rowLabel}>
								Cantidad Inferior
							</Text>
							<Text style={styles.rowValue}>
								{treatmentPlanning.lower_quantity}
							</Text>
						</View>
						{treatmentPlanning.simulation_render && (
							<View style={styles.row}>
								<Text style={styles.rowLabel}>
									Render Simulación
								</Text>
								<Link
									style={styles.rowValueLink}
									src={treatmentPlanning.simulation_render}
								>
									Ver enlace
								</Link>
							</View>
						)}
						<View style={styles.row}>
							<Text style={styles.rowLabel}>Complejidad</Text>
							<Text style={styles.rowValue}>
								{treatmentPlanning.complexity}
							</Text>
						</View>
						<View style={styles.row}>
							<Text style={styles.rowLabel}>Pronóstico</Text>
							<Text style={styles.rowValue}>
								{treatmentPlanning.prognosis}
							</Text>
						</View>
						<View style={styles.row}>
							<Text style={styles.rowLabel}>Manufactura</Text>
							<Text style={[styles.rowValue, styles.arrayValue]}>
								{renderArrayField(
									treatmentPlanning.manufacturing,
								)}
							</Text>
						</View>
						<View style={styles.row}>
							<Text style={styles.rowLabel}>
								Consideraciones Diagnósticas
							</Text>
							<Text style={[styles.rowValue, styles.arrayValue]}>
								{renderArrayField(
									treatmentPlanning.diagnostic_considerations,
								)}
							</Text>
						</View>
						<View style={styles.row}>
							<Text style={styles.rowLabel}>
								Criterio de Acción Clínica
							</Text>
							<Text style={[styles.rowValue, styles.arrayValue]}>
								{renderArrayField(
									treatmentPlanning.clinical_action_criteria,
								)}
							</Text>
						</View>
						{treatmentPlanning.referrals &&
							treatmentPlanning.referrals.length > 0 && (
								<View style={styles.row}>
									<Text style={styles.rowLabel}>
										Derivaciones
									</Text>
									<Text
										style={[
											styles.rowValue,
											styles.arrayValue,
										]}
									>
										{renderArrayField(
											treatmentPlanning.referrals,
										)}
									</Text>
								</View>
							)}
						{treatmentPlanning.sales_potential &&
							treatmentPlanning.sales_potential.length > 0 && (
								<View style={styles.row}>
									<Text style={styles.rowLabel}>
										Potencial de Venta
									</Text>
									<Text
										style={[
											styles.rowValue,
											styles.arrayValue,
										]}
									>
										{renderArrayField(
											treatmentPlanning.sales_potential,
										)}
									</Text>
								</View>
							)}
						<View style={styles.rowLast}>
							<Text style={styles.rowLabel}>
								Observaciones Adicionales
							</Text>
							<Text style={[styles.rowValue, styles.arrayValue]}>
								{treatmentPlanning.additional_observations ||
									"Sin observaciones adicionales"}
							</Text>
						</View>
					</View>
				</View>

				{/* Watermark Logo */}
				<Image style={styles.logo} src={logo} />

				{/* Footer */}
				<Text style={styles.footer}>
					Documento generado por OrtoPlanner3D™ - Plan de tratamiento
					ortodóntico profesional
				</Text>
			</Page>
		</Document>
	);
};

// Export the document component for use in other components
export { TreatmentPlanningDocument };

// Sample data for testing
const samplePatient: PatientRow = {
	id: 1,
	name: "Juan",
	last_name: "Pérez",
	id_client: "client-123",
	id_planner: "planner-456",
	type_of_plan: "Completo",
	treatment_objective: "Alineación dental",
	treatment_approach: "Invisalign",
	declared_limitations: "Ninguna",
	dental_restrictions: "Ninguna",
	observations_or_instructions: "N/A",
	suggested_adminations_and_actions: "N/A",
	sworn_declaration: true,
	files: "[]",
	planning_enabled: true,
	created_at: new Date().toISOString(),
	case_status: "En proceso",
	status: "Activo",
	status_files: "Completo",
	notes: null,
	observations: null,
	expiration: null,
};

const sampleTreatmentPlanning: TreatmentPlanningRow = {
	id: 1,
	patient_id: 1,
	maxillaries: "Superior e Inferior",
	upper_quantity: 14,
	lower_quantity: 14,
	simulation_render: "https://example.com/render",
	complexity: "Moderada",
	prognosis: "Favorable",
	manufacturing: ["Alineadores transparentes", "Ataches necesarios"],
	diagnostic_considerations: [
		"Apiñamiento moderado",
		"Sobremordida vertical",
	],
	clinical_action_criteria: ["Expansión maxilar", "Stripping interproximal"],
	referrals: ["Periodoncista"],
	sales_potential: ["Blanqueamiento dental", "Retenedores"],
	additional_observations:
		"Paciente colaborador, excelente candidato para tratamiento",
	created_at: new Date().toISOString(),
};

export default function FormPlanificadorPdf() {
	const [showViewer, setShowViewer] = useState(false);

	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-3xl font-bold text-gray-900 mb-8">
					Generador de Reporte PDF
				</h1>

				<div className="bg-white rounded-lg shadow-md p-6 mb-8">
					<h2 className="text-xl font-semibold mb-4">
						Opciones del PDF
					</h2>

					<div className="flex flex-wrap gap-4">
						<button
							type="button"
							onClick={() => setShowViewer(!showViewer)}
							className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
						>
							{showViewer ? "Ocultar Visor" : "Mostrar Visor PDF"}
						</button>

						<PDFDownloadLink
							document={
								<TreatmentPlanningDocument
									treatmentPlanning={sampleTreatmentPlanning}
									patient={samplePatient}
								/>
							}
							fileName="reporte-planificacion.pdf"
							className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors inline-block text-center"
						>
							{({ loading }) =>
								loading ? "Generando PDF..." : "Descargar PDF"
							}
						</PDFDownloadLink>
					</div>
				</div>

				{showViewer && (
					<div className="bg-white rounded-lg shadow-md p-4">
						<h3 className="text-lg font-semibold mb-4">
							Vista Previa del PDF
						</h3>
						<div className="w-full h-screen border border-gray-200 rounded">
							<PDFViewer width="100%" height="100%">
								<TreatmentPlanningDocument
									treatmentPlanning={sampleTreatmentPlanning}
									patient={samplePatient}
								/>
							</PDFViewer>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
