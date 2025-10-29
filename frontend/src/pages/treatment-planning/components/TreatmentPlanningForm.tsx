import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
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
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { usePatients } from "@/hooks/swr/usePatients";
import {
	createTreatmentPlanning,
	getTreatmentPlanningByPatientId,
	updateTreatmentPlanning,
} from "@/services/supabase/treatment-planning.service";
import type { Tables } from "@/types/db/database.types";

const formSchemaBase = z.object({
	maxilares: z.string().min(1, "Debe seleccionar un maxilar"),
	cantidadSuperior: z.string().min(1, "Cantidad superior es requerida"),
	cantidadInferior: z.string().min(1, "Cantidad inferior es requerida"),
	renderSimulacion: z
		.string()
		.url("Debe ser una URL válida")
		.optional()
		.or(z.literal("")),
	complejidad: z.string().min(1, "Debe seleccionar la complejidad"),
	pronostico: z.string().min(1, "Debe seleccionar el pronóstico"),
	manufactura: z
		.array(z.string())
		.min(1, "Debe seleccionar al menos una opción"),
	consideracionesDiagnosticas: z
		.array(z.string())
		.min(1, "Debe seleccionar al menos una consideración"),
	criterioAccionClinica: z
		.array(z.string())
		.min(1, "Debe seleccionar al menos un criterio"),
	derivaciones: z.array(z.string()).optional(),
	potencialVenta: z.array(z.string()).optional(),
	observacionesAdicionales: z.string().optional(),
});

const formSchemaWithPatient = formSchemaBase.extend({
	paciente: z.string().min(1, "Debe seleccionar un paciente"),
});

type FormDataBase = z.infer<typeof formSchemaBase>;
type FormDataWithPatient = z.infer<typeof formSchemaWithPatient>;
type FormData = FormDataBase | FormDataWithPatient;

const defaultValuesBase: FormDataBase = {
	maxilares: "",
	cantidadSuperior: "",
	cantidadInferior: "",
	renderSimulacion: "",
	complejidad: "",
	pronostico: "",
	manufactura: [],
	consideracionesDiagnosticas: [],
	criterioAccionClinica: [],
	derivaciones: [],
	potencialVenta: [],
	observacionesAdicionales: "",
};

const defaultValuesWithPatient: FormDataWithPatient = {
	...defaultValuesBase,
	paciente: "",
};

type TreatmentPlanningRow = Tables<
	{ schema: "op3dcloud" },
	"treatment_planning"
>;

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

	const needsPatientSelector = !patientId;

	// Fetch patients with SWR - only when needed
	const {
		patients,
		isLoading: isPatientsLoading,
		error: patientsError,
	} = usePatients({
		planningEnabledOnly: true,
		config: {
			// Only fetch if we need the patient selector
			isPaused: () => !needsPatientSelector,
		},
	});

	const form = useForm<FormData>({
		resolver: zodResolver(
			needsPatientSelector ? formSchemaWithPatient : formSchemaBase,
		),
		defaultValues: needsPatientSelector
			? defaultValuesWithPatient
			: defaultValuesBase,
	});

	// Load existing treatment planning data if treatmentPlanningId is provided
	useEffect(() => {
		const loadExistingData = async () => {
			if (!treatmentPlanningId && !patientId) return;

			try {
				setIsLoading(true);
				let data: TreatmentPlanningRow | null = null;

				if (treatmentPlanningId) {
					// Load by ID - not implemented yet but keeping for future
					// data = await getTreatmentPlanningById(treatmentPlanningId);
				} else if (patientId) {
					data = await getTreatmentPlanningByPatientId(patientId);
				}

				if (data) {
					setExistingData(data);

					// Map database fields to form fields
					const formData: FormData = {
						maxilares: data.maxillaries || "",
						cantidadSuperior: data.upper_quantity?.toString() || "",
						cantidadInferior: data.lower_quantity?.toString() || "",
						renderSimulacion: data.simulation_render || "",
						complejidad: data.complexity || "",
						pronostico: data.prognosis || "",
						manufactura: (data.manufacturing as string[]) || [],
						consideracionesDiagnosticas:
							(data.diagnostic_considerations as string[]) || [],
						criterioAccionClinica:
							(data.clinical_action_criteria as string[]) || [],
						derivaciones: (data.referrals as string[]) || [],
						potencialVenta:
							(data.sales_potential as string[]) || [],
						observacionesAdicionales:
							data.additional_observations || "",
					};

					// Si necesita selector de paciente, agregarlo
					if (needsPatientSelector) {
						(formData as FormDataWithPatient).paciente =
							data.patient_id?.toString() || "";
					}

					form.reset(formData);
				}
			} catch (error) {
				console.error("Error loading treatment planning:", error);
				toast.error("Error al cargar los datos de la planificación");
			} finally {
				setIsLoading(false);
			}
		};

		loadExistingData();
	}, [treatmentPlanningId, patientId, needsPatientSelector, form]);

	// Show error toast if patients failed to load
	if (patientsError && needsPatientSelector) {
		toast.error("Error al cargar los pacientes");
	}

	const watchedManufactura = form.watch("manufactura");
	const watchedConsideracionesDiagnosticas = form.watch(
		"consideracionesDiagnosticas",
	);
	const watchedCriterioAccionClinica = form.watch("criterioAccionClinica");
	const watchedDerivaciones = form.watch("derivaciones");
	const watchedPotencialVenta = form.watch("potencialVenta");

	const handleMultiSelectChange = (field: keyof FormData, value: string) => {
		const currentValues = (form.getValues(field) as string[]) || [];
		const newValues = currentValues.includes(value)
			? currentValues.filter((v: string) => v !== value)
			: [...currentValues, value];
		form.setValue(field, newValues);
	};

	const resetForm = () => {
		form.reset(
			needsPatientSelector ? defaultValuesWithPatient : defaultValuesBase,
		);
		setResetKey((prev) => prev + 1);
	};

	const onSubmit = async (data: FormData) => {
		try {
			setIsLoading(true);

			// Determine patient_id from prop or form
			let selectedPatientId = patientId;
			if (needsPatientSelector && "paciente" in data) {
				selectedPatientId = Number.parseInt(data.paciente);
			}

			// Mapear los datos del formulario a la estructura de la base de datos
			const treatmentPlanningData = {
				patient_id: selectedPatientId || null,
				maxillaries: data.maxilares,
				upper_quantity: Number.parseInt(data.cantidadSuperior),
				lower_quantity: Number.parseInt(data.cantidadInferior),
				simulation_render: data.renderSimulacion || null,
				complexity: data.complejidad,
				prognosis: data.pronostico,
				manufacturing: data.manufactura,
				diagnostic_considerations: data.consideracionesDiagnosticas,
				clinical_action_criteria: data.criterioAccionClinica,
				referrals: data.derivaciones || [],
				sales_potential: data.potencialVenta || [],
				additional_observations: data.observacionesAdicionales || null,
			};

			console.log(
				"Datos del formulario de planificación:",
				treatmentPlanningData,
			);

			// Check if we are updating or creating
			if (existingData?.id) {
				// Update existing
				const result = await updateTreatmentPlanning(
					existingData.id,
					treatmentPlanningData,
				);
				console.log(
					"Planificación de tratamiento actualizada:",
					result,
				);
				toast.success("Planificación actualizada correctamente");
			} else {
				// Create new
				const result = await createTreatmentPlanning(
					treatmentPlanningData,
				);
				console.log("Planificación de tratamiento guardada:", result);
				toast.success("Formulario enviado correctamente");
			}

			// Call onSuccess callback if provided
			if (onSuccess) {
				onSuccess();
			}

			// Only reset form if creating new (not editing)
			if (!existingData?.id) {
				resetForm();
			}
		} catch (error) {
			console.error("Error al enviar el formulario:", error);
			toast.error(
				"Error al enviar el formulario. Por favor, inténtalo de nuevo.",
			);
		} finally {
			setIsLoading(false);
		}
	};

	const handleReset = () => {
		resetForm();
		toast.info("Formulario limpiado");
	};

	const SelectedValues = ({
		values,
		field,
		colorClass,
	}: {
		values: string[];
		field: keyof FormData;
		colorClass: string;
	}) => (
		<div className="mt-2 flex flex-wrap gap-1">
			{values.map((value) => (
				<span
					key={value}
					className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${colorClass}`}
				>
					{value}
					<button
						type="button"
						className="ml-1 hover:opacity-70"
						onClick={() => handleMultiSelectChange(field, value)}
					>
						×
					</button>
				</span>
			))}
		</div>
	);

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
					className="space-y-8"
				>
					{/* Patient Selector - Only show if no patientId prop */}
					{needsPatientSelector && (
						<FormField
							control={form.control}
							name="paciente"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Paciente</FormLabel>
									<Select
										onValueChange={field.onChange}
										value={field.value}
										disabled={isPatientsLoading}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue
													placeholder={
														isPatientsLoading
															? "Cargando pacientes..."
															: "Seleccionar Paciente"
													}
												/>
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{patients && patients.length > 0 ? (
												patients.map((patient) => (
													<SelectItem
														key={patient.id}
														value={String(
															patient.id,
														)}
													>
														{patient.name}{" "}
														{patient.last_name} -{" "}
														{patient.type_of_plan}
													</SelectItem>
												))
											) : (
												<div className="p-2 text-sm text-muted-foreground text-center">
													No hay pacientes con
													planificación habilitada
												</div>
											)}
										</SelectContent>
									</Select>
									<FormDescription>
										Selecciona el paciente para el cual se
										creará la planificación de tratamiento
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
					)}

					<FormField
						control={form.control}
						name="maxilares"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Maxilares a Tratar</FormLabel>
								<FormControl>
									<Select
										onValueChange={field.onChange}
										value={field.value}
									>
										<SelectTrigger>
											<SelectValue placeholder="Seleccionar Maxilar" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="ambos">
												Ambos
											</SelectItem>
											<SelectItem value="superior">
												Superior
											</SelectItem>
											<SelectItem value="inferior">
												Inferior
											</SelectItem>
										</SelectContent>
									</Select>
								</FormControl>
								<FormDescription>
									Indica qué maxilares serán tratados en la
									planificación
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<FormField
							control={form.control}
							name="cantidadSuperior"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Cantidad en Superior</FormLabel>
									<FormControl>
										<Input
											placeholder="Cantidad"
											type="number"
											min="1"
											{...field}
										/>
									</FormControl>
									<FormDescription>
										Cantidad de alineadores para el maxilar
										superior
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="cantidadInferior"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Cantidad en Inferior</FormLabel>
									<FormControl>
										<Input
											placeholder="Cantidad"
											type="number"
											min="1"
											{...field}
										/>
									</FormControl>
									<FormDescription>
										Cantidad de alineadores para el maxilar
										inferior
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<FormField
						control={form.control}
						name="renderSimulacion"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Render Simulación</FormLabel>
								<FormControl>
									<Input
										placeholder="https://ejemplo.com/simulacion"
										type="url"
										{...field}
									/>
								</FormControl>
								<FormDescription>
									Enlace externo (ej: video de Youtube) que
									muestre la simulación del caso
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="complejidad"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Complejidad</FormLabel>
								<FormControl>
									<RadioGroup
										onValueChange={field.onChange}
										value={field.value}
										className="flex flex-col space-y-1"
									>
										{[
											["Baja", "baja"],
											["Moderada", "moderada"],
											["Alta", "alta"],
										].map((option) => (
											<div
												className="flex items-center space-x-3 space-y-0"
												key={option[1]}
											>
												<RadioGroupItem
													value={option[1]}
													id={`complejidad-${option[1]}`}
												/>
												<label
													htmlFor={`complejidad-${option[1]}`}
													className="font-normal"
												>
													{option[0]}
												</label>
											</div>
										))}
									</RadioGroup>
								</FormControl>
								<FormDescription>
									Nivel de dificultad del caso
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="pronostico"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Pronóstico</FormLabel>
								<FormControl>
									<RadioGroup
										onValueChange={field.onChange}
										value={field.value}
										className="flex flex-col space-y-1"
									>
										{[
											["Favorable", "favorable"],
											["Reservado", "reservado"],
										].map((option) => (
											<div
												className="flex items-center space-x-3 space-y-0"
												key={option[1]}
											>
												<RadioGroupItem
													value={option[1]}
													id={`pronostico-${option[1]}`}
												/>
												<label
													htmlFor={`pronostico-${option[1]}`}
													className="font-normal"
												>
													{option[0]}
												</label>
											</div>
										))}
									</RadioGroup>
								</FormControl>
								<FormDescription>
									Evaluación general de la previsibilidad del
									tratamiento
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="manufactura"
						render={() => (
							<FormItem>
								<FormLabel>
									Manufactura - Recomendaciones y
									Requerimientos
								</FormLabel>
								<FormControl>
									<Select
										key={`manufactura-${resetKey}`}
										onValueChange={(value) =>
											handleMultiSelectChange(
												"manufactura",
												value,
											)
										}
									>
										<SelectTrigger className="w-full max-w-xs">
											<SelectValue placeholder="Seleccionar recomendaciones" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="calidad-alta">
												Calidad Alta
											</SelectItem>
											<SelectItem value="material-premium">
												Material Premium
											</SelectItem>
											<SelectItem value="acabado-especial">
												Acabado Especial
											</SelectItem>
											<SelectItem value="control-calidad">
												Control de Calidad
											</SelectItem>
										</SelectContent>
									</Select>
								</FormControl>
								{watchedManufactura &&
									watchedManufactura.length > 0 && (
										<SelectedValues
											values={watchedManufactura}
											field="manufactura"
											colorClass="bg-blue-100 text-blue-800"
										/>
									)}
								<FormDescription>
									Selección de instrucciones técnicas y
									clínicas predefinidas para la fabricación de
									los alineadores
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="consideracionesDiagnosticas"
						render={() => (
							<FormItem>
								<FormLabel>
									Consideraciones Diagnósticas
								</FormLabel>
								<FormControl>
									<Select
										key={`consideracionesDiagnosticas-${resetKey}`}
										onValueChange={(value) =>
											handleMultiSelectChange(
												"consideracionesDiagnosticas",
												value,
											)
										}
									>
										<SelectTrigger className="w-full max-w-xs">
											<SelectValue placeholder="Seleccionar consideraciones" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="apiñamiento">
												Apiñamiento
											</SelectItem>
											<SelectItem value="mordida-abierta">
												Mordida Abierta
											</SelectItem>
											<SelectItem value="mordida-cruzada">
												Mordida Cruzada
											</SelectItem>
											<SelectItem value="sobre-mordida">
												Sobre Mordida
											</SelectItem>
											<SelectItem value="dientes-incluidos">
												Dientes Incluidos
											</SelectItem>
										</SelectContent>
									</Select>
								</FormControl>
								{watchedConsideracionesDiagnosticas &&
									watchedConsideracionesDiagnosticas.length >
										0 && (
										<SelectedValues
											values={
												watchedConsideracionesDiagnosticas
											}
											field="consideracionesDiagnosticas"
											colorClass="bg-green-100 text-green-800"
										/>
									)}
								<FormDescription>
									Selección de hallazgos clínicos relevantes
									que pueden influir en el tratamiento
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="criterioAccionClinica"
						render={() => (
							<FormItem>
								<FormLabel>
									Criterio de Acción Clínica
								</FormLabel>
								<FormControl>
									<Select
										key={`criterioAccionClinica-${resetKey}`}
										onValueChange={(value) =>
											handleMultiSelectChange(
												"criterioAccionClinica",
												value,
											)
										}
									>
										<SelectTrigger className="w-full max-w-xs">
											<SelectValue placeholder="Seleccionar criterios" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="expansión-palatal">
												Expansión Palatal
											</SelectItem>
											<SelectItem value="intrusión">
												Intrusión
											</SelectItem>
											<SelectItem value="extrusión">
												Extrusión
											</SelectItem>
											<SelectItem value="rotación">
												Rotación
											</SelectItem>
											<SelectItem value="mesialización">
												Mesialización
											</SelectItem>
											<SelectItem value="distalización">
												Distalización
											</SelectItem>
										</SelectContent>
									</Select>
								</FormControl>
								{watchedCriterioAccionClinica &&
									watchedCriterioAccionClinica.length > 0 && (
										<SelectedValues
											values={
												watchedCriterioAccionClinica
											}
											field="criterioAccionClinica"
											colorClass="bg-purple-100 text-purple-800"
										/>
									)}
								<FormDescription>
									Selección de movimientos y estrategias que
									se aplicarán en la planificación
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="derivaciones"
						render={() => (
							<FormItem>
								<FormLabel>Derivaciones</FormLabel>
								<FormControl>
									<Select
										key={`derivaciones-${resetKey}`}
										onValueChange={(value) =>
											handleMultiSelectChange(
												"derivaciones",
												value,
											)
										}
									>
										<SelectTrigger className="w-full max-w-xs">
											<SelectValue placeholder="Seleccionar especialidades" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="cirugia-ortognatica">
												Cirugía Ortognática
											</SelectItem>
											<SelectItem value="periodoncia">
												Periodoncia
											</SelectItem>
											<SelectItem value="endodoncia">
												Endodoncia
											</SelectItem>
											<SelectItem value="implantologia">
												Implantología
											</SelectItem>
											<SelectItem value="odontopediatria">
												Odontopediatría
											</SelectItem>
										</SelectContent>
									</Select>
								</FormControl>
								{watchedDerivaciones &&
									watchedDerivaciones.length > 0 && (
										<SelectedValues
											values={watchedDerivaciones}
											field="derivaciones"
											colorClass="bg-orange-100 text-orange-800"
										/>
									)}
								<FormDescription>
									Especialidades a las que se recomienda
									derivar al paciente
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="potencialVenta"
						render={() => (
							<FormItem>
								<FormLabel>Potencial de Venta</FormLabel>
								<FormControl>
									<Select
										key={`potencialVenta-${resetKey}`}
										onValueChange={(value) =>
											handleMultiSelectChange(
												"potencialVenta",
												value,
											)
										}
									>
										<SelectTrigger className="w-full max-w-xs">
											<SelectValue placeholder="Seleccionar tratamientos" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="blanqueamiento">
												Blanqueamiento
											</SelectItem>
											<SelectItem value="carillas">
												Carillas
											</SelectItem>
											<SelectItem value="ortodoncia-adultos">
												Ortodoncia para Adultos
											</SelectItem>
											<SelectItem value="retenedores">
												Retenedores
											</SelectItem>
											<SelectItem value="seguimiento">
												Seguimiento Prolongado
											</SelectItem>
										</SelectContent>
									</Select>
								</FormControl>
								{watchedPotencialVenta &&
									watchedPotencialVenta.length > 0 && (
										<SelectedValues
											values={watchedPotencialVenta}
											field="potencialVenta"
											colorClass="bg-pink-100 text-pink-800"
										/>
									)}
								<FormDescription>
									Tratamientos complementarios que pueden
									ofrecerse al paciente
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="observacionesAdicionales"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Observaciones Adicionales</FormLabel>
								<FormControl>
									<Textarea
										placeholder="Escriba observaciones adicionales..."
										className="resize-none"
										rows={4}
										{...field}
									/>
								</FormControl>
								<FormDescription>
									Notas complementarias no contempladas en las
									secciones anteriores
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="flex justify-end space-x-4">
						<Button
							type="button"
							variant="outline"
							onClick={handleReset}
							disabled={isLoading}
						>
							Limpiar Formulario
						</Button>
						<Button type="submit" disabled={isLoading}>
							{isLoading
								? existingData?.id
									? "Actualizando..."
									: "Enviando..."
								: existingData?.id
									? "Actualizar Planificación"
									: "Enviar Planificación"}
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}
