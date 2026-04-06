import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radiogroup";
import {
	SearchableMultiSelect,
	SearchableSelect,
} from "@/components/ui/searchable-select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { usePatients } from "@/hooks/swr/usePatients";
import {
	getTreatmentFilePublicUrl,
	uploadTreatmentFile,
} from "@/services/supabase/storage.service";
import {
	createTreatmentPlanning,
	getTreatmentPlanningByPatientId,
	updateTreatmentPlanning,
} from "@/services/supabase/treatment-planning.service";
import type { Tables } from "@/types/db/database.types";

// ─── Opciones ───────────────────────────────────────────────────────────────

const complexityOptions = [
	"Baja",
	"Moderada",
	"Alta (necesidad de refinamiento)",
];

const prognosisOptions = [
	"Favorable",
	"Reservada (posible necesidad de refinamiento)",
];

const diagnosisOptions = [
	"GINGIVITIS: Se recomienda la técnica de cepillado de Bass y consulta con un odontólogo general o periodoncista.",
	"RETRACCIONES GINGIVALES: Pueden provocar triángulos negros entre los dientes y progresar con el tiempo. Se recomienda control periódico con un especialista en Periodoncia.",
	"PERIODONTITIS: Retracciones gingivales y reabsorción ósea. Los alineadores pueden mejorar la situación pero requiere tratamiento a la par con especialista en periodoncia.",
	"LIMPIEZA PERIODONTAL: Realizarla previo a iniciar el tratamiento.",
	"CARIES: Pueden tratarse en paralelo, respetando la anatomía del diente.",
	"RESTAURACIONES DEFICIENTES: Se recomienda reemplazar restauraciones defectuosas al finalizar el tratamiento.",
	"3° MOLARES: Se recomienda para lograr la armonía bucal, liberar presiones por falta de espacio y para evitar lesiones en dientes contiguos (no es obligatorio para el tratamiento).",
	"3° MOLARES: Se solicita la extracción inmediata o en un plazo máximo de 2 meses.",
	"RESTO RADICULAR: Se recomienda consultar con odontólogo de cabecera.",
	"RESTO RADICULAR: Se solicita su extracción con odontólogo de cabecera, antes de iniciar el tratamiento.",
	"LESIÓN QUISTICA: Se recomienda consultar con especialista.",
	"DISCREPANCIA DE BOLTON: Incisivos laterales de menor tamaño del correspondiente, lo que impide la llave canina ideal.",
	"DISCREPANCIA DE BOLTON: Incisivos laterales de menor tamaño del correspondiente, que requiere dejar espacios proximales para reconstrucción posterior.",
	"BORDES DENTARIOS IRREGULARES: Puede requerir desgaste estético o reconstrucción (sustracción o adición).",
	"MORDIDA ABIERTA: Puede requerir reeducación lingual con fonoaudiólogo.",
	"DISFUNCIÓN DE ATM: Relacionado con malas mordidas o bruxismo. Evaluación con especialista en caso de molestias (no es impedimento para realizar el tratamiento).",
	"DIENTES DECIDUOS: No se puede aplicar movimientos ni garantizar la estabilidad en boca de los mismos (cuestión biología).",
	"CORONAS PROTÉSICAS: DIENTES DECIDUOS: No se puede aplicar movimientos. Se recomienda corte socavado en la zona para evitar la desadaptación.",
	"ELEMENTOS AUXILIARES: Uso de botones y gomas para movimientos complejos.",
	"TRAT. COMPLEJO: Casos con más de 14 alineadores pueden requerir etapas adicionales (plantearlo por etapas).",
	"LIMITACIONES ESTRUCTIRALES: El biotipo óseo impide una mordida ideal, pero se trabaja en dejar la mordida lo más armónica posible.",
	"TRAT. A DISTANCIA: Puede reducir la efectividad.",
	"FALTA DE ESPACIO: Impide ubicar a las piezas en el arco dentario.",
	"FRENILLO LABIAL: Realizar diagnostico clínico para corroborar inserción y derivar a cirugía para evitar recidivas.",
	"MORDIDA CRUZADA POSTERIOR: No se programa el descruce dada la baja predictibilidad del movimiento.",
	"LÍNEA MEDIA: Movimiento limitado por la complejidad del mismo.",
	"TRAT. UNIMAXILAR: Sólo se puede planificar el maxilar planteado dada las limitaciones bucales. Se puede optar una ortodoncia híbrida.",
	"TRAT. BIMAXILAR: Para lograr los objetivos, se requiere realizar ambos maxilares.",
	"Otros",
];

const laboratoryOptions = [
	"NO APLICA.",
	"CASO COMPLEJO: Imprimir por tandas.",
	"PERIODONTITIS: Espesor de placas de 0,03 pulgadas.",
	"EXPANSIONES: Última placa duplicada (2 alineadores: uno en espesor 0,03 pulgadas y otro en 0,04 pulgadas).",
	"SOCAVADO: Coronas protésicas y/o dientes vecinos.",
	"DUPLICACIÓN DE ALINEADORES: 0,03' y 0.04' (posible necesidad por bruxismo severo).",
	"DUPLICACIÓN DE ALINEADORES: Puede indicarse en movimientos de baja predictibilidad o alta resistencia.",
	"CORTE FESTONEADO: Por gingivitis y/o apiñamiento.",
	"BOTÓN DE EXTRUSIÓN: Socavar última placa (Requerimiento para movimiento programado).",
	"BOTÓN DE EXTRUSIÓN: Socavar en número de placa programada (Requerimiento para movimiento programado).",
	"AJUSTE DE RECAMBIO: La frecuencia de cambio de alineadores puede adaptarse según respuesta clínica.",
	"VALIDACIÓN CLÍNICA: Se recomienda validación previa con el profesional tratante en casos complejos.",
	"REFINAMIENTO: Se contempla la necesidad de etapas adicionales según evolución del caso.",
	"Otro",
];

const planningOptions = [
	"ALINEACIÓN Y NIVELACIÓN general.",
	"Mejora de MORDIDA PROFUNDA.",
	"Mejora de MORDIDA ABIERTA.",
	"DESCRUCE DE MORDIDA ANTERIOR.",
	"DESCRUCE DE MORDIDA LATERAL.",
	"Mejora de LLAVE CANINA.",
	"Mejora de LÍNEA MEDIA.",
	"CIERRE DE ESPACIOS.",
	"CIERRE DE DIASTEMAS.",
	"ROTACIONES COMPLEJAS con posible necesidad de Elementos Auxiliares (botones y gomas) o Puntos de Presión interceptivos o finales.",
	"EXTRUSIONES COMPLEJAS con posible necesidad de elementos auxiliares (botones y gomas).",
	"MOVIMIENTOS INTRUSIVOS Y COLABORATIVOS con SITUACIÓN PERIODONTAL (requiere observación).",
	"EXPANSIÓN LATERAL: Se puede reforzar el movimiento con placas duplicadas en 0,03 y 0,04 pulgadas.",
	"MESIALIZACIONES.",
	"DISTALIZACIONES.",
	"INTRUSIONES pronunciadas (se recomienda uso de mordillos 2 veces al día, 5' cada vez).",
	"RETRUSIONES: Se recomienda Puntos de Presión vestibulo-cervical o placas duplicadas ante la resistencia al movimiento.",
	"PROTUSIONES: Se recomienda Puntos de Presión ante la resistencia al movimiento.",
	"CRITERIO DE ACCIÓN CLÍNICA: El plan se define priorizando estabilidad, funcionalidad y predictibilidad por sobre la idealidad teórica, en función de las limitaciones del caso.",
	"RESOLUCIÓN DE ESPACIO: Se opta por resolución parcial del apiñamiento para preservar salud periodontal y estabilidad.",
	"MANEJO DE BOLTON: Se preservan espacios para rehabilitación, evitando comprometer la oclusión.",
	"ENFOQUE POR ETAPAS: Se planifica dentro de límites biomecánicos predecibles, contemplando refinamientos.",
	"OCLUSIÓN: Dada las limitantes óseas estructurales, se trabaja sobre un enfoque estético, dejando la mordida lo más armónica posible.",
	"Otros",
];

const restrictionsOptions = [
	"LIMITACIONES GENERALES: El caso presenta limitaciones biomecánicas, estructurales y oclusales que condicionan el resultado.",
	"FALTA DE ESPACIO: Impide la correcta alineación dentaria y puede requerir resolución parcial.",
	"LÍNEA MEDIA: No se puede corregir completamente por asimetrías estructurales.",
	"DISCREPANCIA DE BOLTON: Impide oclusión ideal sin rehabilitación; el cierre total puede comprometer la mordida.",
	"ROTACIONES LIMITADAS: Movimientos rotacionales complejos pueden no lograrse completamente.",
	"TRASLACIONES LIMITADAS: Mesializaciones/distalizaciones mayores a 2 mm presentan baja predictibilidad.",
	"EXPANSIÓN EN PERIODONTAL: No se recomiendan expansiones significativas en pacientes con compromiso periodontal.",
	"MORDIDA CRUZADA POSTERIOR: Baja predictibilidad para descruce con alineadores.",
	"DIENTES VOLCADOS: Limitan el cierre de espacios sin generar inclinaciones no deseadas.",
	"DIENTES DECIDUOS: No se pueden mover ni garantizar estabilidad.",
	"CORONAS PROTÉSICAS: No se pueden programar movimientos.",
	"BIOTIPO ÓSEO: Puede impedir alcanzar una oclusión ideal.",
	"ASIMETRÍAS ESTRUCTURALES: Limitan resultados estéticos finales.",
	"DESGASTE DENTARIO: Puede impedir simetría estética completa.",
	"TRATAMIENTO POR ETAPAS: Puede requerir refinamientos o fases adicionales.",
	"TRATAMIENTO UNIMAXILAR: Presenta limitaciones funcionales y oclusales.",
];

const commercialPotentialOptions = [
	"Blanqueamiento",
	"Limpieza periodontal",
	"Tratamiento periodontal",
	"Caries / restauraciones",
	"Reconstrucción estética",
	"Carillas",
	"Prótesis",
	"Endodoncia",
	"Implantes",
	"Rehabilitación oral",
	"Placa de bruxismo",
	"Otros",
];

const qualityInformationOptions = [
	"MUY BUENA",
	"BUENA",
	"REGULAR",
	"INSUFICIENTE",
	"AUSENTE",
	"Otros",
];

const qualityScanOptions = [
	"MUY BUENA",
	"BUENA",
	"REGULAR",
	"ESCANEO DEFECTUOSO (costuras visibles, distorsiones, superposiciones, roturas)",
	"MORDIDA MAL TOMADA",
	"Otros",
];

const qualityXraysOptions = [
	"MUY BUENA",
	"BUENA",
	"REGULAR",
	"FALTA PANORÁMICA",
	"PANORÁMICA de BAJA CALIDAD y/o con ERRORES",
	"RX con SUPERPOSICIÓN DE OBJETOS (accesorios personales)",
	"Otros",
];

const qualityIntraoralOptions = [
	"MUY BUENA",
	"BUENA",
	"REGULAR",
	"Iluminación insuficiente",
	"Fotos poco nítidas o borrosas",
	"Falta de enfoque",
	"Fotos de encuadre",
	"Falta de fotos requeridas",
	"Otros",
];

const qualityExtraoralOptions = [
	"MUY BUENAS",
	"BUENAS",
	"REGULARES",
	"Iluminación insuficiente",
	"Fotos poco nítidas o borrosas",
	"Falta de enfoque",
	"Fotos desalineadas",
	"Falta de fotos requeridas",
	"Otros",
];

const toSelectOptions = (arr: string[]) =>
	arr.map((v) => ({ value: v, label: v }));

// ─── Schema ──────────────────────────────────────────────────────────────────

const formSchemaBase = z.object({
	upper_aligners: z
		.string()
		.min(1, "Requerido")
		.regex(/^\d+$/, "Debe ser un número entero positivo"),
	lower_aligners: z
		.string()
		.min(1, "Requerido")
		.regex(/^\d+$/, "Debe ser un número entero positivo"),
	complexity: z.string().min(1, "Selecciona la complejidad"),
	prognosis: z.string().min(1, "Selecciona el pronóstico"),
	video_url: z.string().optional(),
	technical_report_url: z.string().optional(),
	diagnosis: z.array(z.string()).min(1, "Selecciona al menos uno"),
	laboratory: z.array(z.string()).min(1, "Selecciona al menos uno"),
	planning: z.array(z.string()).min(1, "Selecciona al menos uno"),
	restrictions: z.array(z.string()),
	commercial_potential: z.array(z.string()).optional(),
	tracking_rotations: z.string().optional(),
	tracking_extrusions: z.string().optional(),
	tracking_extrusion_buttons: z.string().optional(),
	tracking_intrusions: z.string().optional(),
	tracking_torque: z.string().optional(),
	tracking_angulations: z.string().optional(),
	tracking_translations: z.string().optional(),
	tracking_expansion: z.string().optional(),
	quality_information: z.array(z.string()).min(1, "Requerido"),
	quality_scan: z.array(z.string()).min(1, "Requerido"),
	quality_xrays: z.array(z.string()).min(1, "Requerido"),
	quality_intraoral: z.array(z.string()).min(1, "Requerido"),
	quality_extraoral: z.array(z.string()).min(1, "Requerido"),
	additional_observations: z.string().optional(),
});

const formSchemaWithPatient = formSchemaBase.extend({
	paciente: z.string().min(1, "Selecciona un paciente"),
});

type FormDataBase = z.infer<typeof formSchemaBase>;
type FormDataWithPatient = z.infer<typeof formSchemaWithPatient>;
type FormData = FormDataBase | FormDataWithPatient;

type TreatmentPlanningRow = Tables<
	{ schema: "op3dcloud" },
	"treatment_planning"
>;

const defaultValuesBase: FormDataBase = {
	upper_aligners: "",
	lower_aligners: "",
	complexity: "",
	prognosis: "",
	video_url: "",
	technical_report_url: "",
	diagnosis: [],
	laboratory: [],
	planning: [],
	restrictions: [],
	commercial_potential: [],
	tracking_rotations: "",
	tracking_extrusions: "",
	tracking_extrusion_buttons: "",
	tracking_intrusions: "",
	tracking_torque: "",
	tracking_angulations: "",
	tracking_translations: "",
	tracking_expansion: "",
	quality_information: [],
	quality_scan: [],
	quality_xrays: [],
	quality_intraoral: [],
	quality_extraoral: [],
	additional_observations: "",
};

const defaultValuesWithPatient: FormDataWithPatient = {
	...defaultValuesBase,
	paciente: "",
};

// ─── Helper ──────────────────────────────────────────────────────────────────

function rowToFormData(data: TreatmentPlanningRow): FormDataBase {
	return {
		upper_aligners: data.upper_aligners?.toString() ?? "",
		lower_aligners: data.lower_aligners?.toString() ?? "",
		complexity: data.complexity ?? "",
		prognosis: data.prognosis ?? "",
		video_url: data.video_url ?? "",
		technical_report_url: data.technical_report_url ?? "",
		diagnosis: (data.diagnosis as string[]) ?? [],
		laboratory: (data.laboratory as string[]) ?? [],
		planning: (data.planning as string[]) ?? [],
		restrictions: (data.restrictions as string[]) ?? [],
		commercial_potential: (data.commercial_potential as string[]) ?? [],
		tracking_rotations: data.tracking_rotations ?? "",
		tracking_extrusions: data.tracking_extrusions ?? "",
		tracking_extrusion_buttons: data.tracking_extrusion_buttons ?? "",
		tracking_intrusions: data.tracking_intrusions ?? "",
		tracking_torque: data.tracking_torque ?? "",
		tracking_angulations: data.tracking_angulations ?? "",
		tracking_translations: data.tracking_translations ?? "",
		tracking_expansion: data.tracking_expansion ?? "",
		quality_information: (data.quality_information as string[]) ?? [],
		quality_scan: (data.quality_scan as string[]) ?? [],
		quality_xrays: (data.quality_xrays as string[]) ?? [],
		quality_intraoral: (data.quality_intraoral as string[]) ?? [],
		quality_extraoral: (data.quality_extraoral as string[]) ?? [],
		additional_observations: data.additional_observations ?? "",
	};
}

// ─── Componente ──────────────────────────────────────────────────────────────

interface TreatmentPlanningFormProps {
	patientId?: number;
	treatmentPlanningId?: number;
	onSuccess?: () => void;
}

export default function TreatmentPlanningForm({
	patientId,
	treatmentPlanningId,
	onSuccess,
}: TreatmentPlanningFormProps = {}) {
	const [isLoading, setIsLoading] = useState(false);
	const [resetKey, setResetKey] = useState(0);
	const [existingData, setExistingData] =
		useState<TreatmentPlanningRow | null>(null);
	const [videoFile, setVideoFile] = useState<File | null>(null);
	const [reportFile, setReportFile] = useState<File | null>(null);

	const needsPatientSelector = !patientId;

	const {
		patients,
		isLoading: isPatientsLoading,
		error: patientsError,
	} = usePatients({
		planningEnabledOnly: false,
		config: { isPaused: () => !needsPatientSelector },
	});

	const form = useForm<FormData>({
		resolver: zodResolver(
			needsPatientSelector ? formSchemaWithPatient : formSchemaBase,
		),
		defaultValues: needsPatientSelector
			? defaultValuesWithPatient
			: defaultValuesBase,
	});

	// Carga datos cuando se pasa patientId como prop (modo edición desde contexto de paciente)
	useEffect(() => {
		const loadExistingData = async () => {
			if (!treatmentPlanningId && !patientId) return;
			try {
				setIsLoading(true);
				let data: TreatmentPlanningRow | null = null;
				if (patientId) {
					data = await getTreatmentPlanningByPatientId(patientId);
				}
				if (data) {
					setExistingData(data);
					form.reset(rowToFormData(data));
					setResetKey((prev) => prev + 1);
				}
			} catch (error) {
				console.error("Error loading treatment planning:", error);
				toast.error("Error al cargar los datos de la planificación");
			} finally {
				setIsLoading(false);
			}
		};
		loadExistingData();
	}, [treatmentPlanningId, patientId, form]);

	// Autocompleta el formulario al seleccionar un paciente desde el selector
	const watchedPatiente = needsPatientSelector
		? (form.watch("paciente" as keyof FormData) as string)
		: undefined;

	useEffect(() => {
		if (!needsPatientSelector || !watchedPatiente) return;

		const loadPatientData = async () => {
			try {
				setIsLoading(true);
				const data = await getTreatmentPlanningByPatientId(
					Number(watchedPatiente),
				);
				if (data) {
					setExistingData(data);
					form.reset({
						...rowToFormData(data),
						paciente: watchedPatiente,
					});
				} else {
					setExistingData(null);
					form.reset({
						...defaultValuesWithPatient,
						paciente: watchedPatiente,
					});
				}
				setResetKey((prev) => prev + 1);
			} catch (error) {
				console.error("Error loading patient planning:", error);
				toast.error("Error al cargar la planificación del paciente");
			} finally {
				setIsLoading(false);
			}
		};
		loadPatientData();
	}, [watchedPatiente, needsPatientSelector, form]);

	if (patientsError && needsPatientSelector) {
		toast.error("Error al cargar los pacientes");
	}

	const resetForm = () => {
		form.reset(
			needsPatientSelector ? defaultValuesWithPatient : defaultValuesBase,
		);
		setResetKey((prev) => prev + 1);
	};

	const onSubmit = async (data: FormData) => {
		try {
			setIsLoading(true);
			let selectedPatientId = patientId;
			if (needsPatientSelector && "paciente" in data) {
				selectedPatientId = Number.parseInt(data.paciente);
			}

			const videoPath = videoFile
				? await uploadTreatmentFile(videoFile)
				: data.video_url || null;
			const reportPath = reportFile
				? await uploadTreatmentFile(reportFile)
				: data.technical_report_url || null;

			const payload = {
				patient_id: selectedPatientId ?? null,
				upper_aligners: Number.parseInt(data.upper_aligners as string),
				lower_aligners: Number.parseInt(data.lower_aligners as string),
				complexity: data.complexity,
				prognosis: data.prognosis,
				video_url: videoPath,
				technical_report_url: reportPath,
				diagnosis: data.diagnosis,
				laboratory: data.laboratory,
				planning: data.planning,
				restrictions: data.restrictions,
				commercial_potential: data.commercial_potential ?? [],
				tracking_rotations: data.tracking_rotations || null,
				tracking_extrusions: data.tracking_extrusions || null,
				tracking_extrusion_buttons:
					data.tracking_extrusion_buttons || null,
				tracking_intrusions: data.tracking_intrusions || null,
				tracking_torque: data.tracking_torque || null,
				tracking_angulations: data.tracking_angulations || null,
				tracking_translations: data.tracking_translations || null,
				tracking_expansion: data.tracking_expansion || null,
				quality_information: data.quality_information,
				quality_scan: data.quality_scan,
				quality_xrays: data.quality_xrays,
				quality_intraoral: data.quality_intraoral,
				quality_extraoral: data.quality_extraoral,
				additional_observations: data.additional_observations || null,
			};

			if (existingData?.id) {
				await updateTreatmentPlanning(existingData.id, payload);
				toast.success("Planificación actualizada correctamente");
			} else {
				await createTreatmentPlanning(payload);
				toast.success("Planificación guardada correctamente");
			}

			if (onSuccess) onSuccess();
			resetForm();
			setExistingData(null);
		} catch (error) {
			console.error("Error al enviar el formulario:", error);
			toast.error("Error al guardar. Por favor, inténtalo de nuevo.");
		} finally {
			setIsLoading(false);
		}
	};

	// Helper: badge con opción de remover
	const SelectedValues = ({
		values,
		field,
	}: {
		values: string[];
		field: keyof FormData;
	}) => (
		<div className="mt-2 flex flex-wrap gap-1">
			{values.map((value) => (
				<Badge key={value} variant="default">
					{value}
					<button
						type="button"
						className="ml-1 hover:opacity-70"
						onClick={() => {
							const current =
								(form.getValues(field) as string[]) || [];
							form.setValue(
								field,
								current.filter((v) => v !== value),
							);
						}}
					>
						×
					</button>
				</Badge>
			))}
		</div>
	);

	// Helper: sección con título y separador
	const Section = ({
		title,
		children,
	}: {
		title?: string;
		children: React.ReactNode;
	}) => (
		<div className="space-y-6">
			{title && (
				<div>
					<h2 className="text-lg font-semibold text-gray-800">
						{title}
					</h2>
					<Separator className="mt-2" />
				</div>
			)}
			{children}
		</div>
	);

	// Helper: multi-select field
	const MultiSelectField = ({
		name,
		label,
		description,
		options,
		placeholder,
	}: {
		name: keyof FormDataBase;
		label: string;
		description?: string;
		options: string[];
		placeholder: string;
	}) => {
		const watched = form.watch(name as keyof FormData) as string[];
		return (
			<FormField
				control={form.control}
				name={name as keyof FormData}
				render={() => (
					<FormItem>
						<FormLabel>{label}</FormLabel>
						<FormControl>
							<SearchableMultiSelect
								key={`${name}-${resetKey}`}
								options={toSelectOptions(options)}
								values={watched || []}
								onValuesChange={(values) =>
									form.setValue(
										name as keyof FormData,
										values,
										{
											shouldValidate: true,
											shouldDirty: true,
										},
									)
								}
								placeholder={placeholder}
								searchPlaceholder={`Buscar...`}
							/>
						</FormControl>
						{watched && watched.length > 0 && (
							<SelectedValues
								values={watched}
								field={name as keyof FormData}
							/>
						)}
						{description && (
							<FormDescription>{description}</FormDescription>
						)}
						<FormMessage />
					</FormItem>
				)}
			/>
		);
	};

	return (
		<div className="max-w-4xl mx-auto p-6">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900 mb-2">
					{existingData?.id ? "Editar" : ""} Planificación de
					Tratamiento
				</h1>
				<p className="text-gray-600">
					{existingData?.id
						? "Modifique los datos de la planificación del caso ortodóntico"
						: "Complete el formulario para la planificación del caso ortodóntico"}
				</p>
			</div>

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-10"
				>
					{/* ── Paciente ── */}
					{needsPatientSelector && (
						<Section>
							<FormField
								control={form.control}
								name="paciente"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Paciente</FormLabel>
										<FormControl>
											<SearchableSelect
												options={
													patients?.map((p) => ({
														value: String(p.id),
														label: `[#${p.id}] ${p.name} ${p.last_name} - ${p.type_of_plan}`,
													})) || []
												}
												value={field.value}
												onValueChange={field.onChange}
												placeholder={
													isPatientsLoading
														? "Cargando pacientes..."
														: "Seleccionar Paciente"
												}
												searchPlaceholder="Buscar paciente..."
												disabled={isPatientsLoading}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</Section>
					)}

					{/* ── Assets ── */}
					<Section>
						<FormField
							control={form.control}
							name="video_url"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Video</FormLabel>
									<FormControl>
										<Input
											type="file"
											accept="video/mp4"
											disabled={isLoading}
											onChange={(e) => {
												const file =
													e.target.files?.[0];
												if (file) setVideoFile(file);
											}}
										/>
									</FormControl>
									{videoFile && (
										<p className="text-xs text-muted-foreground">
											Seleccionado: {videoFile.name}
										</p>
									)}
									{field.value && !videoFile && (
										<a
											href={getTreatmentFilePublicUrl(
												field.value,
											)}
											target="_blank"
											rel="noreferrer"
											className="text-xs text-primary underline underline-offset-4"
										>
											Ver video actual
										</a>
									)}
									<FormDescription>
										Video de simulación del tratamiento
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="technical_report_url"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Informe Técnico (PDF)</FormLabel>
									<FormControl>
										<Input
											type="file"
											accept="application/pdf"
											disabled={isLoading}
											onChange={(e) => {
												const file =
													e.target.files?.[0];
												if (file) setReportFile(file);
											}}
										/>
									</FormControl>
									{reportFile && (
										<p className="text-xs text-muted-foreground">
											Seleccionado: {reportFile.name}
										</p>
									)}
									{field.value && !reportFile && (
										<a
											href={getTreatmentFilePublicUrl(
												field.value,
											)}
											target="_blank"
											rel="noreferrer"
											className="text-xs text-primary underline underline-offset-4"
										>
											Ver informe actual
										</a>
									)}
									<FormDescription>
										PDF con el informe técnico del plan 3D
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
					</Section>

					{/* ── Datos Clínicos ── */}
					<Section>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="upper_aligners"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											N Alineadores Max. Superior
										</FormLabel>
										<FormControl>
											<Input
												placeholder="Cantidad"
												type="number"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="lower_aligners"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											N Alineadores Max. Inferior
										</FormLabel>
										<FormControl>
											<Input
												placeholder="Cantidad"
												type="number"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name="complexity"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Complejidad</FormLabel>
									<FormControl>
										<RadioGroup
											onValueChange={field.onChange}
											value={field.value}
											className="flex flex-col space-y-1"
										>
											{complexityOptions.map((opt) => (
												<div
													key={opt}
													className="flex items-center space-x-3"
												>
													<RadioGroupItem
														value={opt}
														id={`complexity-${opt}`}
													/>
													<label
														htmlFor={`complexity-${opt}`}
														className="font-normal text-sm"
													>
														{opt}
													</label>
												</div>
											))}
										</RadioGroup>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="prognosis"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Pronóstico</FormLabel>
									<FormControl>
										<RadioGroup
											onValueChange={field.onChange}
											value={field.value}
											className="flex flex-col space-y-1"
										>
											{prognosisOptions.map((opt) => (
												<div
													key={opt}
													className="flex items-center space-x-3"
												>
													<RadioGroupItem
														value={opt}
														id={`prognosis-${opt}`}
													/>
													<label
														htmlFor={`prognosis-${opt}`}
														className="font-normal text-sm"
													>
														{opt}
													</label>
												</div>
											))}
										</RadioGroup>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</Section>

					{/* ── Diagnóstico ── */}
					<Section title="EVALUACIÓN CLÍNICA">
						<MultiSelectField
							name="diagnosis"
							label="Diagnóstico Presuntivo General"
							options={diagnosisOptions}
							placeholder="Seleccionar diagnóstico"
						/>
					</Section>

					{/* ── Laboratorio ── */}
					<Section title="MANUFACTURA">
						<MultiSelectField
							name="laboratory"
							label="Laboratorio"
							options={laboratoryOptions}
							placeholder="Seleccionar recomendaciones"
						/>
					</Section>

					{/* ── Planificación ── */}
					<Section title="PLAN DE ACCIÓN">
						<MultiSelectField
							name="planning"
							label="Criterio de Planificación y Accionar Clínico"
							options={planningOptions}
							placeholder="Seleccionar criterios"
						/>
					</Section>

					{/* ── Restricciones ── */}
					<Section>
						<MultiSelectField
							name="restrictions"
							label="Restricciones Biomecánicas"
							options={restrictionsOptions}
							placeholder="Seleccionar restricciones"
						/>
					</Section>

					{/* ── Tracking ── */}
					<Section title="Control de Tracking para Movimientos Complejos">
						{(
							[
								[
									"tracking_rotations",
									"Rotaciones",
									"Piezas con rotaciones que requieren control frecuente y posible uso de puntos de presión o auxiliares.",
								],
								[
									"tracking_extrusions",
									"Extrusiones (controles clínicos)",
									"Piezas con extrusiones que requieren controles frecuentes y posible uso de auxiliares.",
								],
								[
									"tracking_extrusion_buttons",
									"Extrusiones (botones programados)",
									"Piezas con botones de extrusión programados para predictibilidad del movimiento.",
								],
								[
									"tracking_intrusions",
									"Intrusiones",
									"Se recomienda uso de mordillos y control periodontal continuo.",
								],
								[
									"tracking_torque",
									"Torque / Inclinaciones",
									"Requiere evaluación clínica continua y posible refinamiento.",
								],
								[
									"tracking_angulations",
									"Angulaciones",
									"Angulaciones complejas que requieren especial control de tracking.",
								],
								[
									"tracking_translations",
									"Traslaciones",
									"Requieren control de anclaje y seguimiento de desvíos progresivos.",
								],
								[
									"tracking_expansion",
									"Expansión / Compresión",
									"Riesgo de tipping. Se recomienda control del eje dentario.",
								],
							] as [keyof FormDataBase, string, string][]
						).map(([name, label, description]) => (
							<FormField
								key={name}
								control={form.control}
								name={name as keyof FormData}
								render={({ field }) => (
									<FormItem>
										<FormLabel>{label}</FormLabel>
										<FormControl>
											<Input
												placeholder="Especificar piezas dentarias afectadas (ej: 13, 23)"
												{...field}
											/>
										</FormControl>
										<FormDescription>
											{description}
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
						))}
					</Section>

					{/* ── Observaciones ── */}
					<Section>
						<FormField
							control={form.control}
							name="additional_observations"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Observaciones Adicionales
									</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Observaciones adicionales del caso..."
											className="min-h-[120px]"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</Section>

					{/* ── Potencial Comercial ── */}
					<Section title="ANÁLISIS COMERCIAL">
						<MultiSelectField
							name="commercial_potential"
							label="Potencial Clínico-Comercial"
							options={commercialPotentialOptions}
							placeholder="Seleccionar tratamientos complementarios"
						/>
					</Section>

					{/* ── Calidad ── */}
					<Section title="ESPACIO DE MEJORA CONTINUA">
						<MultiSelectField
							name="quality_information"
							label="Calidad de la Información"
							options={qualityInformationOptions}
							placeholder="Seleccionar calidad"
						/>
						<MultiSelectField
							name="quality_scan"
							label="Calidad de Escaneo"
							options={qualityScanOptions}
							placeholder="Seleccionar calidad"
						/>
						<MultiSelectField
							name="quality_xrays"
							label="Calidad de Radiografías"
							options={qualityXraysOptions}
							placeholder="Seleccionar calidad"
						/>
						<MultiSelectField
							name="quality_intraoral"
							label="Calidad de Fotos Intraorales"
							options={qualityIntraoralOptions}
							placeholder="Seleccionar calidad"
						/>
						<MultiSelectField
							name="quality_extraoral"
							label="Calidad de Fotos Extraorales"
							options={qualityExtraoralOptions}
							placeholder="Seleccionar calidad"
						/>
					</Section>

					{/* ── Acciones ── */}
					<div className="flex gap-3 pt-4">
						<Button
							type="submit"
							disabled={isLoading}
							className="flex-1 md:flex-none"
						>
							{isLoading
								? "Guardando..."
								: existingData?.id
									? "Actualizar Planificación"
									: "Guardar Planificación"}
						</Button>
						<Button
							type="button"
							variant="outline"
							onClick={() => {
								resetForm();
								toast.info("Formulario limpiado");
							}}
							disabled={isLoading}
						>
							Limpiar
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}
