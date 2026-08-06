import type { DocumentProps } from "@react-pdf/renderer";
import { usePDF } from "@react-pdf/renderer";
import {
	Box,
	Calendar,
	Check,
	CheckCircle,
	Download,
	ExternalLink,
	FileText,
	FolderOpen,
	Gauge,
	Layers,
	Link2,
	Lock,
	PenLine,
	Route,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatDate } from "@/lib/utils";
import { TreatmentPlanningDocument } from "@/pages/formPlanificadorPdf";
import { getTreatmentFilePublicUrl } from "@/services/supabase/storage.service";
import type { PatientsRow } from "@/types/db/patients/patients";
import { getCaseWorkflow, type WorkflowStepState } from "../lib/case-workflow";
import type { TreatmentPlanningRow } from "../lib/useTreatmentPlanning";

interface CaseProps {
	patient: PatientsRow;
	planning: TreatmentPlanningRow | null;
	isLoading: boolean;
}

export default function CaseSummary({
	patient,
	planning,
	isLoading,
}: CaseProps) {
	if (isLoading) {
		return (
			<div className="space-y-3">
				<div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
					{["a", "b", "c", "d"].map((k) => (
						<Skeleton key={k} className="h-20 rounded-xl" />
					))}
				</div>
				<Skeleton className="h-44 rounded-xl" />
			</div>
		);
	}

	return (
		<div className="space-y-3">
			<CaseKpis patient={patient} planning={planning} />

			<div className="grid items-start gap-3 lg:grid-cols-3">
				<div className="lg:col-span-2">
					<CaseWorkflow patient={patient} planning={planning} />
				</div>
				<div className="space-y-3">
					<PlanningCard planning={planning} />
					<DeliverablesCard patient={patient} planning={planning} />
				</div>
			</div>
		</div>
	);
}

/* ── KPIs clínicos ─────────────────────────────────────────────────────── */

function CaseKpis({
	patient,
	planning,
}: {
	patient: PatientsRow;
	planning: TreatmentPlanningRow | null;
}) {
	const aligners = planning
		? planning.upper_aligners + planning.lower_aligners
		: null;

	return (
		<div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
			<KpiTile
				icon={Layers}
				label="Cantidad de alineadores"
				value={aligners !== null ? String(aligners) : "Pendiente"}
				hint={
					planning
						? `Sup. ${planning.upper_aligners} / Inf. ${planning.lower_aligners}`
						: undefined
				}
				muted={aligners === null}
			/>
			<KpiTile
				icon={Gauge}
				label="Complejidad"
				value={planning?.complexity || "Pendiente"}
				muted={!planning?.complexity}
			/>
			<KpiTile
				icon={FolderOpen}
				label="Tipo de caso"
				value={patient.type_of_plan || "No especificado"}
				muted={!patient.type_of_plan}
			/>
			<KpiTile
				icon={Calendar}
				label="Última actualización"
				value={formatDate(planning?.created_at ?? patient.created_at)}
			/>
		</div>
	);
}

function KpiTile({
	icon: Icon,
	label,
	value,
	hint,
	muted,
}: {
	icon: React.ElementType;
	label: string;
	value: string;
	hint?: string;
	muted?: boolean;
}) {
	return (
		<Card className="gap-0 border py-3 shadow-sm">
			<div className="flex items-center gap-3 px-3">
				<div className="shrink-0 rounded-lg bg-brand-muted p-2">
					<Icon className="h-4 w-4 text-brand" />
				</div>
				<div className="min-w-0">
					<p className="text-[11px] tracking-wide text-muted-foreground">
						{label}
					</p>
					<p
						className={cn(
							"truncate text-sm font-semibold",
							muted && "font-normal text-muted-foreground",
						)}
						title={value}
					>
						{value}
					</p>
					{hint && (
						<p className="truncate text-[11px] text-muted-foreground">
							{hint}
						</p>
					)}
				</div>
			</div>
		</Card>
	);
}

/* ── Workflow ──────────────────────────────────────────────────────────── */

function CaseWorkflow({
	patient,
	planning,
}: {
	patient: PatientsRow;
	planning: TreatmentPlanningRow | null;
}) {
	const steps = getCaseWorkflow(patient, planning);

	return (
		<SectionCard title="Workflow del caso" icon={Route}>
			{/* Horizontal en desktop, vertical en mobile */}
			<ol className="flex flex-col gap-4 md:flex-row md:gap-0">
				{steps.map((step, index) => (
					<li
						key={step.id}
						className="flex flex-1 gap-3 md:flex-col md:items-center md:gap-2 md:text-center"
					>
						<div className="flex flex-col items-center md:w-full md:flex-row">
							{/* Conector izquierdo (solo desktop) */}
							<span
								className={cn(
									"hidden h-px flex-1 md:block",
									index === 0 && "invisible",
									step.state === "done"
										? "bg-brand"
										: "bg-border",
								)}
							/>
							<StepCircle state={step.state} />
							{/* Conector derecho (solo desktop) */}
							<span
								className={cn(
									"hidden h-px flex-1 md:block",
									index === steps.length - 1 && "invisible",
									steps[index + 1]?.state === "done"
										? "bg-brand"
										: "bg-border",
								)}
							/>
							{/* Conector vertical (solo mobile) */}
							{index < steps.length - 1 && (
								<span
									className={cn(
										"w-px flex-1 md:hidden",
										steps[index + 1]?.state === "done"
											? "bg-brand"
											: "bg-border",
									)}
								/>
							)}
						</div>

						<div className="pb-4 md:pb-0">
							<p
								className={cn(
									"text-xs font-medium",
									step.state === "pending" ||
										step.state === "locked"
										? "text-muted-foreground"
										: "text-foreground",
								)}
							>
								{step.label}
							</p>
							{step.date && (
								<p className="text-[11px] text-muted-foreground">
									{formatDate(step.date)}
								</p>
							)}
						</div>
					</li>
				))}
			</ol>

			<div className="space-y-1.5 rounded-md border border-dashed p-3 text-xs text-muted-foreground">
				<p>
					<span className="font-medium">Documentación</span> se
					completa con fotos, radiografías y escaneos cargados más la
					declaración jurada.{" "}
					<span className="font-medium">En planificación</span>,
					cuando el planificador guarda el formulario del caso.
				</p>
				<p>
					La aprobación del caso todavía no se registra en el sistema:
					el workflow no avanza más allá de{" "}
					<span className="font-medium">Pendiente de aprobación</span>{" "}
					y los entregables quedan bloqueados.
				</p>
			</div>
		</SectionCard>
	);
}

function StepCircle({ state }: { state: WorkflowStepState }) {
	return (
		<span
			className={cn(
				"flex size-8 shrink-0 items-center justify-center rounded-full border-2",
				state === "done" &&
					"border-brand bg-brand text-brand-foreground",
				state === "current" && "border-brand bg-brand-muted text-brand",
				state === "pending" &&
					"border-border bg-background text-muted-foreground",
				state === "locked" &&
					"border-border bg-muted text-muted-foreground",
			)}
		>
			{state === "done" ? (
				<Check className="size-4" />
			) : state === "locked" ? (
				<Lock className="size-3.5" />
			) : (
				<span className="size-2 rounded-full bg-current" />
			)}
		</span>
	);
}

/* ── Planificación 3D ──────────────────────────────────────────────────── */

function PlanningCard({ planning }: { planning: TreatmentPlanningRow | null }) {
	return (
		<SectionCard title="Planificación 3D" icon={Box}>
			{planning?.render_3d ? (
				<a
					href={planning.render_3d}
					target="_blank"
					rel="noopener noreferrer"
					className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
				>
					<ExternalLink className="h-3.5 w-3.5" />
					Abrir planificación
				</a>
			) : (
				<p className="text-sm text-muted-foreground">
					Todavía no hay un render 3D disponible para este caso.
				</p>
			)}
		</SectionCard>
	);
}

/* ── Entregables ───────────────────────────────────────────────────────── */

function DeliverablesCard({
	patient,
	planning,
}: {
	patient: PatientsRow;
	planning: TreatmentPlanningRow | null;
}) {
	const reportUrl = planning?.technical_report_url;

	return (
		<SectionCard title="Entregables" icon={FolderOpen}>
			{reportUrl ? (
				<div className="space-y-3">
					<a
						href={getTreatmentFilePublicUrl(reportUrl)}
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
					>
						<ExternalLink className="h-3.5 w-3.5" />
						Informe técnico
					</a>
					{planning && (
						<PDFDownloadButton
							doc={
								<TreatmentPlanningDocument
									treatmentPlanning={planning}
									patient={patient}
								/>
							}
							fileName={`planificacion-${patient.name}-${patient.last_name}.pdf`}
						/>
					)}
				</div>
			) : (
				<div className="flex flex-col items-center gap-3 py-2 text-center">
					<div className="rounded-full bg-muted p-4">
						<Lock className="h-6 w-6 text-muted-foreground" />
					</div>
					<div className="space-y-1">
						<p className="text-sm font-medium">
							Entregables bloqueados
						</p>
						<p className="text-xs text-muted-foreground">
							Se habilitan tras la aprobación de la planificación
							del caso.
						</p>
					</div>
				</div>
			)}
		</SectionCard>
	);
}

/* ── Toolbar de acciones del caso ──────────────────────────────────────── */

export function CaseToolbar({
	patient,
	planning,
	showViewPlanning,
	onViewPlanning,
	onCopyLink,
	onRequestModification,
	onApprove,
}: {
	patient: PatientsRow;
	planning: TreatmentPlanningRow | null;
	showViewPlanning: boolean;
	onViewPlanning: () => void;
	onCopyLink: () => void;
	onRequestModification: () => void;
	onApprove: () => void;
}) {
	return (
		<div className="flex flex-wrap gap-2">
			{showViewPlanning && (
				<Button variant="outline" size="sm" onClick={onViewPlanning}>
					<FileText className="h-4 w-4" />
					Ver planificación
				</Button>
			)}
			<Button variant="outline" size="sm" onClick={onCopyLink}>
				<Link2 className="h-4 w-4" />
				Copiar link
			</Button>
			<Button
				variant="outline"
				size="sm"
				onClick={onRequestModification}
				disabled={!planning}
			>
				<PenLine className="h-4 w-4" />
				Solicitar modificación
			</Button>
			{planning && (
				<PDFDownloadButton
					doc={
						<TreatmentPlanningDocument
							treatmentPlanning={planning}
							patient={patient}
						/>
					}
					fileName={`planificacion-${patient.name}-${patient.last_name}.pdf`}
				/>
			)}
			<Button
				variant="brand"
				size="sm"
				onClick={onApprove}
				disabled={!planning}
			>
				<CheckCircle className="h-4 w-4" />
				Aprobar planificación
			</Button>
		</div>
	);
}

export function PDFDownloadButton({
	doc,
	fileName,
}: {
	doc: React.ReactElement<DocumentProps>;
	fileName: string;
}) {
	const [instance] = usePDF({ document: doc });

	const handleDownload = () => {
		if (!instance.url) return;
		const a = window.document.createElement("a");
		a.href = instance.url;
		a.download = fileName;
		a.click();
	};

	return (
		<Button
			variant="outline"
			size="sm"
			disabled={instance.loading || !!instance.error}
			onClick={handleDownload}
		>
			<Download className="h-4 w-4" />
			{instance.loading ? "Generando..." : "Descargar PDF"}
		</Button>
	);
}

/* ── Shell de sección, mismo lenguaje que el resto del detalle ─────────── */

function SectionCard({
	title,
	icon: Icon,
	children,
}: {
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
					{title}
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4 px-4">{children}</CardContent>
		</Card>
	);
}
