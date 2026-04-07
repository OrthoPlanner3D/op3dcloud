import {
	CheckCircle,
	ClipboardList,
	FileText,
	FolderOpen,
	Link2,
	Stethoscope,
	Target,
	User,
	XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FileGallery } from "./FileGallery";

interface Patient {
	declared_limitations: string[];
	dental_restrictions: string[];
	photos: string[];
	xrays: string[];
	scans: string[];
	supplementary_docs: string[] | null;
	id: number;
	id_client: string;
	last_name: string;
	name: string;
	observations_or_instructions: string;
	suggested_adminations_and_actions: string[];
	sworn_declaration: boolean;
	treatment_approach: string;
	treatment_objective: string[];
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
		declared_limitations: [
			"Limitaciones de movilidad en brazo derecho",
			"Dificultad para abrir completamente la boca",
		],
		dental_restrictions: [
			"Alergia a anestesia local con lidocaína",
			"Sensibilidad extrema en molares superiores",
		],
		photos: [],
		xrays: [],
		scans: [],
		supplementary_docs: null,
		observations_or_instructions:
			"Paciente requiere sedación consciente para procedimientos largos. Evitar citas muy tempranas por medicación matutina.",
		suggested_adminations_and_actions: [
			"Realizar profilaxis cada 3 meses",
			"Aplicar flúor tópico",
			"Evaluar necesidad de férula nocturna",
		],
		sworn_declaration: true,
		treatment_approach:
			"Enfoque conservador con énfasis en prevención y mantenimiento de piezas naturales",
		treatment_objective: [
			"Eliminar caries activas",
			"Restaurar función masticatoria",
			"Mantener salud periodontal óptima",
		],
		type_of_plan: "Plan Integral Premium",
	};

	const toArray = (v: unknown): string[] => {
		if (Array.isArray(v)) return v;
		if (typeof v === "string" && v.startsWith("{")) {
			return v
				.slice(1, -1)
				.split(",")
				.map((s) => s.trim())
				.filter(Boolean);
		}
		return [];
	};

	const base = patient || samplePatient;
	const displayPatient = {
		...base,
		declared_limitations: toArray(base.declared_limitations),
		dental_restrictions: toArray(base.dental_restrictions),
		treatment_objective: toArray(base.treatment_objective),
		suggested_adminations_and_actions: toArray(
			base.suggested_adminations_and_actions,
		),
		photos: toArray(base.photos),
		xrays: toArray(base.xrays),
		scans: toArray(base.scans),
	};

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
						<div className="flex items-center gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => {
									const url = `${window.location.origin}/planificacion/${displayPatient.id}`;
									navigator.clipboard.writeText(url);
									toast.success(
										"Link copiado al portapapeles",
									);
								}}
							>
								<Link2 className="h-4 w-4 mr-2" />
								Copiar link
							</Button>
						</div>
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
							<div className="flex flex-wrap gap-1">
								{(
									displayPatient.declared_limitations ?? []
								).map((v) => (
									<Badge key={v} variant="outline">
										{v}
									</Badge>
								))}
							</div>
						</div>

						<Separator />

						<div>
							<h4 className="font-medium text-sm text-muted-foreground mb-2">
								Restricciones Dentales
							</h4>
							<div className="flex flex-wrap gap-1">
								{(displayPatient.dental_restrictions ?? []).map(
									(v) => (
										<Badge key={v} variant="outline">
											{v}
										</Badge>
									),
								)}
							</div>
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
							<div className="flex flex-wrap gap-1">
								{(displayPatient.treatment_objective ?? []).map(
									(v) => (
										<Badge key={v} variant="outline">
											{v}
										</Badge>
									),
								)}
							</div>
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
						<div className="flex flex-wrap gap-1">
							{(
								displayPatient.suggested_adminations_and_actions ??
								[]
							).map((v) => (
								<Badge key={v} variant="outline">
									{v}
								</Badge>
							))}
						</div>
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
				<CardContent className="space-y-4">
					<FileGallery label="Fotos" paths={displayPatient.photos} />
					<FileGallery
						label="Radiografías"
						paths={displayPatient.xrays}
					/>
					<FileGallery
						label="Escaneos"
						paths={displayPatient.scans}
					/>
					<FileGallery
						label="Documentación Complementaria"
						paths={displayPatient.supplementary_docs ?? []}
					/>
				</CardContent>
			</Card>
		</div>
	);
}
