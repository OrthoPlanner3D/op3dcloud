import { useForm } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import type { Plan } from "../plans.data";

export interface PartnerFormValues {
	name: string;
	last_name: string;
	company: string;
	email: string;
	country: string;
	phone: string;
	message: string;
}

interface StepPartnerFormProps {
	plan: Plan;
	onBack: () => void;
	onSubmit: (values: PartnerFormValues) => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function StepPartnerForm({
	plan,
	onBack,
	onSubmit,
}: StepPartnerFormProps) {
	const form = useForm<PartnerFormValues>({
		defaultValues: {
			name: "",
			last_name: "",
			company: "",
			email: "",
			country: "",
			phone: "",
			message: "",
		},
	});

	return (
		<div className="mx-auto max-w-lg space-y-6">
			<div className="text-center">
				<h2 className="text-foreground text-2xl font-semibold">
					Diseñá tu acuerdo Partner
				</h2>
				<p className="text-muted-foreground mt-1 text-sm">
					Contanos sobre tu operación y nuestro equipo comercial te
					contactará con una propuesta a medida.
				</p>
			</div>

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-4"
				>
					<div className="grid gap-4 sm:grid-cols-2">
						<FormField
							control={form.control}
							name="name"
							rules={{ required: "Ingresá tu nombre" }}
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
							rules={{ required: "Ingresá tu apellido" }}
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

					<FormField
						control={form.control}
						name="company"
						rules={{ required: "Ingresá tu empresa o laboratorio" }}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Empresa o laboratorio</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="email"
						rules={{
							required: "Ingresá tu email",
							pattern: {
								value: EMAIL_REGEX,
								message: "Email inválido",
							},
						}}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input type="email" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="grid gap-4 sm:grid-cols-2">
						<FormField
							control={form.control}
							name="country"
							rules={{ required: "Ingresá tu país" }}
							render={({ field }) => (
								<FormItem>
									<FormLabel>País</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="phone"
							rules={{ required: "Ingresá tu teléfono" }}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Teléfono / WhatsApp</FormLabel>
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
						name="message"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Mensaje (opcional)</FormLabel>
								<FormControl>
									<Textarea
										placeholder="Volumen estimado, necesidades específicas, etc."
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<p className="text-muted-foreground text-xs">
						Plan seleccionado: {plan.name} · {plan.concept}
					</p>

					<div className="flex items-center justify-between">
						<Button
							type="button"
							variant="outline"
							onClick={onBack}
						>
							Volver
						</Button>
						<Button type="submit">Enviar solicitud</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}
