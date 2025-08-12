import { use, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
import { supabaseAdmin } from "@/config/supabase.config";
import { getClientById } from "@/services/supabase/clients.service";
import { getPlanners } from "@/services/supabase/planners.service";
import type { ClientsViewRow } from "@/types/db/clients/clients";
import useEditClientModalStore from "../state/stores/useEditClientModalStore";

interface IFormData {
	planner: string;
	status_files: string;
	case_status: string;
	notes: string;
}

const plannersPromise = getPlanners();

export default function ModalEditClient() {
	const id = useEditClientModalStore((state) => state.id);
	const isOpen = useEditClientModalStore((state) => state.isOpen);
	const close = useEditClientModalStore((state) => state.close);
	const planners = use(plannersPromise);
	const [client, setClient] = useState<ClientsViewRow | null>(null);
	const form = useForm<IFormData>();

	const onSubmit = async (values: IFormData) => {
		try {
			console.log(id);
			if (typeof id !== "string") return;

			const { error } = await supabaseAdmin.auth.admin.updateUserById(
				id,
				{
					user_metadata: {
						planner: values.planner,
						status_files: values.status_files,
						case_status: values.case_status,
						notes: values.notes,
					},
				},
			);
			console.error(error);

			close();
		} catch (error) {
			console.error("Form submission error", error);
		}
	};

	useEffect(() => {
		if (typeof id !== "string") return;

		getClientById(id)
			.then((client) => {
				console.log(client);
				setClient(client);
			})
			.catch((error) => {
				console.error("Error getting user", error);
			});
	}, [id]);

	useEffect(() => {
		if (client) {
			form.reset({
				planner: client.planner ?? "",
				status_files: client.status_files ?? "",
				case_status: client.case_status ?? "",
				notes: client.notes ?? "",
			});
		}
	}, [client, form]);

	return (
		<Dialog open={isOpen} onOpenChange={close}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Editar cliente</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-8 max-w-3xl mx-auto py-10 w-full"
					>
						<FormField
							control={form.control}
							name="planner"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Planificador</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
										value={field.value}
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
											{...field}
										/>
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit" className="w-full">
							Guardar
						</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
