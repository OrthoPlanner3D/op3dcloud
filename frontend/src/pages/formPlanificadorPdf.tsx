import {
	Document,
	Font,
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

Font.register({
	family: "Oswald",
	src: "https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf",
});

const styles = StyleSheet.create({
	page: {
		flexDirection: "column",
		backgroundColor: "#ffffff",
		padding: 30,
		fontFamily: "Helvetica",
	},
	title: {
		fontSize: 20,
		marginBottom: 20,
		textAlign: "center",
	},
	subtitle: {
		fontSize: 11,
	},
	logo: {
		width: 100,
		position: "absolute",
		bottom: 30,
		right: 30,
		opacity: 0.1,
		transform: "rotate(-10deg)",
	},
	text: {
		fontSize: 12,
		marginBottom: 5,
		lineHeight: 1.5,
	},
	sectionTitle: {
		fontSize: 14,
		fontWeight: 900,
		marginBottom: 10,
		textDecoration: "underline",
	},
	sectionWrapper: {
		border: "1px solid #000",
	},
	sectionRowItem: {
		display: "flex",
		flexDirection: "row",
		gap: 5,
		borderBottom: "1px solid #000",
		paddingHorizontal: 15,
		paddingVertical: 10,
	},
	sectionRowItemLast: {
		display: "flex",
		flexDirection: "row",
		gap: 5,
		paddingHorizontal: 15,
		paddingVertical: 10,
	},
	sectionRowCellTitle: {
		fontWeight: 900,
	},
	sectionRowCell: {
		fontSize: 12,
		fontWeight: 400,
	},
	separator: {
		borderBottom: "1px solid #000",
		marginVertical: 25,
	},
});

const MyDocument = () => (
	<Document>
		<Page size="A4" style={styles.page}>
			<Text style={styles.title}>
				PLAN DE TRATAMIENTO DIGITAL | OrtoPlanner3D™
			</Text>

			{/* <Text style={styles.subtitle}>
			AL ÉXITO DEL TRATAMIENTO LO CONSTRUIMOS ENTRE TODOS
			Esta planificación digital es una propuesta técnica basada en objetivos realistas, considerando diagnóstico, salud bucal y posibilidades del caso. En la práctica clínica, los resultados suelen alcanzar alrededor del 85 % de lo planificado, dependiendo del compromiso del paciente, la ejecución profesional y el seguimiento acordado.
			</Text> */}

			<Image style={styles.logo} src={logo} />

			<View>
				<Text style={styles.sectionTitle}>Datos del paciente</Text>
				<View style={styles.sectionWrapper}>
					<View style={styles.sectionRowItem}>
						<Text
							style={[
								styles.sectionRowCell,
								styles.sectionRowCellTitle,
							]}
						>
							Nombre:
						</Text>
						<Text style={styles.sectionRowCell}>Hernán</Text>
					</View>
					<View style={styles.sectionRowItem}>
						<Text
							style={[
								styles.sectionRowCell,
								styles.sectionRowCellTitle,
							]}
						>
							Apellido:
						</Text>
						<Text style={styles.sectionRowCell}>Arica</Text>
					</View>
					<View style={styles.sectionRowItemLast}>
						<Text
							style={[
								styles.sectionRowCell,
								styles.sectionRowCellTitle,
							]}
						>
							Apellido:
						</Text>
						<Link
							style={styles.sectionRowCell}
							src="https://www.youtube.com/watch?v=y38qQRg3UDI&list=RDy38qQRg3UDI&start_radio=1"
						>
							Abrir link
						</Link>
					</View>
				</View>
			</View>

			<Text style={styles.separator} />

			<View>
				<Text style={styles.sectionTitle}>Selección</Text>
				<View style={styles.sectionWrapper}>
					<View style={styles.sectionRowItem}>
						<Text
							style={[
								styles.sectionRowCell,
								styles.sectionRowCellTitle,
							]}
						>
							Maxilares a tratar:
						</Text>
						<Text style={styles.sectionRowCell}>Superior</Text>
					</View>
					<View style={styles.sectionRowItem}>
						<Text
							style={[
								styles.sectionRowCell,
								styles.sectionRowCellTitle,
							]}
						>
							Cantidad en superior:
						</Text>
						<Text style={styles.sectionRowCell}>7</Text>
					</View>
					<View style={styles.sectionRowItem}>
						<Text
							style={[
								styles.sectionRowCell,
								styles.sectionRowCellTitle,
							]}
						>
							Cantidad en inferior:
						</Text>
						<Text style={styles.sectionRowCell}>20</Text>
					</View>
					<View style={styles.sectionRowItem}>
						<Text
							style={[
								styles.sectionRowCell,
								styles.sectionRowCellTitle,
							]}
						>
							Render simulación:
						</Text>
						<Text style={styles.sectionRowCell}>Link aquí</Text>
					</View>
					<View style={styles.sectionRowItem}>
						<Text
							style={[
								styles.sectionRowCell,
								styles.sectionRowCellTitle,
							]}
						>
							Enfoque técnico:
						</Text>
						<Text style={styles.sectionRowCell}>Link aquí</Text>
					</View>
					<View style={styles.sectionRowItem}>
						<Text
							style={[
								styles.sectionRowCell,
								styles.sectionRowCellTitle,
							]}
						>
							Complejidad:
						</Text>
						<Text style={styles.sectionRowCell}>Moderada</Text>
					</View>
					<View style={styles.sectionRowItem}>
						<Text
							style={[
								styles.sectionRowCell,
								styles.sectionRowCellTitle,
							]}
						>
							Pronóstico:
						</Text>
						<Text style={styles.sectionRowCell}>Reservado</Text>
					</View>
					<View style={styles.sectionRowItem}>
						<Text
							style={[
								styles.sectionRowCell,
								styles.sectionRowCellTitle,
							]}
						>
							Manufactura | Recomendaciones y requerimientos:
						</Text>
						<Text style={styles.sectionRowCell}>Otro</Text>
					</View>
					<View style={styles.sectionRowItem}>
						<Text
							style={[
								styles.sectionRowCell,
								styles.sectionRowCellTitle,
							]}
						>
							Consideraciones diagnosticas:
						</Text>
						<Text style={styles.sectionRowCell}>Otro</Text>
					</View>
					<View style={styles.sectionRowItem}>
						<Text
							style={[
								styles.sectionRowCell,
								styles.sectionRowCellTitle,
							]}
						>
							Criterio de acción clínica:
						</Text>
						<Text style={styles.sectionRowCell}>
							PROTUSIONES Puntos de presión ante resistencia.
						</Text>
					</View>
					<View style={styles.sectionRowItem}>
						<Text
							style={[
								styles.sectionRowCell,
								styles.sectionRowCellTitle,
							]}
						>
							Derivaciones:
						</Text>
						<Text style={styles.sectionRowCell}>
							Clínica general
						</Text>
					</View>
					<View style={styles.sectionRowItem}>
						<Text
							style={[
								styles.sectionRowCell,
								styles.sectionRowCellTitle,
							]}
						>
							Potencial de venta:
						</Text>
						<Text style={styles.sectionRowCell}>Limpieza</Text>
					</View>
					<View style={styles.sectionRowItem}>
						<Text
							style={[
								styles.sectionRowCell,
								styles.sectionRowCellTitle,
							]}
						>
							Calidad de estudios:
						</Text>
						<Text style={styles.sectionRowCell}>Satisfactorio</Text>
					</View>
					<View style={styles.sectionRowItemLast}>
						<Text
							style={[
								styles.sectionRowCell,
								styles.sectionRowCellTitle,
							]}
						>
							Observaciones adicionales:
						</Text>
						<Text style={styles.sectionRowCell}>
							Sin observaciones adicionales
						</Text>
					</View>
				</View>
			</View>
		</Page>
	</Document>
);

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
							document={<MyDocument />}
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
								<MyDocument />
							</PDFViewer>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
