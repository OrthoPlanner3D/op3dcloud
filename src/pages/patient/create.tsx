import { ArrowLeftIcon } from "lucide-react";
import { useState } from "react";
import { type FieldValues, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import BrandLogo from "@/components/ui/brandLogo";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FileUpload } from "@/components/ui/file-upload";
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
import {
	SearchableMultiSelect,
	type SearchableSelectOption,
} from "@/components/ui/searchable-select";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Stepper,
	StepperIndicator,
	StepperItem,
	StepperSeparator,
	StepperTrigger,
} from "@/components/ui/stepper";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/config/supabase.config";
import { getPlanners } from "@/services/supabase/planners.service";
import { uploadFiles } from "@/services/supabase/storage.service";
import { useUserStore } from "@/state/stores/useUserStore";
import type { PatientsInsert } from "@/types/db/patients/patients";

type PatientFormValues = Omit<
	PatientsInsert,
	"photos" | "xrays" | "scans" | "supplementary_docs" | "files"
> & {
	photos: File[];
	xrays: File[];
	scans: File[];
	supplementary_docs: File[];
	files: File[];
};

const TREATMENT_OBJECTIVE_OPTIONS: SearchableSelectOption[] = [
	{ value: "Alinear y nivelar", label: "Alinear y nivelar" },
	{ value: "Centrar línea media", label: "Centrar línea media" },
	{ value: "Expandir maxilares", label: "Expandir maxilares" },
	{
		value: "Mejorar mordida abierta",
		label: "Mejorar mordida abierta",
	},
	{
		value: "Mejorar mordida profunda",
		label: "Mejorar mordida profunda",
	},
	{
		value: "Descruzar mordida anterior",
		label: "Descruzar mordida anterior",
	},
	{
		value: "Descruzar mordida lateral",
		label: "Descruzar mordida lateral",
	},
	{
		value: "Descruzar mordida posterior (predictibilidad baja – posible necesidad de aditamentos)",
		label: "Descruzar mordida posterior (predictibilidad baja – posible necesidad de aditamentos)",
	},
	{
		value: "Desrotar caninos en giroversión (predictibilidad baja – posible necesidad de aditamentos)",
		label: "Desrotar caninos en giroversión (predictibilidad baja – posible necesidad de aditamentos)",
	},
	{
		value: "Desrotar premolares en giroversión (predictibilidad baja – posible necesidad de aditamentos)",
		label: "Desrotar premolares en giroversión (predictibilidad baja – posible necesidad de aditamentos)",
	},
	{
		value: "Distalizar (hasta 2 mm en etapa inicial – considerar 3ros molares y hueso limitante)",
		label: "Distalizar (hasta 2 mm en etapa inicial – considerar 3ros molares y hueso limitante)",
	},
	{ value: "Mejorar mordida", label: "Mejorar mordida" },
	{ value: "Lograr clase I canina", label: "Lograr clase I canina" },
	{
		value: "Protruir sector anterior",
		label: "Protruir sector anterior",
	},
	{
		value: "Retruir sector anterior",
		label: "Retruir sector anterior",
	},
	{ value: "Cerrar diastemas", label: "Cerrar diastemas" },
	{
		value: "Cerrar espacios (hasta 2 mm – considerar dientes volcados)",
		label: "Cerrar espacios (hasta 2 mm – considerar dientes volcados)",
	},
	{
		value: "Mantener espacios para implantes",
		label: "Mantener espacios para implantes",
	},
	{
		value: "Agrandar espacios para implantes",
		label: "Agrandar espacios para implantes",
	},
	{
		value: "Dejar espacio proximal en laterales por Bolton alterado (para restauración futura)",
		label: "Dejar espacio proximal en laterales por Bolton alterado (para restauración futura)",
	},
	{
		value: "A criterio de OP3D™",
		label: "A criterio de OP3D™",
	},
];

const DENTAL_RESTRICTIONS_OPTIONS: SearchableSelectOption[] = [
	{
		value: "Coronas o carillas protésicas",
		label: "Coronas o carillas protésicas",
	},
	{ value: "Caninos sin espacio", label: "Caninos sin espacio" },
	{
		value: "Giroversiones pronunciadas",
		label: "Giroversiones pronunciadas",
	},
	{
		value: "Volcamiento dentario post-extracción",
		label: "Volcamiento dentario post-extracción",
	},
	{
		value: "No cerrar el diastema central",
		label: "No cerrar el diastema central",
	},
	{
		value: "A criterio de OP3D™",
		label: "A criterio de OP3D™",
	},
	{ value: "No aplica", label: "No aplica" },
];

const DECLARED_LIMITATIONS_OPTIONS: SearchableSelectOption[] = [
	{
		value: "Movimiento de línea media no posible",
		label: "Movimiento de línea media no posible",
	},
	{
		value: "Expansión de molares limitada por retracciones gingivales",
		label: "Expansión de molares limitada por retracciones gingivales",
	},
	{
		value: "Expansión de molares limitada por falta de desarrollo transversal",
		label: "Expansión de molares limitada por falta de desarrollo transversal",
	},
	{
		value: "Mordida abierta no cerrable completamente (limitación esquelética)",
		label: "Mordida abierta no cerrable completamente (limitación esquelética)",
	},
	{
		value: "No se logra mordida ideal (se buscará mordida armónica)",
		label: "No se logra mordida ideal (se buscará mordida armónica)",
	},
	{
		value: "Descruzamiento limitado por factores esqueléticos",
		label: "Descruzamiento limitado por factores esqueléticos",
	},
	{
		value: "Caninos no ubicables por distancia de movimiento",
		label: "Caninos no ubicables por distancia de movimiento",
	},
	{
		value: "Caninos no ubicables por atresia maxilar",
		label: "Caninos no ubicables por atresia maxilar",
	},
	{
		value: "Giroversiones no desrrotables totalmente",
		label: "Giroversiones no desrrotables totalmente",
	},
	{
		value: "Clase I canina no lograble (discrepancia de Bolton)",
		label: "Clase I canina no lograble (discrepancia de Bolton)",
	},
	{
		value: "Espacios desdentados mayores a 2 mm no cerrables",
		label: "Espacios desdentados mayores a 2 mm no cerrables",
	},
	{
		value: "Dientes volcados no enderezables",
		label: "Dientes volcados no enderezables",
	},
	{
		value: "Coronas/carillas no movilizables",
		label: "Coronas/carillas no movilizables",
	},
	{
		value: "A criterio de OP3D™",
		label: "A criterio de OP3D™",
	},
	{ value: "No aplica", label: "No aplica" },
];

const SUGGESTED_ADMINATIONS_OPTIONS: SearchableSelectOption[] = [
	{ value: "Sobrecorrección", label: "Sobrecorrección" },
	{
		value: "Superficies de presión negativa",
		label: "Superficies de presión negativa",
	},
	{ value: "Gomas de clase", label: "Gomas de clase" },
	{ value: "Gomas de extrusión", label: "Gomas de extrusión" },
	{ value: "Gomas de rotación", label: "Gomas de rotación" },
	{
		value: "Gomas cruzadas (criss cross)",
		label: "Gomas cruzadas (criss cross)",
	},
	{ value: "Microimplantes", label: "Microimplantes" },
	{
		value: "A criterio de OP3D™",
		label: "A criterio de OP3D™",
	},
	{ value: "No aplica", label: "No aplica" },
];

const steps = [1, 2, 3, 4, 5];

export default function CreatePatient() {
	const [currentStep, setCurrentStep] = useState(1);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const navigate = useNavigate();
	const user = useUserStore((state) => state.user);
	const form = useForm<PatientFormValues>({
		defaultValues: {
			name: "",
			last_name: "",
			type_of_plan: "",
			treatment_approach: "",
			treatment_objective: [],
			dental_restrictions: [],
			declared_limitations: [],
			suggested_adminations_and_actions: [],
			observations_or_instructions: "",
			files: [],
			sworn_declaration: false,
			planning_enabled: false,
			photos: [],
			xrays: [],
			scans: [],
			supplementary_docs: [],
		},
	});

	async function validateStep1() {
		const isValid = await form.trigger([
			"name",
			"last_name",
			"type_of_plan",
			"treatment_approach",
		]);
		if (isValid) {
			setCurrentStep((prev) => prev + 1);
		}
	}

	async function validateStep2() {
		const isValid = await form.trigger(["treatment_objective"]);
		if (isValid) {
			setCurrentStep((prev) => prev + 1);
		}
	}

	async function validateStep3() {
		const isValid = await form.trigger([
			"dental_restrictions",
			"declared_limitations",
		]);
		if (isValid) {
			setCurrentStep((prev) => prev + 1);
		}
	}

	async function validateStep4() {
		const isValid = await form.trigger([
			"suggested_adminations_and_actions",
			"observations_or_instructions",
		]);
		if (isValid) {
			setCurrentStep((prev) => prev + 1);
		}
	}

	async function validateStep5() {
		const isValid = await form.trigger([
			"photos",
			"xrays",
			"scans",
			"files",
			"sworn_declaration",
		]);
		if (isValid) {
			form.handleSubmit(onSubmit)();
		}
	}

	async function createPatient(patient: PatientsInsert) {
		const { data, error } = await supabase
			.from("patients")
			.insert(patient)
			.select();

		if (error) {
			console.error("Error al crear el paciente", error.message);
			throw error;
		}

		console.log("Paciente creado:", data);
		return data;
	}

	// TODO: Mover esta lógica a un trigger en la DB para asignar planner automáticamente al insertar un paciente
	async function getRandomPlannerId(): Promise<string | null> {
		const planners = await getPlanners();
		if (!planners || planners.length === 0) return null;
		const randomIndex = Math.floor(Math.random() * planners.length);
		return planners[randomIndex].id;
	}

	async function onSubmit(values: PatientFormValues) {
		try {
			if (!user?.id) {
				throw new Error("Usuario no autenticado");
			}

			setIsSubmitting(true);

			const {
				photos,
				xrays,
				scans,
				supplementary_docs,
				files,
				...restValues
			} = values;

			const [photoPaths, xrayPaths, scanPaths, docPaths, filePaths] =
				await Promise.all([
					uploadFiles(photos),
					uploadFiles(xrays),
					uploadFiles(scans),
					uploadFiles(supplementary_docs),
					uploadFiles(files),
				]);

			const plannerId = await getRandomPlannerId();

			await createPatient({
				...restValues,
				id_client: user.id,
				id_planner: plannerId,
				photos: photoPaths,
				xrays: xrayPaths,
				scans: scanPaths,
				supplementary_docs: docPaths,
				files: filePaths,
			});

			navigate("/", {
				state: {
					message: "Paciente registrado exitosamente",
				},
			});
		} catch (error) {
			console.error("Form submission error", error);
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<div className="relative min-h-[calc(100vh-32px)]">
			<div>
				<Button variant="ghost" asChild>
					<Link to="/pacientes">
						<ArrowLeftIcon />
					</Link>
				</Button>
			</div>

			<div className="flex items-center justify-center">
				<div className="max-w-xl w-full mx-auto grid grid-rows-12 min-h-[calc(100vh-4.25rem)] px-4">
					<div className="row-span-2 flex flex-col items-center justify-center gap-4">
						<BrandLogo className="size-20" />
						<div className="text-center">
							<p className="text-sm font-light text-muted-foreground tracking-wide">
								Registro de Paciente
							</p>
						</div>
					</div>

					<Stepper
						value={currentStep}
						onValueChange={setCurrentStep}
						className="row-span-1"
					>
						{steps.map((step) => (
							<StepperItem
								key={step}
								step={step}
								className="not-last:flex-1"
							>
								<StepperTrigger asChild>
									<StepperIndicator />
								</StepperTrigger>
								{step < steps.length && <StepperSeparator />}
							</StepperItem>
						))}
					</Stepper>

					<div className="row-span-8 flex items-center justify-center">
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-8 max-w-3xl mx-auto w-full self-baseline"
							>
								{currentStep === 1 && <Step1 form={form} />}
								{currentStep === 2 && <Step2 form={form} />}
								{currentStep === 3 && <Step3 form={form} />}
								{currentStep === 4 && <Step4 form={form} />}
								{currentStep === 5 && <Step5 form={form} />}
							</form>
						</Form>
					</div>

					<div className="flex justify-center space-x-4 row-span-1 items-center">
						<Button
							variant="outline"
							className="w-32"
							onClick={() => setCurrentStep((prev) => prev - 1)}
							disabled={currentStep === 1}
						>
							Anterior
						</Button>
						{currentStep === 1 && (
							<Button
								variant="outline"
								className="w-32"
								onClick={validateStep1}
							>
								Siguiente
							</Button>
						)}
						{currentStep === 2 && (
							<Button
								variant="outline"
								className="w-32"
								onClick={validateStep2}
							>
								Siguiente
							</Button>
						)}
						{currentStep === 3 && (
							<Button
								variant="outline"
								className="w-32"
								onClick={validateStep3}
							>
								Siguiente
							</Button>
						)}
						{currentStep === 4 && (
							<Button
								variant="outline"
								className="w-32"
								onClick={validateStep4}
							>
								Siguiente
							</Button>
						)}
						{currentStep === 5 && (
							<Button
								variant="default"
								className="w-32"
								onClick={validateStep5}
								disabled={isSubmitting}
							>
								{isSubmitting ? "Subiendo..." : "Registrar"}
							</Button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

function Step1({ form }: { form: FieldValues }) {
	return (
		<>
			<p className="text-center text-xs text-muted-foreground italic">
				Datos iniciales del caso
			</p>
			<div className="grid grid-cols-12 gap-y-8 sm:gap-y-0 sm:gap-x-4">
				<div className="col-span-12 sm:col-span-6">
					<FormField
						control={form.control}
						name="name"
						rules={{ required: "El nombre es requerido" }}
						render={({ field }) => (
							<FormItem className="animate-in fade-in duration-1000">
								<FormLabel>Nombre</FormLabel>
								<FormControl>
									<Input type="text" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div className="col-span-12 sm:col-span-6">
					<FormField
						control={form.control}
						name="last_name"
						rules={{ required: "El apellido es requerido" }}
						render={({ field }) => (
							<FormItem className="animate-in fade-in duration-1000">
								<FormLabel>Apellido</FormLabel>
								<FormControl>
									<Input type="text" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
			</div>

			<FormField
				control={form.control}
				name="type_of_plan"
				rules={{ required: "El tipo de plan es requerido" }}
				render={({ field }) => (
					<FormItem className="animate-in fade-in duration-1000">
						<FormLabel>Tipo de Plan</FormLabel>
						<Select
							onValueChange={field.onChange}
							defaultValue={field.value}
						>
							<FormControl>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Seleccionar" />
								</SelectTrigger>
							</FormControl>
							<SelectContent>
								<SelectItem value="Caso inicial">
									Caso inicial
								</SelectItem>
								<SelectItem value="Refinamiento">
									Refinamiento
								</SelectItem>
								<SelectItem value="Retenedores">
									Retenedores
								</SelectItem>
							</SelectContent>
						</Select>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="treatment_approach"
				rules={{ required: "El enfoque de tratamiento es requerido" }}
				render={({ field }) => (
					<FormItem className="animate-in fade-in duration-1000">
						<FormLabel>Enfoque de Tratamiento</FormLabel>
						<Select
							onValueChange={field.onChange}
							defaultValue={field.value}
						>
							<FormControl>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Seleccionar" />
								</SelectTrigger>
							</FormControl>
							<SelectContent>
								<SelectItem value="Estético">
									Estético
								</SelectItem>
								<SelectItem value="Estético y funcional">
									Estético y funcional
								</SelectItem>
								<SelectItem value="A criterio de OP3D™">
									A criterio de OP3D™
								</SelectItem>
							</SelectContent>
						</Select>
						<FormMessage />
					</FormItem>
				)}
			/>
		</>
	);
}

function Step2({ form }: { form: FieldValues }) {
	const [showOtherInput, setShowOtherInput] = useState(false);
	const [otherText, setOtherText] = useState("");

	return (
		<>
			<p className="text-center text-xs text-muted-foreground italic">
				Objetivos del tratamiento
			</p>
			<FormField
				control={form.control}
				name="treatment_objective"
				rules={{
					validate: (value: string[]) =>
						value.length > 0 ||
						"El objetivo del tratamiento es requerido",
				}}
				render={({ field }) => (
					<FormItem className="animate-in fade-in duration-1000">
						<FormLabel>Objetivo del Tratamiento</FormLabel>
						<SearchableMultiSelect
							options={TREATMENT_OBJECTIVE_OPTIONS}
							values={field.value}
							onValuesChange={field.onChange}
							placeholder="Seleccionar objetivos"
						/>
						{!showOtherInput ? (
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() => setShowOtherInput(true)}
							>
								Agregar otro
							</Button>
						) : (
							<div className="space-y-2">
								<Textarea
									className="min-h-[80px]"
									value={otherText}
									onChange={(e) =>
										setOtherText(e.target.value)
									}
									placeholder="Escriba el objetivo personalizado"
								/>
								<div className="flex gap-2">
									<Button
										type="button"
										variant="default"
										size="sm"
										onClick={() => {
											if (otherText.trim()) {
												field.onChange([
													...field.value,
													otherText.trim(),
												]);
												setOtherText("");
												setShowOtherInput(false);
											}
										}}
									>
										Confirmar
									</Button>
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() => {
											setOtherText("");
											setShowOtherInput(false);
										}}
									>
										Cancelar
									</Button>
								</div>
							</div>
						)}
						<FormDescription>
							Seleccione los objetivos del tratamiento para este
							paciente.
						</FormDescription>
						<FormMessage />
					</FormItem>
				)}
			/>
		</>
	);
}

function MultiSelectWithOther({
	field,
	options,
	label,
	description,
}: {
	field: FieldValues;
	options: SearchableSelectOption[];
	label: string;
	description: string;
}) {
	const [showOtherInput, setShowOtherInput] = useState(false);
	const [otherText, setOtherText] = useState("");

	return (
		<FormItem className="animate-in fade-in duration-1000">
			<FormLabel>{label}</FormLabel>
			<SearchableMultiSelect
				options={options}
				values={field.value}
				onValuesChange={field.onChange}
				placeholder="Seleccionar"
			/>
			{!showOtherInput ? (
				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={() => setShowOtherInput(true)}
				>
					Agregar otro
				</Button>
			) : (
				<div className="space-y-2">
					<Textarea
						className="min-h-[80px]"
						value={otherText}
						onChange={(e) => setOtherText(e.target.value)}
						placeholder="Escriba la opción personalizada"
					/>
					<div className="flex gap-2">
						<Button
							type="button"
							variant="default"
							size="sm"
							onClick={() => {
								if (otherText.trim()) {
									field.onChange([
										...field.value,
										otherText.trim(),
									]);
									setOtherText("");
									setShowOtherInput(false);
								}
							}}
						>
							Confirmar
						</Button>
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() => {
								setOtherText("");
								setShowOtherInput(false);
							}}
						>
							Cancelar
						</Button>
					</div>
				</div>
			)}
			<FormDescription>{description}</FormDescription>
			<FormMessage />
		</FormItem>
	);
}

function Step3({ form }: { form: FieldValues }) {
	return (
		<>
			<p className="text-center text-xs text-muted-foreground italic">
				Restricciones y limitaciones
			</p>
			<FormField
				control={form.control}
				name="dental_restrictions"
				rules={{
					validate: (value: string[]) =>
						value.length > 0 ||
						"Las restricciones dentales son requeridas",
				}}
				render={({ field }) => (
					<MultiSelectWithOther
						field={field}
						options={DENTAL_RESTRICTIONS_OPTIONS}
						label="Restricciones Dentales"
						description="Seleccione las restricciones dentales que puedan afectar el tratamiento."
					/>
				)}
			/>

			<FormField
				control={form.control}
				name="declared_limitations"
				rules={{
					validate: (value: string[]) =>
						value.length > 0 ||
						"Las limitaciones declaradas son requeridas",
				}}
				render={({ field }) => (
					<MultiSelectWithOther
						field={field}
						options={DECLARED_LIMITATIONS_OPTIONS}
						label="Limitaciones Declaradas"
						description="Seleccione las limitaciones que el paciente ha declarado o que han sido identificadas."
					/>
				)}
			/>
		</>
	);
}

function Step4({ form }: { form: FieldValues }) {
	return (
		<>
			<p className="text-center text-xs text-muted-foreground italic">
				Aditamentos e instrucciones adicionales
			</p>
			<FormField
				control={form.control}
				name="suggested_adminations_and_actions"
				rules={{
					validate: (value: string[]) =>
						value.length > 0 ||
						"Las recomendaciones son requeridas",
				}}
				render={({ field }) => (
					<MultiSelectWithOther
						field={field}
						options={SUGGESTED_ADMINATIONS_OPTIONS}
						label="Recomendaciones y Acciones Sugeridas"
						description="Seleccione las recomendaciones y acciones que se sugieren para el tratamiento."
					/>
				)}
			/>

			<FormField
				control={form.control}
				name="observations_or_instructions"
				rules={{ required: "Las observaciones son requeridas" }}
				render={({ field }) => (
					<FormItem className="animate-in fade-in duration-1000">
						<FormLabel>Observaciones o Instrucciones</FormLabel>
						<FormControl>
							<Textarea className="min-h-[120px]" {...field} />
						</FormControl>
						<FormDescription>
							Agregue cualquier observación o instrucción
							adicional relevante para el caso.
						</FormDescription>
						<FormMessage />
					</FormItem>
				)}
			/>
		</>
	);
}

function Step5({ form }: { form: FieldValues }) {
	const acceptedTypes = ".png,.jpg,.jpeg,.pdf,.stl,.dcm";

	return (
		<>
			<p className="text-center text-xs text-muted-foreground italic">
				Documentación y declaración jurada.
			</p>

			<FormField
				control={form.control}
				name="photos"
				rules={{
					validate: (value: File[]) =>
						value.length > 0 || "Las fotos son requeridas",
				}}
				render={({ field }) => (
					<FormItem className="animate-in fade-in duration-1000">
						<FormLabel>Fotos</FormLabel>
						<FormControl>
							<FileUpload
								files={field.value}
								onFilesChange={field.onChange}
								accept={acceptedTypes}
							/>
						</FormControl>
						<FormDescription>
							Sube las fotos del paciente.
						</FormDescription>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="xrays"
				rules={{
					validate: (value: File[]) =>
						value.length > 0 || "Las radiografías son requeridas",
				}}
				render={({ field }) => (
					<FormItem className="animate-in fade-in duration-1000">
						<FormLabel>Radiografías</FormLabel>
						<FormControl>
							<FileUpload
								files={field.value}
								onFilesChange={field.onChange}
								accept={acceptedTypes}
							/>
						</FormControl>
						<FormDescription>
							Sube las radiografías del paciente.
						</FormDescription>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="scans"
				rules={{
					validate: (value: File[]) =>
						value.length > 0 || "Los escaneos son requeridos",
				}}
				render={({ field }) => (
					<FormItem className="animate-in fade-in duration-1000">
						<FormLabel>Escaneos</FormLabel>
						<FormControl>
							<FileUpload
								files={field.value}
								onFilesChange={field.onChange}
								accept={acceptedTypes}
							/>
						</FormControl>
						<FormDescription>
							Sube los escaneos intraorales del paciente.
						</FormDescription>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="supplementary_docs"
				render={({ field }) => (
					<FormItem className="animate-in fade-in duration-1000">
						<FormLabel>Documentación Complementaria</FormLabel>
						<FormControl>
							<FileUpload
								files={field.value}
								onFilesChange={field.onChange}
								accept={acceptedTypes}
							/>
						</FormControl>
						<FormDescription>
							Documentación adicional (opcional).
						</FormDescription>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="files"
				rules={{
					validate: (value: File[]) =>
						value.length > 0 || "Los archivos son requeridos",
				}}
				render={({ field }) => (
					<FormItem className="animate-in fade-in duration-1000">
						<FormLabel>Archivos</FormLabel>
						<FormControl>
							<FileUpload
								files={field.value}
								onFilesChange={field.onChange}
								accept={acceptedTypes}
							/>
						</FormControl>
						<FormDescription>
							Sube los archivos relevantes del paciente.
						</FormDescription>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="sworn_declaration"
				rules={{
					required: "La declaración jurada es requerida",
					validate: (value) =>
						value === true ||
						"Debe aceptar la declaración jurada para continuar",
				}}
				render={({ field }) => (
					<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 animate-in fade-in duration-1000">
						<FormControl>
							<Checkbox
								checked={field.value}
								onCheckedChange={field.onChange}
							/>
						</FormControl>
						<div className="space-y-1 leading-none">
							<FormLabel>Declaración Jurada</FormLabel>
							<FormDescription>
								Declaro que la información y documentación
								consignada reviste carácter de declaración
								jurada. Su omisión o falsedad podrá invalidar el
								presente acuerdo, sin perjuicio de otras
								sanciones. OrthoPlanner3D™ podrá solicitar
								información complementaria en función de lo
								declarado.
								<br />
								<a
									href="/politica-de-privacidad"
									target="_blank"
									rel="noopener noreferrer"
									className="underline text-xs"
								>
									Ver política de privacidad
								</a>
							</FormDescription>
						</div>
						<FormMessage />
					</FormItem>
				)}
			/>
		</>
	);
}
