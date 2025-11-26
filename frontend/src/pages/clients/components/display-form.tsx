import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
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
import { getTreatmentPlanningByPatientId } from "@/services/supabase/treatment-planning.service";
import type { Tables } from "@/types/db/database.types";

type FormDataBase = {
	maxilares: string;
	cantidadSuperior: string;
	cantidadInferior: string;
	renderSimulacion: string;
	complejidad: string;
	pronostico: string;
	manufactura: string[];
	consideracionesDiagnosticas: string[];
	criterioAccionClinica: string[];
	derivaciones: string[];
	potencialVenta: string[];
	observacionesAdicionales: string;
};

const defaultValues: FormDataBase = {
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

type TreatmentPlanningRow = Tables<
	{ schema: "op3dcloud" },
	"treatment_planning"
>;

interface TreatmentPlanningDisplayFormProps {
	patientId: number;
}

export default function TreatmentPlanningDisplayForm({
	patientId,
}: TreatmentPlanningDisplayFormProps) {
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<FormDataBase>({
		defaultValues,
	});

	const watchedManufactura = form.watch("manufactura");
	const watchedConsideracionesDiagnosticas = form.watch(
		"consideracionesDiagnosticas",
	);
	const watchedCriterioAccionClinica = form.watch("criterioAccionClinica");
	const watchedDerivaciones = form.watch("derivaciones");
	const watchedPotencialVenta = form.watch("potencialVenta");

	// Load existing treatment planning data
	useEffect(() => {
		const loadExistingData = async () => {
			if (!patientId) return;

			try {
				setIsLoading(true);
				const data: TreatmentPlanningRow | null =
					await getTreatmentPlanningByPatientId(patientId);

				if (data) {
					const formData: FormDataBase = {
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
	}, [patientId, form]);

	const SelectedValues = ({
		values,
		colorClass,
	}: {
		values: string[];
		colorClass: string;
	}) => (
		<div className="mt-2 flex flex-wrap gap-1">
			{values.map((value) => (
				<span
					key={value}
					className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${colorClass}`}
				>
					{value}
				</span>
			))}
		</div>
	);

	if (isLoading) {
		return (
			<div className="max-w-4xl mx-auto p-6">
				<p className="text-gray-600">Cargando datos...</p>
			</div>
		);
	}

	return (
		<div className="max-w-4xl mx-auto p-6">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900 mb-2">
					Planificación de Tratamiento
				</h1>
				<p className="text-gray-600">
					Visualización de la planificación del caso ortodóntico
				</p>
			</div>

			<Form {...form}>
				<div className="space-y-8">
					<FormField
						control={form.control}
						name="maxilares"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Maxilares a Tratar</FormLabel>
								<FormControl>
									<Select value={field.value} disabled>
										<SelectTrigger>
											<SelectValue placeholder="Sin datos" />
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
									Maxilares tratados en la planificación
								</FormDescription>
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
											placeholder="Sin datos"
											type="number"
											disabled
											{...field}
										/>
									</FormControl>
									<FormDescription>
										Cantidad de alineadores para el maxilar
										superior
									</FormDescription>
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
											placeholder="Sin datos"
											type="number"
											disabled
											{...field}
										/>
									</FormControl>
									<FormDescription>
										Cantidad de alineadores para el maxilar
										inferior
									</FormDescription>
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
										placeholder="Sin datos"
										type="url"
										disabled
										{...field}
									/>
								</FormControl>
								<FormDescription>
									Enlace externo que muestra la simulación del
									caso
								</FormDescription>
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
										value={field.value}
										className="flex flex-col space-y-1"
										disabled
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
													disabled
												/>
												<label
													htmlFor={`complejidad-${option[1]}`}
													className="font-normal text-muted-foreground"
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
										value={field.value}
										className="flex flex-col space-y-1"
										disabled
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
													disabled
												/>
												<label
													htmlFor={`pronostico-${option[1]}`}
													className="font-normal text-muted-foreground"
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
								{watchedManufactura &&
								watchedManufactura.length > 0 ? (
									<SelectedValues
										values={watchedManufactura}
										colorClass="bg-blue-100 text-blue-800"
									/>
								) : (
									<p className="text-sm text-muted-foreground">
										Sin datos
									</p>
								)}
								<FormDescription>
									Instrucciones técnicas y clínicas para la
									fabricación de los alineadores
								</FormDescription>
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
								{watchedConsideracionesDiagnosticas &&
								watchedConsideracionesDiagnosticas.length >
									0 ? (
									<SelectedValues
										values={
											watchedConsideracionesDiagnosticas
										}
										colorClass="bg-green-100 text-green-800"
									/>
								) : (
									<p className="text-sm text-muted-foreground">
										Sin datos
									</p>
								)}
								<FormDescription>
									Hallazgos clínicos relevantes que pueden
									influir en el tratamiento
								</FormDescription>
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
								{watchedCriterioAccionClinica &&
								watchedCriterioAccionClinica.length > 0 ? (
									<SelectedValues
										values={watchedCriterioAccionClinica}
										colorClass="bg-purple-100 text-purple-800"
									/>
								) : (
									<p className="text-sm text-muted-foreground">
										Sin datos
									</p>
								)}
								<FormDescription>
									Movimientos y estrategias aplicadas en la
									planificación
								</FormDescription>
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="derivaciones"
						render={() => (
							<FormItem>
								<FormLabel>Derivaciones</FormLabel>
								{watchedDerivaciones &&
								watchedDerivaciones.length > 0 ? (
									<SelectedValues
										values={watchedDerivaciones}
										colorClass="bg-orange-100 text-orange-800"
									/>
								) : (
									<p className="text-sm text-muted-foreground">
										Sin datos
									</p>
								)}
								<FormDescription>
									Especialidades a las que se recomienda
									derivar al paciente
								</FormDescription>
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="potencialVenta"
						render={() => (
							<FormItem>
								<FormLabel>Potencial de Venta</FormLabel>
								{watchedPotencialVenta &&
								watchedPotencialVenta.length > 0 ? (
									<SelectedValues
										values={watchedPotencialVenta}
										colorClass="bg-pink-100 text-pink-800"
									/>
								) : (
									<p className="text-sm text-muted-foreground">
										Sin datos
									</p>
								)}
								<FormDescription>
									Tratamientos complementarios que pueden
									ofrecerse al paciente
								</FormDescription>
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
										placeholder="Sin observaciones"
										className="resize-none"
										rows={4}
										disabled
										{...field}
									/>
								</FormControl>
								<FormDescription>
									Notas complementarias del tratamiento
								</FormDescription>
							</FormItem>
						)}
					/>
				</div>
			</Form>
		</div>
	);
}
