"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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

// Tipo para los datos del formulario
type FormData = {
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

export default function TreatmentPlanningForm() {
	// Inicializar React Hook Form
	const { register, handleSubmit, setValue, watch, reset } =
		useForm<FormData>({
			defaultValues: {
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
			},
		});

	// Función para manejar cambios en campos de selección múltiple
	const handleMultiSelectChange = (field: keyof FormData, value: string) => {
		const currentValues = (watch(field) as string[]) || [];
		if (currentValues.includes(value)) {
			setValue(
				field,
				currentValues.filter((v: string) => v !== value),
			);
		} else {
			setValue(field, [...currentValues, value]);
		}
	};

	// Función para enviar el formulario
	const onSubmit = (_data: FormData) => {
		toast.success("Formulario enviado correctamente");
	};

	// Función para limpiar el formulario
	const handleReset = () => {
		reset();
	};

	return (
		<div className="max-w-4xl mx-auto py-10">
			{/* Encabezado del formulario */}
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900 mb-2">
					Planificación de Tratamiento
				</h1>
				<p className="text-gray-600">
					Complete el formulario para la planificación del caso
					ortodóntico
				</p>
			</div>

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
				{/* Campo: Maxilares a Tratar */}
				<div>
					<label
						htmlFor="maxilares"
						className="block text-sm font-medium text-gray-700 mb-2"
					>
						Maxilares a Tratar
					</label>
					<Select
						onValueChange={(value) => setValue("maxilares", value)}
					>
						<SelectTrigger id="maxilares">
							<SelectValue placeholder="Seleccionar Maxilar" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="ambos">Ambos</SelectItem>
							<SelectItem value="superior">Superior</SelectItem>
							<SelectItem value="inferior">Inferior</SelectItem>
						</SelectContent>
					</Select>
					<p className="mt-1 text-sm text-gray-500">
						Indica qué maxilares serán tratados en la planificación
					</p>
				</div>

				{/* Grid para campos de cantidad */}
				<div className="grid grid-cols-12 gap-4">
					<div className="col-span-4">
						<label
							htmlFor="cantidadSuperior"
							className="block text-sm font-medium text-gray-700 mb-2"
						>
							Cantidad en Superior
						</label>
						<Input
							id="cantidadSuperior"
							placeholder="Cantidad"
							type="number"
							{...register("cantidadSuperior")}
						/>
						<p className="mt-1 text-sm text-gray-500">
							Cantidad de alineadores para el maxilar superior
						</p>
					</div>
				</div>

				{/* Campo: Cantidad en Inferior */}
				<div>
					<label
						htmlFor="cantidadInferior"
						className="block text-sm font-medium text-gray-700 mb-2"
					>
						Cantidad en Inferior
					</label>
					<Input
						id="cantidadInferior"
						placeholder="Cantidad"
						type="number"
						{...register("cantidadInferior")}
					/>
					<p className="mt-1 text-sm text-gray-500">
						Cantidad de alineadores para el maxilar inferior
					</p>
				</div>

				{/* Campo: Render Simulación */}
				<div>
					<label
						htmlFor="renderSimulacion"
						className="block text-sm font-medium text-gray-700 mb-2"
					>
						Render Simulación
					</label>
					<Input
						id="renderSimulacion"
						placeholder="Url"
						type="url"
						{...register("renderSimulacion")}
					/>
					<p className="mt-1 text-sm text-gray-500">
						Enlace externo (ej: video de Youtube) que muestre la
						simulación del caso
					</p>
				</div>

				{/* Campo: Complejidad */}
				<div>
					<fieldset>
						<legend className="block text-sm font-medium text-gray-700 mb-3">
							Complejidad
						</legend>
						<RadioGroup
							onValueChange={(value: string) =>
								setValue("complejidad", value)
							}
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
					</fieldset>
					<p className="mt-1 text-sm text-gray-500">
						Nivel de dificultad del caso
					</p>
				</div>

				{/* Campo: Pronóstico */}
				<div>
					<fieldset>
						<legend className="block text-sm font-medium text-gray-700 mb-3">
							Pronóstico
						</legend>
						<RadioGroup
							onValueChange={(value: string) =>
								setValue("pronostico", value)
							}
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
					</fieldset>
					<p className="mt-1 text-sm text-gray-500">
						Evaluación general de la previsibilidad del tratamiento
					</p>
				</div>

				{/* Campo: Manufactura - Recomendaciones y Requerimientos */}
				<div>
					<label
						htmlFor="manufactura"
						className="block text-sm font-medium text-gray-700 mb-2"
					>
						Manufactura - Recomendaciones y Requerimientos
					</label>
					<Select
						onValueChange={(value) =>
							handleMultiSelectChange("manufactura", value)
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
					{/* Mostrar valores seleccionados */}
					{watch("manufactura") &&
						watch("manufactura").length > 0 && (
							<div className="mt-2 flex flex-wrap gap-1">
								{watch("manufactura").map((value) => (
									<span
										key={value}
										className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
									>
										{value}
										<button
											type="button"
											className="ml-1 text-blue-600 hover:text-blue-800"
											onClick={() =>
												handleMultiSelectChange(
													"manufactura",
													value,
												)
											}
										>
											×
										</button>
									</span>
								))}
							</div>
						)}
					<p className="mt-1 text-sm text-gray-500">
						Selección de instrucciones técnicas y clínicas
						predefinidas para la fabricación de los alineadores
					</p>
				</div>

				{/* Campo: Consideraciones Diagnósticas */}
				<div>
					<label
						htmlFor="consideracionesDiagnosticas"
						className="block text-sm font-medium text-gray-700 mb-2"
					>
						Consideraciones Diagnósticas
					</label>
					<Select
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
					{/* Mostrar valores seleccionados */}
					{watch("consideracionesDiagnosticas") &&
						watch("consideracionesDiagnosticas").length > 0 && (
							<div className="mt-2 flex flex-wrap gap-1">
								{watch("consideracionesDiagnosticas").map(
									(value) => (
										<span
											key={value}
											className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800"
										>
											{value}
											<button
												type="button"
												className="ml-1 text-green-600 hover:text-green-800"
												onClick={() =>
													handleMultiSelectChange(
														"consideracionesDiagnosticas",
														value,
													)
												}
											>
												×
											</button>
										</span>
									),
								)}
							</div>
						)}
					<p className="mt-1 text-sm text-gray-500">
						Selección de hallazgos clínicos relevantes que pueden
						influir en el tratamiento
					</p>
				</div>

				{/* Campo: Criterio de Acción Clínica */}
				<div>
					<label
						htmlFor="criterioAccionClinica"
						className="block text-sm font-medium text-gray-700 mb-2"
					>
						Criterio de Acción Clínica
					</label>
					<Select
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
							<SelectItem value="intrusión">Intrusión</SelectItem>
							<SelectItem value="extrusión">Extrusión</SelectItem>
							<SelectItem value="rotación">Rotación</SelectItem>
							<SelectItem value="mesialización">
								Mesialización
							</SelectItem>
							<SelectItem value="distalización">
								Distalización
							</SelectItem>
						</SelectContent>
					</Select>
					{/* Mostrar valores seleccionados */}
					{watch("criterioAccionClinica") &&
						watch("criterioAccionClinica").length > 0 && (
							<div className="mt-2 flex flex-wrap gap-1">
								{watch("criterioAccionClinica").map((value) => (
									<span
										key={value}
										className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-800"
									>
										{value}
										<button
											type="button"
											className="ml-1 text-purple-600 hover:text-purple-800"
											onClick={() =>
												handleMultiSelectChange(
													"criterioAccionClinica",
													value,
												)
											}
										>
											×
										</button>
									</span>
								))}
							</div>
						)}
					<p className="mt-1 text-sm text-gray-500">
						Selección de movimientos y estrategias que se aplicarán
						en la planificación
					</p>
				</div>

				{/* Campo: Derivaciones */}
				<div>
					<label
						htmlFor="derivaciones"
						className="block text-sm font-medium text-gray-700 mb-2"
					>
						Derivaciones
					</label>
					<Select
						onValueChange={(value) =>
							handleMultiSelectChange("derivaciones", value)
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
					{/* Mostrar valores seleccionados */}
					{watch("derivaciones") &&
						watch("derivaciones").length > 0 && (
							<div className="mt-2 flex flex-wrap gap-1">
								{watch("derivaciones").map((value) => (
									<span
										key={value}
										className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-orange-100 text-orange-800"
									>
										{value}
										<button
											type="button"
											className="ml-1 text-orange-600 hover:text-orange-800"
											onClick={() =>
												handleMultiSelectChange(
													"derivaciones",
													value,
												)
											}
										>
											×
										</button>
									</span>
								))}
							</div>
						)}
					<p className="mt-1 text-sm text-gray-500">
						Especialidades a las que se recomienda derivar al
						paciente
					</p>
				</div>

				{/* Campo: Potencial de Venta */}
				<div>
					<label
						htmlFor="potencialVenta"
						className="block text-sm font-medium text-gray-700 mb-2"
					>
						Potencial de Venta
					</label>
					<Select
						onValueChange={(value) =>
							handleMultiSelectChange("potencialVenta", value)
						}
					>
						<SelectTrigger className="w-full max-w-xs">
							<SelectValue placeholder="Seleccionar tratamientos" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="blanqueamiento">
								Blanqueamiento
							</SelectItem>
							<SelectItem value="carillas">Carillas</SelectItem>
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
					{/* Mostrar valores seleccionados */}
					{watch("potencialVenta") &&
						watch("potencialVenta").length > 0 && (
							<div className="mt-2 flex flex-wrap gap-1">
								{watch("potencialVenta").map((value) => (
									<span
										key={value}
										className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-pink-100 text-pink-800"
									>
										{value}
										<button
											type="button"
											className="ml-1 text-pink-600 hover:text-pink-800"
											onClick={() =>
												handleMultiSelectChange(
													"potencialVenta",
													value,
												)
											}
										>
											×
										</button>
									</span>
								))}
							</div>
						)}
					<p className="mt-1 text-sm text-gray-500">
						Tratamientos complementarios que pueden ofrecerse al
						paciente
					</p>
				</div>

				{/* Campo: Observaciones Adicionales */}
				<div>
					<label
						htmlFor="observacionesAdicionales"
						className="block text-sm font-medium text-gray-700 mb-2"
					>
						Observaciones Adicionales
					</label>
					<Textarea
						id="observacionesAdicionales"
						placeholder="Escriba observaciones adicionales..."
						className="resize-none"
						rows={4}
						{...register("observacionesAdicionales")}
					/>
					<p className="mt-1 text-sm text-gray-500">
						Notas complementarias no contempladas en las secciones
						anteriores
					</p>
				</div>

				{/* Botones de acción */}
				<div className="flex justify-end space-x-4">
					<Button
						type="button"
						variant="outline"
						onClick={handleReset}
					>
						Limpiar Formulario
					</Button>
					<Button type="submit">Enviar Planificación</Button>
				</div>
			</form>
		</div>
	);
}
