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

export default function ModalEditClient({ onClientUpdated }: ModalEditClientProps) {
	const id = useEditClientModalStore((state) => state.id);
	const isOpen = useEditClientModalStore((state) => state.isOpen);
	const close = useEditClientModalStore((state) => state.close);
	const planners = use(plannersPromise);
	const [patient, setPatient] = useState<DashboardAdminViewRow | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isLoadingPatient, setIsLoadingPatient] = useState(false);
	const form = useForm<IFormData>();

	const onSubmit = async (values: IFormData) => {
		try {
			if (!id) return;

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
			// Trigger data refresh in parent component
			onClientUpdated?.();
		} catch (error) {
			console.error("Error updating patient:", error);
			toast.error("Error al actualizar el cliente. Inténtalo de nuevo.");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (!id) return;

		setIsLoadingPatient(true);
		getPatientById(String(id))
			.then((patientData) => {
				setPatient(patientData);
			})
			.catch((error) => {
				console.error("Error getting patient:", error);
				toast.error("Error al cargar los datos del cliente");
			})
			.finally(() => {
				setIsLoadingPatient(false);
			});
	}, [id]);

	useEffect(() => {
		if (patient) {
			const formData: IFormData = {
				id_planner: patient.planner_id || "",
				status_files: patient.status_files || "",
				case_status: patient.case_status || "",
				notes: patient.notes || "",
			};
			form.reset(formData);
		}
	}, [patient, form]);

	return (
		<Dialog open={isOpen} onOpenChange={close}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Editar cliente</DialogTitle>
				</DialogHeader>
				{isLoadingPatient && (
					<div className="text-center py-4">
						<div className="text-sm text-muted-foreground">
							Cargando datos del cliente...
						</div>
					</div>
				)}
				{!isLoadingPatient && !patient && (
					<div className="text-center py-4">
						<div className="text-sm text-muted-foreground">
							No se pudieron cargar los datos del cliente
						</div>
					</div>
				)}
				{!isLoadingPatient && patient && (
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-8 max-w-3xl mx-auto py-10 w-full"
						>
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
												planners.map((planner) => (
													<SelectItem
														key={planner.id}
														value={planner.id ?? ""}
													>
														{planner.username}
													</SelectItem>
												))}
										</SelectContent>
									</Select>

									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="status_files"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Estado de archivos</FormLabel>
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
											<SelectItem value="Escaneo con errores">
												Escaneo con errores
											</SelectItem>
											<SelectItem value="Mordida con errores">
												Mordida con errores
											</SelectItem>
											<SelectItem value="Faltan fotos">
												Faltan fotos
											</SelectItem>
											<SelectItem value="Falta rx">
												Falta rx
											</SelectItem>
											<SelectItem value="Rx deficiente">
												Rx deficiente
											</SelectItem>
											<SelectItem value="Info insuficiente">
												Info insuficiente
											</SelectItem>
											<SelectItem value="Info erronea">
												Info erronea
											</SelectItem>
											<SelectItem value="Reescaneo solicitado">
												Reescaneo solicitado
											</SelectItem>
										</SelectContent>
									</Select>

									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="case_status"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Estado del caso</FormLabel>
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
											<SelectItem value="Prioridad">
												Prioridad
											</SelectItem>
											<SelectItem value="Interconsulta">
												Interconsulta
											</SelectItem>
											<SelectItem value="Replanning">
												Replanning
											</SelectItem>
											<SelectItem value="Baja">
												Baja
											</SelectItem>
										</SelectContent>
									</Select>

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
			</DialogContent>
		</Dialog>
	);
}
