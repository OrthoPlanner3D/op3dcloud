import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
	type CountryIso2,
	defaultCountries,
	PhoneInput,
	parseCountry,
} from "react-international-phone";
import "react-international-phone/style.css";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
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
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/config/supabase.config";
import {
	updateUserPassword,
	updateUserProfile,
} from "@/services/supabase/profile.service";
import {
	getClientFilePublicUrl,
	uploadClientFile,
} from "@/services/supabase/storage.service";
import { useUserStore } from "@/state/stores/useUserStore";

// Lista de países de LATAM
const latinAmericaCountries: CountryIso2[] = [
	"ar", // Argentina
	"bo", // Bolivia
	"br", // Brazil
	"cl", // Chile
	"co", // Colombia
	"cr", // Costa Rica
	"cu", // Cuba
	"do", // Dominican Republic
	"ec", // Ecuador
	"sv", // El Salvador
	"gt", // Guatemala
	"hn", // Honduras
	"mx", // Mexico
	"ni", // Nicaragua
	"pa", // Panama
	"py", // Paraguay
	"pe", // Peru
	"uy", // Uruguay
	"ve", // Venezuela
];

const latinAmericaCountryData = defaultCountries.filter((country) =>
	latinAmericaCountries.includes(parseCountry(country).iso2),
);

interface ProfileFormData {
	name: string;
	last_name: string;
	phone: string;
	country: string;
	entity: string;
	user_type: string;
	logo: string;
	experience_in_digital_planning: string;
	digital_model_zocalo_height: string;
	treatment_approach: string;
	work_modality: string;
	reports_language: string;
	how_did_you_meet_us: string;
	credits: number;
	status: string;
	planner: string;
	status_files: string;
	case_status: string;
	notes: string;
	current_password: string;
	new_password: string;
	confirm_new_password: string;
}

export default function Profile() {
	const { user, updateUser } = useUserStore();
	const [showCurrentPassword, setShowCurrentPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [logoFile, setLogoFile] = useState<File | null>(null);

	const form = useForm<ProfileFormData>({
		defaultValues: {
			name: "",
			last_name: "",
			phone: "",
			country: "",
			entity: "",
			user_type: "",
			logo: "",
			experience_in_digital_planning: "",
			digital_model_zocalo_height: "",
			treatment_approach: "",
			work_modality: "",
			reports_language: "",
			how_did_you_meet_us: "",
			credits: 0,
			status: "",
			planner: "",
			status_files: "",
			case_status: "",
			notes: "",
			current_password: "",
			new_password: "",
			confirm_new_password: "",
		},
	});

	// Cargar datos del usuario al montar el componente
	useEffect(() => {
		async function loadUserData() {
			const {
				data: { user: authUser },
			} = await supabase.auth.getUser();

			if (authUser?.user_metadata) {
				const metadata = authUser.user_metadata;
				form.reset({
					name: metadata.name || "",
					last_name: metadata.last_name || "",
					phone: metadata.phone || "",
					country: metadata.country || "",
					entity: metadata.entity || "",
					user_type: metadata.user_type || "",
					logo: metadata.logo || "",
					experience_in_digital_planning:
						metadata.experience_in_digital_planning || "",
					digital_model_zocalo_height:
						metadata.digital_model_zocalo_height || "",
					treatment_approach: metadata.treatment_approach || "",
					work_modality: metadata.work_modality || "",
					reports_language: metadata.reports_language || "",
					how_did_you_meet_us: metadata.how_did_you_meet_us || "",
					credits: metadata.credits || 0,
					status: metadata.status || "",
					planner: metadata.planner || "",
					status_files: metadata.status_files || "",
					case_status: metadata.case_status || "",
					notes: metadata.notes || "",
					current_password: "",
					new_password: "",
					confirm_new_password: "",
				});
			}
		}

		loadUserData();
	}, [form]);

	async function onSubmit(values: ProfileFormData) {
		setIsLoading(true);

		try {
			let logoPath = values.logo;
			if (logoFile) {
				logoPath = await uploadClientFile(logoFile);
			}

			// Actualizar perfil
			const profileData = {
				name: values.name,
				last_name: values.last_name,
				phone: values.phone,
				country: values.country,
				entity: values.entity,
				user_type: values.user_type,
				logo: logoPath,
				experience_in_digital_planning:
					values.experience_in_digital_planning,
				digital_model_zocalo_height: values.digital_model_zocalo_height,
				treatment_approach: values.treatment_approach,
				work_modality: values.work_modality,
				reports_language: values.reports_language,
				how_did_you_meet_us: values.how_did_you_meet_us,
				credits: values.credits,
				status: values.status,
				planner: values.planner,
				status_files: values.status_files,
				case_status: values.case_status,
				notes: values.notes,
			};

			await updateUserProfile(profileData);

			// Sincronizar con Zustand store
			updateUser({
				username: `${values.name} ${values.last_name}`,
				user_metadata: {
					...user?.user_metadata,
					...profileData,
				},
			});

			// Actualizar contraseña si se proporcionó
			if (values.new_password) {
				if (values.new_password !== values.confirm_new_password) {
					toast.error("Las contraseñas no coinciden");
					setIsLoading(false);
					return;
				}

				await updateUserPassword(values.new_password);

				// Limpiar campos de contraseña
				form.setValue("current_password", "");
				form.setValue("new_password", "");
				form.setValue("confirm_new_password", "");
			}

			toast.success("Perfil actualizado exitosamente");
		} catch (error) {
			console.error("Error al actualizar el perfil:", error);
			toast.error("Error al actualizar el perfil");
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div className="container mx-auto py-8 px-4 max-w-4xl">
			<div className="mb-8">
				<h1 className="text-3xl font-bold">Mi Perfil</h1>
				<p className="text-muted-foreground mt-2">
					Gestiona tu información personal y preferencias
				</p>
			</div>

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-8"
				>
					{/* Información Personal */}
					<div className="space-y-4">
						<h2 className="text-xl font-semibold border-b pb-2">
							Información Personal
						</h2>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="name"
								rules={{ required: true }}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Nombre</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="last_name"
								rules={{ required: true }}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Apellido</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="phone"
								rules={{ required: true }}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Teléfono</FormLabel>
										<FormControl>
											<PhoneInput
												defaultCountry="ar"
												countries={
													latinAmericaCountryData
												}
												value={field.value}
												onChange={field.onChange}
												inputClassName="w-full"
												countrySelectorStyleProps={{
													style: { width: "55px" },
												}}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="country"
								rules={{ required: true }}
								render={({ field }) => (
									<FormItem>
										<FormLabel>País</FormLabel>
										<Select
											onValueChange={field.onChange}
											value={field.value}
										>
											<FormControl>
												<SelectTrigger className="w-full">
													<SelectValue />
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

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="entity"
								rules={{ required: true }}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Entidad</FormLabel>
										<FormControl>
											<Input {...field} />
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
									<FormItem>
										<FormLabel>Tipo de usuario</FormLabel>
										<Select
											onValueChange={field.onChange}
											value={field.value}
										>
											<FormControl className="w-full">
												<SelectTrigger>
													<SelectValue />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="Laboratorio">
													Laboratorio
												</SelectItem>
												<SelectItem value="Clínica">
													Clínica
												</SelectItem>
												<SelectItem value="Odontólogo">
													Odontólogo
												</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</div>

					{/* Preferencias de Planificación */}
					<div className="space-y-4">
						<h2 className="text-xl font-semibold border-b pb-2">
							Preferencias de Planificación
						</h2>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="experience_in_digital_planning"
								rules={{ required: true }}
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Experiencia en planificación digital
										</FormLabel>
										<Select
											onValueChange={field.onChange}
											value={field.value}
										>
											<FormControl className="w-full">
												<SelectTrigger>
													<SelectValue />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="Básico">
													Básico
												</SelectItem>
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
									<FormItem>
										<FormLabel>
											Altura del zócalo del modelo digital
										</FormLabel>
										<Select
											onValueChange={field.onChange}
											value={field.value}
										>
											<FormControl className="w-full">
												<SelectTrigger>
													<SelectValue />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="Baja">
													Baja
												</SelectItem>
												<SelectItem value="Media">
													Media
												</SelectItem>
												<SelectItem value="Alta">
													Alta
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
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="treatment_approach"
								rules={{ required: true }}
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Enfoque del tratamiento
										</FormLabel>
										<Select
											onValueChange={field.onChange}
											value={field.value}
										>
											<FormControl className="w-full">
												<SelectTrigger>
													<SelectValue />
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
									<FormItem>
										<FormLabel>
											Modalidad de trabajo
										</FormLabel>
										<Select
											onValueChange={field.onChange}
											value={field.value}
										>
											<FormControl className="w-full">
												<SelectTrigger>
													<SelectValue />
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
						</div>

						<FormField
							control={form.control}
							name="reports_language"
							rules={{ required: true }}
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Idioma de los informes
									</FormLabel>
									<Select
										onValueChange={field.onChange}
										value={field.value}
									>
										<FormControl className="w-full">
											<SelectTrigger>
												<SelectValue />
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
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					{/* Otros Datos */}
					<div className="space-y-4">
						<h2 className="text-xl font-semibold border-b pb-2">
							Otros Datos
						</h2>

						<FormField
							control={form.control}
							name="logo"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Logo</FormLabel>
									<FormControl>
										<div className="space-y-2">
											{field.value && !logoFile && (
												<img
													src={getClientFilePublicUrl(
														field.value,
													)}
													alt="Logo actual"
													className="h-12 w-auto rounded object-contain"
												/>
											)}
											<input
												type="file"
												accept="image/png,image/jpeg,image/webp"
												className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-secondary file:text-secondary-foreground hover:file:bg-secondary/80"
												onChange={(e) => {
													const file =
														e.target.files?.[0] ??
														null;
													setLogoFile(file);
												}}
											/>
											{logoFile && (
												<p className="text-xs text-muted-foreground">
													Seleccionado:{" "}
													{logoFile.name}
												</p>
											)}
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="status"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Estado</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="planner"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Planner</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name="status_files"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Estado de archivos</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="case_status"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Estado de caso</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="notes"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Notas</FormLabel>
									<FormControl>
										<Textarea {...field} rows={4} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					{/* Cambiar Contraseña */}
					<div className="space-y-4">
						<h2 className="text-xl font-semibold border-b pb-2">
							Cambiar Contraseña
						</h2>

						<FormField
							control={form.control}
							name="current_password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Contraseña actual</FormLabel>
									<FormControl>
										<div className="relative">
											<Input
												type={
													showCurrentPassword
														? "text"
														: "password"
												}
												{...field}
											/>
											<button
												type="button"
												onClick={() =>
													setShowCurrentPassword(
														!showCurrentPassword,
													)
												}
												className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
											>
												{showCurrentPassword ? (
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

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="new_password"
								rules={{
									minLength: {
										value: 6,
										message:
											"La contraseña debe tener al menos 6 caracteres",
									},
								}}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Nueva contraseña</FormLabel>
										<FormControl>
											<div className="relative">
												<Input
													type={
														showNewPassword
															? "text"
															: "password"
													}
													{...field}
												/>
												<button
													type="button"
													onClick={() =>
														setShowNewPassword(
															!showNewPassword,
														)
													}
													className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
												>
													{showNewPassword ? (
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

							<FormField
								control={form.control}
								name="confirm_new_password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Confirmar nueva contraseña
										</FormLabel>
										<FormControl>
											<div className="relative">
												<Input
													type={
														showConfirmPassword
															? "text"
															: "password"
													}
													{...field}
												/>
												<button
													type="button"
													onClick={() =>
														setShowConfirmPassword(
															!showConfirmPassword,
														)
													}
													className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
												>
													{showConfirmPassword ? (
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
						</div>
					</div>

					<div className="flex justify-end">
						<Button type="submit" disabled={isLoading}>
							{isLoading ? "Guardando..." : "Guardar cambios"}
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}
