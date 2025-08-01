import {
	CheckCircle,
	ClipboardList,
	FileText,
	FolderOpen,
	Stethoscope,
	Target,
	User,
	XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Patient {
	declared_limitations: string;
	dental_restrictions: string;
	files: string;
	id: number;
	id_client: string;
	last_name: string;
	name: string;
	observations_or_instructions: string;
	suggested_adminations_and_actions: string;
	sworn_declaration: boolean;
	treatment_approach: string;
	treatment_objective: string;
	type_of_plan: string;
}

interface PatientDetailProps {
	patient: Patient;
}

export default function PatientDetail({ patient }: PatientDetailProps) {
	// Datos de ejemplo para la demostración
	const samplePatient: Patient = {
		id: 1,
		id_client: "PAT-2024-001",
		name: "María",
		last_name: "González",
		declared_limitations:
			"Limitaciones de movilidad en brazo derecho, dificultad para abrir completamente la boca",
		dental_restrictions:
			"Alergia a anestesia local con lidocaína, sensibilidad extrema en molares superiores",
		files: "radiografia_panoramica.pdf, historial_medico.pdf, consentimiento_firmado.pdf",
		observations_or_instructions:
			"Paciente requiere sedación consciente para procedimientos largos. Evitar citas muy tempranas por medicación matutina.",
		suggested_adminations_and_actions:
			"Realizar profilaxis cada 3 meses, aplicar flúor tópico, evaluar necesidad de férula nocturna",
		sworn_declaration: true,
		treatment_approach:
			"Enfoque conservador con énfasis en prevención y mantenimiento de piezas naturales",
		treatment_objective:
			"Eliminar caries activas, restaurar función masticatoria y mantener salud periodontal óptima",
		type_of_plan: "Plan Integral Premium",
	};

	const displayPatient = patient || samplePatient;

	return (
		<div className="space-y-6 max-w-4xl mx-auto">
			{/* Header con información básica */}
			<Card>
				<CardHeader className="pb-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-3">
							<div className="p-2 bg-primary/10 rounded-full">
								<User className="h-6 w-6 text-primary" />
							</div>
							<div>
								<CardTitle className="text-2xl font-semibold">
									{displayPatient.name}{" "}
									{displayPatient.last_name}
								</CardTitle>
								<p className="text-muted-foreground">
									ID: {displayPatient.id}
								</p>
							</div>
						</div>
						<Badge variant="outline" className="text-sm">
							{displayPatient.type_of_plan}
						</Badge>
					</div>
				</CardHeader>
			</Card>

			<div className="grid gap-6 md:grid-cols-2">
				{/* Información Médica */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center space-x-2">
							<Stethoscope className="h-5 w-5 text-primary" />
							<span>Información Médica</span>
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<h4 className="font-medium text-sm text-muted-foreground mb-2">
								Limitaciones Declaradas
							</h4>
							<p className="text-sm leading-relaxed">
								{displayPatient.declared_limitations}
							</p>
						</div>

						<Separator />

						<div>
							<h4 className="font-medium text-sm text-muted-foreground mb-2">
								Restricciones Dentales
							</h4>
							<p className="text-sm leading-relaxed">
								{displayPatient.dental_restrictions}
							</p>
						</div>

						<Separator />

						<div className="flex items-center justify-between">
							<span className="font-medium text-sm">
								Declaración Jurada
							</span>
							<div className="flex items-center space-x-2">
								{displayPatient.sworn_declaration ? (
									<>
										<CheckCircle className="h-4 w-4 text-green-600" />
										<Badge
											variant="secondary"
											className="bg-green-50 text-green-700 border-green-200"
										>
											Completada
										</Badge>
									</>
								) : (
									<>
										<XCircle className="h-4 w-4 text-red-600" />
										<Badge
											variant="secondary"
											className="bg-red-50 text-red-700 border-red-200"
										>
											Pendiente
										</Badge>
									</>
								)}
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Plan de Tratamiento */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center space-x-2">
							<Target className="h-5 w-5 text-primary" />
							<span>Plan de Tratamiento</span>
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<h4 className="font-medium text-sm text-muted-foreground mb-2">
								Objetivo del Tratamiento
							</h4>
							<p className="text-sm leading-relaxed">
								{displayPatient.treatment_objective}
							</p>
						</div>

						<Separator />

						<div>
							<h4 className="font-medium text-sm text-muted-foreground mb-2">
								Enfoque de Tratamiento
							</h4>
							<p className="text-sm leading-relaxed">
								{displayPatient.treatment_approach}
							</p>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Observaciones y Acciones */}
			<div className="grid gap-6 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center space-x-2">
							<ClipboardList className="h-5 w-5 text-primary" />
							<span>Observaciones e Instrucciones</span>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-sm leading-relaxed">
							{displayPatient.observations_or_instructions}
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center space-x-2">
							<FileText className="h-5 w-5 text-primary" />
							<span>Acciones Sugeridas</span>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-sm leading-relaxed">
							{displayPatient.suggested_adminations_and_actions}
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Archivos */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center space-x-2">
						<FolderOpen className="h-5 w-5 text-primary" />
						<span>Archivos Adjuntos</span>
					</CardTitle>
				</CardHeader>
				{/* <CardContent>
					<div className="flex flex-wrap gap-2">
						{displayPatient.files.split(", ").map((file, index) => (
							<Badge
								key={index}
								variant="outline"
								className="text-xs"
							>
								{file}
							</Badge>
						))}
					</div>
				</CardContent> */}
			</Card>
		</div>
	);
}
