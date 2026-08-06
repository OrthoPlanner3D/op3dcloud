import {
	Check,
	CheckCircle,
	ClipboardList,
	FolderOpen,
	MessageSquareText,
	ShieldAlert,
	Stethoscope,
	Target,
	XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { PatientsRow } from "@/types/db/patients/patients";
import { FileGallery } from "./FileGallery";

interface PatientDetailProps {
	patient: PatientsRow;
}

/**
 * Lectura de los datos que el cliente cargó en el formulario de creación
 * (`pages/patient/create.tsx`). Las secciones, su orden y los labels espejan
 * los 5 pasos de ese formulario para que sea reconocible.
 */
export default function PatientDetail({ patient }: PatientDetailProps) {
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

	return (
		<div className="space-y-3 pb-4">
			{/* Paso 1 del formulario */}
			<SectionCard
				step={1}
				title="Datos iniciales del caso"
				icon={ClipboardList}
			>
				<FieldValue label="Tipo de Plan" value={patient.type_of_plan} />
				<FieldValue
					label="Enfoque de Tratamiento"
					value={patient.treatment_approach}
				/>
			</SectionCard>

			{/* Paso 2 del formulario */}
			<SectionCard
				step={2}
				title="Objetivos del tratamiento"
				icon={Target}
			>
				<FieldChecklist
					label="Objetivo del Tratamiento"
					values={toArray(patient.treatment_objective)}
				/>
			</SectionCard>

			{/* Paso 3 del formulario */}
			<SectionCard
				step={3}
				title="Restricciones y limitaciones"
				icon={ShieldAlert}
			>
				<div className="grid gap-6 lg:grid-cols-2">
					<FieldChecklist
						label="Restricciones Dentales"
						values={toArray(patient.dental_restrictions)}
					/>
					<FieldChecklist
						label="Limitaciones Declaradas"
						values={toArray(patient.declared_limitations)}
					/>
				</div>
			</SectionCard>

			{/* Paso 4 del formulario */}
			<SectionCard
				step={4}
				title="Aditamentos e instrucciones adicionales"
				icon={Stethoscope}
			>
				<FieldChecklist
					label="Recomendaciones y Acciones Sugeridas"
					values={toArray(patient.suggested_adminations_and_actions)}
				/>
				<FieldText
					label="Observaciones o Instrucciones"
					text={patient.observations_or_instructions}
					icon={MessageSquareText}
				/>
			</SectionCard>

			{/* Paso 5 del formulario */}
			<SectionCard
				step={5}
				title="Documentación y declaración jurada"
				icon={FolderOpen}
			>
				<div className="space-y-6">
					<FileGallery
						label="Fotos"
						paths={toArray(patient.photos)}
					/>
					<FileGallery
						label="Radiografías"
						paths={toArray(patient.xrays)}
					/>
					<FileGallery
						label="Escaneos"
						paths={toArray(patient.scans)}
					/>
					<FileGallery
						label="Documentación Complementaria"
						paths={toArray(patient.supplementary_docs)}
					/>
				</div>

				<div className="flex items-center justify-between gap-3 rounded-md border p-4">
					<div className="space-y-0.5">
						<p className="text-sm font-medium">
							Declaración Jurada
						</p>
						<p className="text-xs text-muted-foreground">
							El paciente declaró que la información consignada
							reviste carácter de declaración jurada.
						</p>
					</div>
					{patient.sworn_declaration ? (
						<Badge
							variant="outline"
							className="shrink-0 border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-200"
						>
							<CheckCircle className="size-3" />
							Completada
						</Badge>
					) : (
						<Badge
							variant="outline"
							className="shrink-0 border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200"
						>
							<XCircle className="size-3" />
							Pendiente
						</Badge>
					)}
				</div>
			</SectionCard>
		</div>
	);
}

function SectionCard({
	step,
	title,
	icon: Icon,
	children,
}: {
	step: number;
	title: string;
	icon: React.ElementType;
	children: React.ReactNode;
}) {
	return (
		<Card className="gap-4 border py-4 shadow-sm">
			<CardHeader className="px-4">
				<CardTitle className="flex items-center gap-2.5 text-sm font-semibold">
					<span className="rounded-md bg-brand-muted p-1.5">
						<Icon className="h-4 w-4 text-brand" />
					</span>
					<span className="text-muted-foreground">{step} ·</span>
					{title}
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6 px-4">{children}</CardContent>
		</Card>
	);
}

/** Campo que en el formulario es un `Select` de valor único. */
function FieldValue({
	label,
	value,
}: {
	label: string;
	value: string | null | undefined;
}) {
	return (
		<div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b pb-2 last:border-b-0 last:pb-0">
			<span className="text-sm text-muted-foreground">{label}</span>
			<span
				className={cn(
					"text-sm font-medium",
					!value && "font-normal text-muted-foreground",
				)}
			>
				{value || "No especificado"}
			</span>
		</div>
	);
}

/**
 * Campo que en el formulario es un `SearchableMultiSelect`. Se listan los
 * valores con el mismo ícono `Check` que el dropdown usa al marcarlos: las
 * opciones son largas y como chips quedan ilegibles.
 */
function FieldChecklist({
	label,
	values,
}: {
	label: string;
	values: string[];
}) {
	return (
		<div className="space-y-2">
			<div className="flex items-baseline gap-2">
				<h4 className="text-sm font-medium">{label}</h4>
				{values.length > 0 && (
					<span className="text-xs text-muted-foreground">
						{values.length}
					</span>
				)}
			</div>
			{values.length > 0 ? (
				<ul className="space-y-1.5">
					{values.map((value) => (
						<li key={value} className="flex items-start gap-2">
							<Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
							<span className="text-sm leading-relaxed">
								{value}
							</span>
						</li>
					))}
				</ul>
			) : (
				<p className="text-sm text-muted-foreground">No especificado</p>
			)}
		</div>
	);
}

/** Campo que en el formulario es un `Textarea`. */
function FieldText({
	label,
	text,
	icon: Icon,
}: {
	label: string;
	text: string | null | undefined;
	icon: React.ElementType;
}) {
	return (
		<div className="space-y-2">
			<h4 className="flex items-center gap-2 text-sm font-medium">
				<Icon className="h-4 w-4 text-muted-foreground" />
				{label}
			</h4>
			<p
				className={cn(
					"text-sm leading-relaxed whitespace-pre-line",
					!text && "text-muted-foreground",
				)}
			>
				{text || "No especificado"}
			</p>
		</div>
	);
}
