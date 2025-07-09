import { useState } from "react";
import { type FieldValues, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import BrandLogo from "@/components/ui/brandLogo";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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

const steps = [1, 2, 3, 4, 5];

interface IPatient {
	name: string;
	last_name: string;
	type_of_plan: string;
	treatment_approach: string;
	treatment_objective: string;
	dental_restrictions: string;
	declared_limitations: string;
	suggested_adminations_and_actions: string;
	observations_or_instructions: string;
	files: string;
	sworn_declaration: boolean;
}

export default function CreatePatient() {
	const [currentStep, setCurrentStep] = useState(1);
	const navigate = useNavigate();
	const form = useForm({
		defaultValues: {
			name: "",
			last_name: "",
			type_of_plan: "",
			treatment_approach: "",
			treatment_objective: "",
			dental_restrictions: "",
			declared_limitations: "",
			suggested_adminations_and_actions: "",
			observations_or_instructions: "",
			files: "",
			sworn_declaration: false,
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
		const isValid = await form.trigger(["files", "sworn_declaration"]);
		if (isValid) {
			form.handleSubmit(onSubmit)();
		}
	}

	async function createPatient(patient: IPatient) {
		const { data, error } = await supabase
			.from("patients")
			.insert({
				name: patient.name,
				last_name: patient.last_name,
				type_of_plan: patient.type_of_plan,
				treatment_approach: patient.treatment_approach,
				treatment_objective: patient.treatment_objective,
				dental_restrictions: patient.dental_restrictions,
				declared_limitations: patient.declared_limitations,
				suggested_adminations_and_actions:
					patient.suggested_adminations_and_actions,
				observations_or_instructions:
					patient.observations_or_instructions,
				files: patient.files,
				sworn_declaration: patient.sworn_declaration,
			})
			.select();

		if (error) {
			console.error("Error al crear el paciente", error.message);
			throw error;
		}

		console.log("Paciente creado:", data);
		return data;
	}

	async function onSubmit(values: IPatient) {
		try {
			console.log("Enviando...");
			console.log(values);
			await createPatient(values);

			navigate("/", {
				state: {
					message: "Paciente registrado exitosamente",
				},
			});
		} catch (error) {
			console.error("Form submission error", error);
		}
	}

	return (
		<div className="relative min-h-screen flex items-center justify-center">
			<div className="max-w-xl w-full mx-auto grid grid-rows-12 min-h-[850px] px-4">
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
						>
							Registrar
						</Button>
					)}
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
									<Input
										placeholder="Ingrese el nombre"
										type="text"
										{...field}
									/>
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
									<Input
										placeholder="Ingrese el apellido"
										type="text"
										{...field}
									/>
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
									<SelectValue placeholder="Seleccione el tipo de plan" />
								</SelectTrigger>
							</FormControl>
							<SelectContent>
								<SelectItem value="Caso inicial">
									Caso inicial
								</SelectItem>
								<SelectItem value="Refinamiento">
									Refinamiento
								</SelectItem>
								<SelectItem value="Express">Express</SelectItem>
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
									<SelectValue placeholder="Seleccione el enfoque" />
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
	const [showTreatmentObjectiveOther, setShowTreatmentObjectiveOther] =
		useState(false);

	return (
		<>
			<p className="text-center text-xs text-muted-foreground italic">
				Objetivos del tratamiento
			</p>
			<FormField
				control={form.control}
				name="treatment_objective"
				rules={{ required: "El objetivo del tratamiento es requerido" }}
				render={({ field }) => (
					<FormItem className="animate-in fade-in duration-1000">
						<FormLabel>Objetivo del Tratamiento</FormLabel>
						{!showTreatmentObjectiveOther ? (
							<Select
								onValueChange={(value) => {
									if (value === "Otros") {
										field.onChange("");
										setShowTreatmentObjectiveOther(true);
									} else {
										field.onChange(value);
										setShowTreatmentObjectiveOther(false);
									}
								}}
								defaultValue={field.value}
							>
								<FormControl>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Seleccione el objetivo del tratamiento" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="Alinear y nivelar">
										Alinear y nivelar
									</SelectItem>
									<SelectItem value="Centrar línea media">
										Centrar línea media
									</SelectItem>
									<SelectItem value="Expandir maxilares">
										Expandir maxilares
									</SelectItem>
									<SelectItem value="Mejorar mordida abierta">
										Mejorar mordida abierta
									</SelectItem>
									<SelectItem value="Mejorar mordida profunda">
										Mejorar mordida profunda
									</SelectItem>
									<SelectItem value="Descruzar mordida anterior">
										Descruzar mordida anterior
									</SelectItem>
									<SelectItem value="Descruzar mordida lateral">
										Descruzar mordida lateral
									</SelectItem>
									<SelectItem value="Descruzar mordida posterior (predictibilidad baja – posible necesidad de aditamentos)">
										Descruzar mordida posterior
										(predictibilidad baja – posible
										necesidad de aditamentos)
									</SelectItem>
									<SelectItem value="Desrotar caninos en giroversión (predictibilidad baja – posible necesidad de aditamentos)">
										Desrotar caninos en giroversión
										(predictibilidad baja – posible
										necesidad de aditamentos)
									</SelectItem>
									<SelectItem value="Desrotar premolares en giroversión (predictibilidad baja – posible necesidad de aditamentos)">
										Desrotar premolares en giroversión
										(predictibilidad baja – posible
										necesidad de aditamentos)
									</SelectItem>
									<SelectItem value="Distalizar (hasta 2 mm en etapa inicial – considerar 3ros molares y hueso limitante)">
										Distalizar (hasta 2 mm en etapa inicial
										– considerar 3ros molares y hueso
										limitante)
									</SelectItem>
									<SelectItem value="Mejorar mordida">
										Mejorar mordida
									</SelectItem>
									<SelectItem value="Lograr clase I canina">
										Lograr clase I canina
									</SelectItem>
									<SelectItem value="Protruir sector anterior">
										Protruir sector anterior
									</SelectItem>
									<SelectItem value="Retruir sector anterior">
										Retruir sector anterior
									</SelectItem>
									<SelectItem value="Cerrar diastemas">
										Cerrar diastemas
									</SelectItem>
									<SelectItem value="Cerrar espacios (hasta 2 mm – considerar dientes volcados)">
										Cerrar espacios (hasta 2 mm – considerar
										dientes volcados)
									</SelectItem>
									<SelectItem value="Mantener espacios para implantes">
										Mantener espacios para implantes
									</SelectItem>
									<SelectItem value="Agrandar espacios para implantes">
										Agrandar espacios para implantes
									</SelectItem>
									<SelectItem value="Dejar espacio proximal en laterales por Bolton alterado (para restauración futura)">
										Dejar espacio proximal en laterales por
										Bolton alterado (para restauración
										futura)
									</SelectItem>
									<SelectItem value="A criterio de OP3D™">
										A criterio de OP3D™
									</SelectItem>
									<SelectItem value="Otros">Otros</SelectItem>
								</SelectContent>
							</Select>
						) : (
							<div className="space-y-2">
								<FormControl>
									<Textarea
										placeholder="Describa el objetivo del tratamiento..."
										className="min-h-[120px]"
										{...field}
									/>
								</FormControl>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() => {
										setShowTreatmentObjectiveOther(false);
										field.onChange("");
									}}
								>
									Volver a las opciones
								</Button>
							</div>
						)}
						<FormDescription>
							Seleccione el objetivo principal del tratamiento
							para este paciente.
						</FormDescription>
						<FormMessage />
					</FormItem>
				)}
			/>
		</>
	);
}

function Step3({ form }: { form: FieldValues }) {
	const [showDentalRestrictionsOther, setShowDentalRestrictionsOther] =
		useState(false);
	const [showDeclaredLimitationsOther, setShowDeclaredLimitationsOther] =
		useState(false);

	return (
		<>
			<p className="text-center text-xs text-muted-foreground italic">
				Restricciones y limitaciones
			</p>
			<FormField
				control={form.control}
				name="dental_restrictions"
				rules={{
					required: "Las restricciones dentales son requeridas",
				}}
				render={({ field }) => (
					<FormItem className="animate-in fade-in duration-1000">
						<FormLabel>Restricciones Dentales</FormLabel>
						{!showDentalRestrictionsOther ? (
							<Select
								onValueChange={(value) => {
									if (value === "Otros") {
										field.onChange("");
										setShowDentalRestrictionsOther(true);
									} else {
										field.onChange(value);
										setShowDentalRestrictionsOther(false);
									}
								}}
								defaultValue={field.value}
							>
								<FormControl>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Seleccione las restricciones dentales" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="Coronas o carillas protésicas">
										Coronas o carillas protésicas
									</SelectItem>
									<SelectItem value="Caninos sin espacio">
										Caninos sin espacio
									</SelectItem>
									<SelectItem value="Giroversiones pronunciadas">
										Giroversiones pronunciadas
									</SelectItem>
									<SelectItem value="Volcamiento dentario post-extracción">
										Volcamiento dentario post-extracción
									</SelectItem>
									<SelectItem value="No cerrar el diastema central">
										No cerrar el diastema central
									</SelectItem>
									<SelectItem value="A criterio de OP3D™">
										A criterio de OP3D™
									</SelectItem>
									<SelectItem value="No aplica">
										No aplica
									</SelectItem>
									<SelectItem value="Otros">Otros</SelectItem>
								</SelectContent>
							</Select>
						) : (
							<div className="space-y-2">
								<FormControl>
									<Textarea
										placeholder="Describa las restricciones dentales..."
										className="min-h-[120px]"
										{...field}
									/>
								</FormControl>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() => {
										setShowDentalRestrictionsOther(false);
										field.onChange("");
									}}
								>
									Volver a las opciones
								</Button>
							</div>
						)}
						<FormDescription>
							Seleccione las restricciones dentales que puedan
							afectar el tratamiento.
						</FormDescription>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="declared_limitations"
				rules={{
					required: "Las limitaciones declaradas son requeridas",
				}}
				render={({ field }) => (
					<FormItem className="animate-in fade-in duration-1000">
						<FormLabel>Limitaciones Declaradas</FormLabel>
						{!showDeclaredLimitationsOther ? (
							<Select
								onValueChange={(value) => {
									if (value === "Otros") {
										field.onChange("");
										setShowDeclaredLimitationsOther(true);
									} else {
										field.onChange(value);
										setShowDeclaredLimitationsOther(false);
									}
								}}
								defaultValue={field.value}
							>
								<FormControl>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Seleccione las limitaciones declaradas" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="Movimiento de línea media no posible">
										Movimiento de línea media no posible
									</SelectItem>
									<SelectItem value="Expansión de molares limitada por retracciones gingivales">
										Expansión de molares limitada por
										retracciones gingivales
									</SelectItem>
									<SelectItem value="Expansión de molares limitada por falta de desarrollo transversal">
										Expansión de molares limitada por falta
										de desarrollo transversal
									</SelectItem>
									<SelectItem value="Mordida abierta no cerrable completamente (limitación esquelética)">
										Mordida abierta no cerrable
										completamente (limitación esquelética)
									</SelectItem>
									<SelectItem value="No se logra mordida ideal (se buscará mordida armónica)">
										No se logra mordida ideal (se buscará
										mordida armónica)
									</SelectItem>
									<SelectItem value="Descruzamiento limitado por factores esqueléticos">
										Descruzamiento limitado por factores
										esqueléticos
									</SelectItem>
									<SelectItem value="Caninos no ubicables por distancia de movimiento">
										Caninos no ubicables por distancia de
										movimiento
									</SelectItem>
									<SelectItem value="Caninos no ubicables por atresia maxilar">
										Caninos no ubicables por atresia maxilar
									</SelectItem>
									<SelectItem value="Giroversiones no desrrotables totalmente">
										Giroversiones no desrrotables totalmente
									</SelectItem>
									<SelectItem value="Clase I canina no lograble (discrepancia de Bolton)">
										Clase I canina no lograble (discrepancia
										de Bolton)
									</SelectItem>
									<SelectItem value="Espacios desdentados mayores a 2 mm no cerrables">
										Espacios desdentados mayores a 2 mm no
										cerrables
									</SelectItem>
									<SelectItem value="Dientes volcados no enderezables">
										Dientes volcados no enderezables
									</SelectItem>
									<SelectItem value="Coronas/carillas no movilizables">
										Coronas/carillas no movilizables
									</SelectItem>
									<SelectItem value="A criterio de OP3D™">
										A criterio de OP3D™
									</SelectItem>
									<SelectItem value="No aplica">
										No aplica
									</SelectItem>
									<SelectItem value="Otros">Otros</SelectItem>
								</SelectContent>
							</Select>
						) : (
							<div className="space-y-2">
								<FormControl>
									<Textarea
										placeholder="Describa las limitaciones declaradas..."
										className="min-h-[120px]"
										{...field}
									/>
								</FormControl>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() => {
										setShowDeclaredLimitationsOther(false);
										field.onChange("");
									}}
								>
									Volver a las opciones
								</Button>
							</div>
						)}
						<FormDescription>
							Seleccione las limitaciones que el paciente ha
							declarado o que han sido identificadas.
						</FormDescription>
						<FormMessage />
					</FormItem>
				)}
			/>
		</>
	);
}

function Step4({ form }: { form: FieldValues }) {
	const [showSuggestedAdminationsOther, setShowSuggestedAdminationsOther] =
		useState(false);

	return (
		<>
			<p className="text-center text-xs text-muted-foreground italic">
				Aditamentos e instrucciones adicionales
			</p>
			<FormField
				control={form.control}
				name="suggested_adminations_and_actions"
				rules={{ required: "Las recomendaciones son requeridas" }}
				render={({ field }) => (
					<FormItem className="animate-in fade-in duration-1000">
						<FormLabel>
							Recomendaciones y Acciones Sugeridas
						</FormLabel>
						{!showSuggestedAdminationsOther ? (
							<Select
								onValueChange={(value) => {
									if (value === "Otros") {
										field.onChange("");
										setShowSuggestedAdminationsOther(true);
									} else {
										field.onChange(value);
										setShowSuggestedAdminationsOther(false);
									}
								}}
								defaultValue={field.value}
							>
								<FormControl>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Seleccione las recomendaciones y acciones" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="Sobrecorrección">
										Sobrecorrección
									</SelectItem>
									<SelectItem value="Superficies de presión negativa">
										Superficies de presión negativa
									</SelectItem>
									<SelectItem value="Gomas de clase">
										Gomas de clase
									</SelectItem>
									<SelectItem value="Gomas de extrusión">
										Gomas de extrusión
									</SelectItem>
									<SelectItem value="Gomas de rotación">
										Gomas de rotación
									</SelectItem>
									<SelectItem value="Gomas cruzadas (criss cross)">
										Gomas cruzadas (criss cross)
									</SelectItem>
									<SelectItem value="Microimplantes">
										Microimplantes
									</SelectItem>
									<SelectItem value="A criterio de OP3D™">
										A criterio de OP3D™
									</SelectItem>
									<SelectItem value="No aplica">
										No aplica
									</SelectItem>
									<SelectItem value="Otros">Otros</SelectItem>
								</SelectContent>
							</Select>
						) : (
							<div className="space-y-2">
								<FormControl>
									<Textarea
										placeholder="Describa las recomendaciones y acciones sugeridas..."
										className="min-h-[120px]"
										{...field}
									/>
								</FormControl>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() => {
										setShowSuggestedAdminationsOther(false);
										field.onChange("");
									}}
								>
									Volver a las opciones
								</Button>
							</div>
						)}
						<FormDescription>
							Seleccione las recomendaciones y acciones que se
							sugieren para el tratamiento.
						</FormDescription>
						<FormMessage />
					</FormItem>
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
							<Textarea
								placeholder="Agregue observaciones o instrucciones adicionales..."
								className="min-h-[120px]"
								{...field}
							/>
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
	return (
		<>
			<p className="text-center text-xs text-muted-foreground italic">
				Documentación y declaración jurada.
			</p>
			<FormField
				control={form.control}
				name="files"
				rules={{ required: "Los archivos son requeridos" }}
				render={({ field }) => (
					<FormItem className="animate-in fade-in duration-1000">
						<FormLabel>Archivos</FormLabel>
						<FormControl>
							<Input
								type="file"
								multiple
								accept=".jpg,.jpeg,.png"
								{...field}
							/>
						</FormControl>
						<FormDescription>
							Sube los archivos relevantes del paciente (PNG, JPG,
							JPEG).
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
							</FormDescription>
						</div>
						<FormMessage />
					</FormItem>
				)}
			/>
		</>
	);
}
