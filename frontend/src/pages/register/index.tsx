import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import { type FieldValues, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import BrandLogo from "@/components/ui/brandLogo";
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
import { supabase } from "@/config/supabase.config";

const steps = [1, 2, 3, 4];

interface IUser {
	email: string;
	confirmEmail: string;
	password: string;
	name: string;
	last_name: string;
	phone: string;
	country: string;
	entity: string;
	user_type: string;
	logo: string | null;
	experience_in_digital_planning: string;
	digital_model_zocalo_height: string;
	treatment_approach: string;
	work_modality: string;
	reports_language: string;
	how_did_you_meet_us: string;
	credits: number;
	status: string;
}

export default function Register() {
	const [currentStep, setCurrentStep] = useState(1);
	const [showPassword, setShowPassword] = useState(false);
	const [showReportsLanguageOther, setShowReportsLanguageOther] =
		useState(false);
	const [showHowDidYouMeetUsOther, setShowHowDidYouMeetUsOther] =
		useState(false);
	const navigate = useNavigate();
	const form = useForm({
		defaultValues: {
			name: "",
			last_name: "",
			email: "",
			confirmEmail: "",
			phone: "",
			password: "",
			country: "",
			entity: "",
			user_type: "",
			logo: null,
			experience_in_digital_planning: "",
			digital_model_zocalo_height: "",
			treatment_approach: "",
			work_modality: "",
			reports_language: "",
			how_did_you_meet_us: "",
			credits: 0,
			status: "Active",
		},
	});

	async function validateStep1() {
		const isValid = await form.trigger([
			"name",
			"last_name",
			"email",
			"confirmEmail",
			"phone",
			"password",
			"country",
			"entity",
			"user_type",
		]);
		if (isValid) {
			setCurrentStep((prev) => prev + 1);
		}
	}

	async function validateStep3() {
		const isValid = await form.trigger([
			"experience_in_digital_planning",
			"digital_model_zocalo_height",
		]);
		if (isValid) {
			setCurrentStep((prev) => prev + 1);
		}
	}

	async function validateStep4() {
		const isValid = await form.trigger([
			"treatment_approach",
			"work_modality",
			"reports_language",
			"how_did_you_meet_us",
		]);
		if (isValid) {
			form.handleSubmit(onSubmit)();
		}
	}

	async function createUser(user: IUser) {
		const { data, error } = await supabase.auth.signUp({
			email: user.email,
			password: user.password,
			options: {
				data: {
					name: user.name,
					last_name: user.last_name,
					phone: user.phone,
					country: user.country,
					entity: user.entity,
					user_type: user.user_type,
					logo: user.logo,
					experience_in_digital_planning:
						user.experience_in_digital_planning,
					digital_model_zocalo_height:
						user.digital_model_zocalo_height,
					treatment_approach: user.treatment_approach,
					work_modality: user.work_modality,
					reports_language: user.reports_language,
					how_did_you_meet_us: user.how_did_you_meet_us,
				},
			},
		});

		if (error) {
			console.error("Error al crear el usuario", error.message);
		}

		console.log(data);
	}

	async function onSubmit(values: IUser) {
		try {
			console.log("Enviando...");
			console.log(values);
			await createUser(values);

			navigate("/inicia-sesion", {
				state: {
					message: "Registro exitoso, inicia sesión para continuar",
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
							Diseñado para simplificar. Pensado para resolver
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
							className="space-y-8 max-w-3xl mx-auto w-full"
						>
							{currentStep === 1 && (
								<Step1
									form={form}
									showPassword={showPassword}
									setShowPassword={setShowPassword}
								/>
							)}
							{currentStep === 2 && <Step2 form={form} />}
							{currentStep === 3 && <Step3 form={form} />}
							{currentStep === 4 && (
								<Step4
									form={form}
									showReportsLanguageOther={
										showReportsLanguageOther
									}
									setShowReportsLanguageOther={
										setShowReportsLanguageOther
									}
									showHowDidYouMeetUsOther={
										showHowDidYouMeetUsOther
									}
									setShowHowDidYouMeetUsOther={
										setShowHowDidYouMeetUsOther
									}
								/>
							)}
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
							onClick={() => setCurrentStep((prev) => prev + 1)}
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
							variant="default"
							className="w-32"
							onClick={validateStep4}
						>
							Registrarse
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}

function Step1({
	form,
	showPassword,
	setShowPassword,
}: {
	form: FieldValues;
	showPassword: boolean;
	setShowPassword: (value: boolean) => void;
}) {
	return (
		<>
			<p className="text-center text-xs text-muted-foreground italic">
				Queremos conocerte.
			</p>
			<div className="grid grid-cols-12 gap-y-8 sm:gap-y-0 sm:gap-x-4">
				<div className="col-span-12 sm:col-span-6">
					<FormField
						control={form.control}
						name="name"
						rules={{ required: true }}
						render={({ field }) => (
							<FormItem className="animate-in fade-in duration-1000">
								<FormLabel>Nombre</FormLabel>
								<FormControl>
									<Input
										placeholder=""
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
						rules={{ required: true }}
						render={({ field }) => (
							<FormItem className="animate-in fade-in duration-1000">
								<FormLabel>Apellido</FormLabel>
								<FormControl>
									<Input placeholder="" type="" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
			</div>

			<div className="grid grid-cols-12 gap-y-8 sm:gap-y-0 sm:gap-x-4">
				<div className="col-span-12 sm:col-span-6">
					<FormField
						control={form.control}
						name="email"
						rules={{
							required: true,
							pattern: {
								value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
								message: "",
							},
						}}
						render={({ field }) => (
							<FormItem className="animate-in fade-in duration-1000">
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input
										placeholder="ejemplo@correo.com"
										type="email"
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
						name="confirmEmail"
						rules={{
							required: true,
							validate: (value) => {
								const email = form.getValues("email");
								return (
									value === email ||
									"Los correos electrónicos no coinciden"
								);
							},
						}}
						render={({ field }) => (
							<FormItem className="animate-in fade-in duration-1000">
								<FormLabel>Confirmar email</FormLabel>
								<FormControl>
									<Input
										placeholder="ejemplo@correo.com"
										type="email"
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
				name="password"
				rules={{
					required: true,
					minLength: {
						value: 6,
						message: "",
					},
				}}
				render={({ field }) => (
					<FormItem className="animate-in fade-in duration-1000">
						<FormLabel>Contraseña</FormLabel>
						<FormControl>
							<div className="relative">
								<Input
									placeholder="********"
									type={showPassword ? "text" : "password"}
									{...field}
								/>
								<button
									type="button"
									onClick={() =>
										setShowPassword(!showPassword)
									}
									className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
								>
									{showPassword ? (
										<EyeOffIcon className="h-4 w-4" />
									) : (
										<EyeIcon className="h-4 w-4" />
									)}
								</button>
							</div>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<div className="grid grid-cols-12 gap-y-8 sm:gap-y-0 sm:gap-x-4">
				<div className="col-span-12 sm:col-span-6">
					<FormField
						control={form.control}
						name="phone"
						rules={{ required: true }}
						render={({ field }) => (
							<FormItem className="animate-in fade-in duration-1000">
								<FormLabel>Teléfono</FormLabel>
								<FormControl>
									<Input type="tel" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div className="col-span-12 sm:col-span-6">
					<FormField
						control={form.control}
						name="country"
						rules={{ required: true }}
						render={({ field }) => (
							<FormItem className="animate-in fade-in duration-1000">
								<FormLabel>País</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
									<FormControl>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="Argentina">
											Argentina
										</SelectItem>
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
			</div>

			<FormField
				control={form.control}
				name="entity"
				rules={{ required: true }}
				render={({ field }) => (
					<FormItem className="animate-in fade-in duration-1000">
						<FormLabel>Entidad</FormLabel>
						<FormControl>
							<Input placeholder="" type="text" {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="user_type"
				rules={{ required: true }}
				render={({ field }) => (
					<FormItem className="animate-in fade-in duration-1000">
						<FormLabel>Tipo de usuario</FormLabel>
						<Select
							onValueChange={field.onChange}
							defaultValue={field.value}
						>
							<FormControl className="w-full">
								<SelectTrigger>
									<SelectValue placeholder="" />
								</SelectTrigger>
							</FormControl>
							<SelectContent>
								<SelectItem value="Laboratorio">
									Laboratorio
								</SelectItem>
								<SelectItem value="Clínica">Clínica</SelectItem>
								<SelectItem value="Odontólogo">
									Odontólogo
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
	return (
		<>
			<p className="text-center text-xs text-muted-foreground italic">
				Tu marca, presente en cada informe.
			</p>
			<FormField
				control={form.control}
				name="logo"
				render={({ field }) => (
					<FormItem className="animate-in fade-in duration-1000">
						<FormLabel>Logo de la identidad</FormLabel>
						<FormControl>
							<Input type="file" {...field} />
						</FormControl>
						<FormDescription>
							Este es el logo de la identidad.
						</FormDescription>
						<FormMessage />
					</FormItem>
				)}
			/>
		</>
	);
}

function Step3({ form }: { form: FieldValues }) {
	return (
		<>
			<p className="text-center text-xs text-muted-foreground italic">
				Personalizamos cada planificación.
			</p>
			<FormField
				control={form.control}
				name="experience_in_digital_planning"
				rules={{ required: true }}
				render={({ field }) => (
					<FormItem className="animate-in fade-in duration-1000">
						<FormLabel>
							Experiencia en planificación digital
						</FormLabel>
						<Select
							onValueChange={field.onChange}
							defaultValue={field.value}
						>
							<FormControl className="w-full">
								<SelectTrigger className="w-full">
									<SelectValue placeholder="" />
								</SelectTrigger>
							</FormControl>
							<SelectContent>
								<SelectItem value="Básico">Básico</SelectItem>
								<SelectItem value="Intermedio">
									Intermedio
								</SelectItem>
								<SelectItem value="Avanzado">
									Avanzado
								</SelectItem>
							</SelectContent>
						</Select>

						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="digital_model_zocalo_height"
				rules={{ required: true }}
				render={({ field }) => (
					<FormItem className="animate-in fade-in duration-1000">
						<FormLabel>
							Altura del zócalo del modelo digital
						</FormLabel>
						<Select
							onValueChange={field.onChange}
							defaultValue={field.value}
						>
							<FormControl>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="" />
								</SelectTrigger>
							</FormControl>
							<SelectContent>
								<SelectItem value="Baja">Baja</SelectItem>
								<SelectItem value="Media">Media</SelectItem>
								<SelectItem value="Alta">Alta</SelectItem>
								<SelectItem value="A criterio de OP3D">
									A criterio de OP3D
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

function Step4({
	form,
	showReportsLanguageOther,
	setShowReportsLanguageOther,
	showHowDidYouMeetUsOther,
	setShowHowDidYouMeetUsOther,
}: {
	form: FieldValues;
	showReportsLanguageOther: boolean;
	setShowReportsLanguageOther: (value: boolean) => void;
	showHowDidYouMeetUsOther: boolean;
	setShowHowDidYouMeetUsOther: (value: boolean) => void;
}) {
	return (
		<>
			<p className="text-center text-xs text-muted-foreground italic">
				Adaptamos el flujo a tu forma de trabajar.
			</p>
			<FormField
				control={form.control}
				name="treatment_approach"
				rules={{ required: true }}
				render={({ field }) => (
					<FormItem className="animate-in fade-in duration-1000">
						<FormLabel>Enfoque del tratamiento</FormLabel>
						<Select
							onValueChange={field.onChange}
							defaultValue={field.value}
						>
							<FormControl className="w-full">
								<SelectTrigger>
									<SelectValue placeholder="" />
								</SelectTrigger>
							</FormControl>
							<SelectContent>
								<SelectItem value="Estético">
									Estético
								</SelectItem>
								<SelectItem value="Estético + Funcional">
									Estético + Funcional
								</SelectItem>
								<SelectItem value="A criterio de OP3D">
									A criterio de OP3D
								</SelectItem>
							</SelectContent>
						</Select>

						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="work_modality"
				rules={{ required: true }}
				render={({ field }) => (
					<FormItem className="animate-in fade-in duration-1000">
						<FormLabel>Modalidad de trabajo</FormLabel>
						<Select
							onValueChange={field.onChange}
							defaultValue={field.value}
						>
							<FormControl>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="" />
								</SelectTrigger>
							</FormControl>
							<SelectContent>
								<SelectItem value="Paquetes">
									Paquetes
								</SelectItem>
								<SelectItem value="Caso individual">
									Caso individual
								</SelectItem>
							</SelectContent>
						</Select>

						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="reports_language"
				rules={{ required: true }}
				render={({ field }) => (
					<FormItem className="animate-in fade-in duration-1000">
						<FormLabel>Idioma de los informes</FormLabel>
						{!showReportsLanguageOther ? (
							<Select
								onValueChange={(value) => {
									if (value === "Otro") {
										field.onChange("");
										setShowReportsLanguageOther(true);
									} else {
										field.onChange(value);
										setShowReportsLanguageOther(false);
									}
								}}
								defaultValue={field.value}
							>
								<FormControl>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="Español">
										Español
									</SelectItem>
									<SelectItem value="Inglés">
										Inglés
									</SelectItem>
									<SelectItem value="Portugués">
										Portugués
									</SelectItem>
									<SelectItem value="Otro">Otro</SelectItem>
								</SelectContent>
							</Select>
						) : (
							<div className="space-y-2">
								<FormControl>
									<Input
										placeholder="Ingresa el idioma"
										type="text"
										{...field}
									/>
								</FormControl>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() => {
										setShowReportsLanguageOther(false);
										field.onChange("");
									}}
								>
									Volver a las opciones
								</Button>
							</div>
						)}
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="how_did_you_meet_us"
				rules={{ required: true }}
				render={({ field }) => (
					<FormItem className="animate-in fade-in duration-1000">
						<FormLabel>¿Cómo nos conociste?</FormLabel>
						{!showHowDidYouMeetUsOther ? (
							<Select
								onValueChange={(value) => {
									if (value === "Otro") {
										field.onChange("");
										setShowHowDidYouMeetUsOther(true);
									} else {
										field.onChange(value);
										setShowHowDidYouMeetUsOther(false);
									}
								}}
								defaultValue={field.value}
							>
								<FormControl>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="Recomendación">
										Recomendación
									</SelectItem>
									<SelectItem value="Redes">Redes</SelectItem>
									<SelectItem value="Evento">
										Evento
									</SelectItem>
									<SelectItem value="Google">
										Google
									</SelectItem>
									<SelectItem value="Otro">Otro</SelectItem>
								</SelectContent>
							</Select>
						) : (
							<div className="space-y-2">
								<FormControl>
									<Input
										placeholder="Cuéntanos cómo nos conociste"
										type="text"
										{...field}
									/>
								</FormControl>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() => {
										setShowHowDidYouMeetUsOther(false);
										field.onChange("");
									}}
								>
									Volver a las opciones
								</Button>
							</div>
						)}
						<FormMessage />
					</FormItem>
				)}
			/>
		</>
	);
}
