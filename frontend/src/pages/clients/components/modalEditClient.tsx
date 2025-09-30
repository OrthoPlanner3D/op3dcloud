import { use, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
	getPatientById,
	updatePatient,
} from "@/services/supabase/dashboard-admin.service";
import { getPlanners } from "@/services/supabase/planners.service";
import type {
	DashboardAdminViewRow,
	PatientUpdateData,
} from "@/types/db/dashboard-admin/dashboard-admin";
import useEditClientModalStore from "../state/stores/useEditClientModalStore";

interface ModalEditClientProps {
	onClientUpdated?: () => void;
}

interface IFormData {
	id_planner: string;
	status_files: string;
	case_status: string;
	notes: string;
}

const plannersPromise = getPlanners();

// Constants for select options
const STATUS_FILES_OPTIONS = [
	"Escaneo con errores",
	"Mordida con errores",
	"Faltan fotos",
	"Falta rx",
	"Rx deficiente",
	"Info insuficiente",
	"Info erronea",
	"Reescaneo solicitado",
] as const;

const CASE_STATUS_OPTIONS = [
	"Prioridad",
	"Interconsulta",
	"Replanning",
	"Baja",
] as const;

export default function ModalEditClient({
	onClientUpdated,
}: ModalEditClientProps) {
	const id = useEditClientModalStore((state) => state.id);
	const isOpen = useEditClientModalStore((state) => state.isOpen);
	const close = useEditClientModalStore((state) => state.close);
	const planners = use(plannersPromise);

	const [patient, setPatient] = useState<DashboardAdminViewRow | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isLoadingPatient, setIsLoadingPatient] = useState(false);

	const form = useForm<IFormData>();

	// Helper function to create form data from patient
	const createFormData = (patientData: DashboardAdminViewRow): IFormData => ({
		id_planner: patientData.planner_id || "",
		status_files: patientData.status_files || "",
		case_status: patientData.case_status || "",
		notes: patientData.notes || "",
	});

	// Helper function to reset form and state
	const resetModalState = () => {
		setPatient(null);
		setIsLoadingPatient(false);
		form.reset();
	};

	// Helper function to load patient data
	const loadPatientData = async (patientId: string) => {
		setIsLoadingPatient(true);
		try {
			const patientData = await getPatientById(patientId);
			setPatient(patientData);
			form.reset(createFormData(patientData));
		} catch (error) {
			console.error("Error getting patient:", error);
			toast.error("Error al cargar los datos del cliente");
		} finally {
			setIsLoadingPatient(false);
		}
	};

	const onSubmit = async (values: IFormData) => {
		if (!id) return;

		try {
			setIsLoading(true);

			const updateData: PatientUpdateData = {
				id_planner: values.id_planner || null,
				status_files: values.status_files || null,
				case_status: values.case_status || null,
				notes: values.notes || null,
			};

			await updatePatient(String(id), updateData);

			toast.success("Cliente actualizado exitosamente");
			close();
			onClientUpdated?.();
		} catch (error) {
			console.error("Error updating patient:", error);
			toast.error("Error al actualizar el cliente. Inténtalo de nuevo.");
		} finally {
			setIsLoading(false);
		}
	};

	// Handle modal state and data loading
	useEffect(() => {
		if (!id || !isOpen) {
			resetModalState();
			return;
		}

		// If we already have the correct patient data, just reset the form
		if (patient && patient.id === Number(id)) {
			form.reset(createFormData(patient));
			return;
		}

		// Load new patient data
		loadPatientData(String(id));
	}, [id, isOpen, patient, form]);

	return (
		<Dialog open={isOpen} onOpenChange={close}>
			<DialogContent className="min-h-[400px]">
				<DialogHeader>
					<DialogTitle>Editar cliente</DialogTitle>
				</DialogHeader>

				<div className="flex-1">
					{/* Loading State */}
					{isLoadingPatient && (
						<div className="flex items-center justify-center h-32">
							<div className="text-sm text-muted-foreground">
								Cargando datos del cliente...
							</div>
						</div>
					)}

					{/* Error State */}
					{!isLoadingPatient && !patient && (
						<div className="flex items-center justify-center h-32">
							<div className="text-sm text-muted-foreground">
								No se pudieron cargar los datos del cliente
							</div>
						</div>
					)}

					{/* Form Content */}
					{!isLoadingPatient && patient && (
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-6 w-full"
							>
								{/* Planner Selection */}
								<FormField
									control={form.control}
									name="id_planner"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Planificador</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
												value={field.value}
												disabled={isLoadingPatient}
											>
												<FormControl className="w-full">
													<SelectTrigger>
														<SelectValue placeholder="Selecciona un planificador" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{planners &&
														planners.length > 0 &&
														planners.map(
															(planner) => (
																<SelectItem
																	key={
																		planner.id
																	}
																	value={
																		planner.id ??
																		""
																	}
																>
																	{
																		planner.username
																	}
																</SelectItem>
															),
														)}
												</SelectContent>
											</Select>

											<FormMessage />
										</FormItem>
									)}
								/>

								{/* Files Status Selection */}
								<FormField
									control={form.control}
									name="status_files"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												Estado de archivos
											</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
												value={field.value}
												disabled={isLoadingPatient}
											>
												<FormControl className="w-full">
													<SelectTrigger>
														<SelectValue placeholder="Selecciona un estado" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{STATUS_FILES_OPTIONS.map(
														(option) => (
															<SelectItem
																key={option}
																value={option}
															>
																{option}
															</SelectItem>
														),
													)}
												</SelectContent>
											</Select>

											<FormMessage />
										</FormItem>
									)}
								/>

								{/* Case Status Selection */}
								<FormField
									control={form.control}
									name="case_status"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												Estado del caso
											</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
												value={field.value}
												disabled={isLoadingPatient}
											>
												<FormControl className="w-full">
													<SelectTrigger>
														<SelectValue placeholder="Selecciona un estado" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{CASE_STATUS_OPTIONS.map(
														(option) => (
															<SelectItem
																key={option}
																value={option}
															>
																{option}
															</SelectItem>
														),
													)}
												</SelectContent>
											</Select>

											<FormMessage />
										</FormItem>
									)}
								/>

								{/* Notes Field */}
								<FormField
									control={form.control}
									name="notes"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Notas</FormLabel>
											<FormControl className="w-full">
												<Textarea
													placeholder="Escribe tus notas"
													className="resize-none"
													disabled={isLoadingPatient}
													{...field}
												/>
											</FormControl>

											<FormMessage />
										</FormItem>
									)}
								/>

								{/* Submit Button */}
								<Button
									type="submit"
									className="w-full"
									disabled={isLoading || isLoadingPatient}
								>
									{isLoading ? "Guardando..." : "Guardar"}
								</Button>
							</form>
						</Form>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
