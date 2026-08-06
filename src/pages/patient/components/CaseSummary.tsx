import type { DocumentProps } from "@react-pdf/renderer";
import { usePDF } from "@react-pdf/renderer";
import {
	Box,
	Calendar,
	Check,
	Download,
	ExternalLink,
	FileText,
	FolderOpen,
	Gauge,
	Layers,
	Link2,
	Route,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatDate } from "@/lib/utils";
import { TreatmentPlanningDocument } from "@/pages/formPlanificadorPdf";
import { getTreatmentFilePublicUrl } from "@/services/supabase/storage.service";
import type { PatientsRow } from "@/types/db/patients/patients";
import { getCaseWorkflow, type WorkflowStepState } from "../lib/case-workflow";
import type { TreatmentPlanningRow } from "../lib/useTreatmentPlanning";
import { KpiTile, SectionCard } from "./case-ui";

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
					<DeliverablesCard planning={planning} />
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
				value={patient.type_of_plan}
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
									step.state === "pending"
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

			<p className="rounded-md border border-dashed p-3 text-xs text-muted-foreground">
				<span className="font-medium">Documentación</span> se completa
				con fotos, radiografías y escaneos cargados más la declaración
				jurada. <span className="font-medium">En planificación</span>,
				cuando el planificador guarda el formulario del caso.
			</p>
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
			)}
		>
			{state === "done" ? (
				<Check className="size-4" />
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
	planning,
}: {
	planning: TreatmentPlanningRow | null;
}) {
	const reportUrl = planning?.technical_report_url;

	return (
		<SectionCard title="Entregables" icon={FolderOpen}>
			{reportUrl ? (
				<a
					href={getTreatmentFilePublicUrl(reportUrl)}
					target="_blank"
					rel="noopener noreferrer"
					className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
				>
					<ExternalLink className="h-3.5 w-3.5" />
					Informe técnico
				</a>
			) : (
				<p className="text-sm text-muted-foreground">
					Todavía no hay un informe técnico para este caso.
				</p>
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
}: {
	patient: PatientsRow;
	planning: TreatmentPlanningRow | null;
	showViewPlanning: boolean;
	onViewPlanning: () => void;
	onCopyLink: () => void;
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
	);
}

function PDFDownloadButton({
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
