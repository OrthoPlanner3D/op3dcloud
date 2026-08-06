import {
	Activity,
	ArrowDownToLine,
	ArrowUpToLine,
	Boxes,
	Check,
	Factory,
	Gauge,
	LinkIcon,
	MessageSquareText,
	ShieldAlert,
	Sparkles,
	Stethoscope,
	Target,
	TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getTreatmentFilePublicUrl } from "@/services/supabase/storage.service";
import { getTreatmentPlanningByPatientId } from "@/services/supabase/treatment-planning.service";
import type { Tables } from "@/types/db/database.types";

type TreatmentPlanningRow = Tables<
	{ schema: "op3dcloud" },
	"treatment_planning"
>;
interface TreatmentPlanningViewProps {
	patientId: number;
	isPublic?: boolean;
	/**
	 * Planificación ya cargada por el contenedor. Si no llega, el componente
	 * fetchea solo — que es lo que hace la ruta pública `/planificacion/:id`.
	 */
	treatmentPlanning?: TreatmentPlanningRow | null;
	isLoadingPlanning?: boolean;
}

export default function TreatmentPlanningView({
	patientId,
	isPublic = false,
	treatmentPlanning: providedPlanning,
	isLoadingPlanning,
}: TreatmentPlanningViewProps) {
	// Si el contenedor no provee los datos, el componente se los busca.
	const isSelfFetching = providedPlanning === undefined;

	const [fetchedPlanning, setFetchedPlanning] =
		useState<TreatmentPlanningRow | null>(null);
	const [isSelfLoading, setIsSelfLoading] = useState(isSelfFetching);

	useEffect(() => {
		if (!isSelfFetching) return;

		let cancelled = false;
		const fetch = async () => {
			try {
				setIsSelfLoading(true);
				const data = await getTreatmentPlanningByPatientId(patientId);
				if (!cancelled) setFetchedPlanning(data);
			} catch (error) {
				console.error("Error fetching treatment planning:", error);
				if (!cancelled) {
					toast.error(
						"Error al cargar la planificación de tratamiento",
					);
				}
			} finally {
				if (!cancelled) setIsSelfLoading(false);
			}
		};
		fetch();

		return () => {
			cancelled = true;
		};
	}, [patientId, isSelfFetching]);

	const treatmentPlanning = isSelfFetching
		? fetchedPlanning
		: providedPlanning;
	const isLoading = isSelfFetching
		? isSelfLoading
		: Boolean(isLoadingPlanning);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center p-8">
				<p className="text-sm text-muted-foreground">
					Cargando planificación...
				</p>
			</div>
		);
	}

	if (!treatmentPlanning) {
		return (
			<div className="flex items-center justify-center p-8">
				<div className="space-y-2 text-center">
					<p className="text-sm text-muted-foreground">
						No hay planificación de tratamiento disponible para este
						paciente.
					</p>
					<p className="text-xs text-muted-foreground/70">
						El planificador aún no ha completado el formulario.
					</p>
				</div>
			</div>
		);
	}

	const tp = treatmentPlanning;

	const hasTracking = [
		tp.tracking_rotations,
		tp.tracking_extrusions,
		tp.tracking_extrusion_buttons,
		tp.tracking_intrusions,
		tp.tracking_torque,
		tp.tracking_angulations,
		tp.tracking_translations,
		tp.tracking_expansion,
	].some(Boolean);

	const hasQuality = [
		tp.quality_information,
		tp.quality_scan,
		tp.quality_xrays,
		tp.quality_intraoral,
		tp.quality_extraoral,
	].some((a) => a && a.length > 0);

	return (
		<div
			className={cn(
				"space-y-3 pb-4",
				isPublic && "mx-auto max-w-5xl p-6",
			)}
		>
			{/* Header. Las acciones del caso viven en la toolbar de la página;
			    acá solo quedan en la vista pública, que no tiene esa toolbar. */}
			{isPublic && (
				<div>
					<h1 className="text-xl leading-tight font-semibold tracking-tight">
						Planificación de Tratamiento
					</h1>
					<p className="text-sm text-muted-foreground">
						Información detallada del plan de tratamiento
						ortodóntico
					</p>
				</div>
			)}

			{/* KPIs clínicos */}
			<div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
				<KpiTile
					icon={ArrowUpToLine}
					label="N Alineadores Max. Superior"
					value={tp.upper_aligners}
				/>
				<KpiTile
					icon={ArrowDownToLine}
					label="N Alineadores Max. Inferior"
					value={tp.lower_aligners}
				/>
				<KpiTile
					icon={Gauge}
					label="Complejidad"
					value={tp.complexity}
				/>
				<KpiTile
					icon={Activity}
					label="Pronóstico"
					value={tp.prognosis}
				/>
			</div>

			{/* Assets */}
			{(tp.render_3d || tp.technical_report_url) && (
				<SectionCard title="Archivos del caso" icon={Boxes}>
					<div className="grid gap-4 md:grid-cols-2">
						{tp.render_3d && (
							<AssetLink label="Render 3D" href={tp.render_3d} />
						)}
						{tp.technical_report_url && (
							<AssetLink
								label="Informe Técnico"
								href={getTreatmentFilePublicUrl(
									tp.technical_report_url,
								)}
							/>
						)}
					</div>
				</SectionCard>
			)}

			<SectionCard title="EVALUACIÓN CLÍNICA" icon={Stethoscope}>
				<Checklist
					label="Diagnóstico Presuntivo General"
					values={tp.diagnosis || []}
				/>
			</SectionCard>

			<SectionCard title="MANUFACTURA" icon={Factory}>
				<Checklist label="Laboratorio" values={tp.laboratory || []} />
			</SectionCard>

			<SectionCard title="PLAN DE ACCIÓN" icon={Target}>
				<Checklist
					label="Criterio de Planificación y Accionar Clínico"
					values={tp.planning || []}
				/>
			</SectionCard>

			{tp.restrictions && tp.restrictions.length > 0 && (
				<SectionCard title="RESTRICCIONES" icon={ShieldAlert}>
					<Checklist
						label="Restricciones Biomecánicas"
						values={tp.restrictions}
					/>
				</SectionCard>
			)}

			{hasTracking && (
				<SectionCard
					title="Control de Tracking para Movimientos Complejos"
					icon={Activity}
				>
					<div className="grid gap-4 md:grid-cols-2">
						{tp.tracking_rotations && (
							<DataField
								label="Rotaciones"
								value={tp.tracking_rotations}
							/>
						)}
						{tp.tracking_extrusions && (
							<DataField
								label="Extrusiones (controles clínicos)"
								value={tp.tracking_extrusions}
							/>
						)}
						{tp.tracking_extrusion_buttons && (
							<DataField
								label="Extrusiones (botones programados)"
								value={tp.tracking_extrusion_buttons}
							/>
						)}
						{tp.tracking_intrusions && (
							<DataField
								label="Intrusiones"
								value={tp.tracking_intrusions}
							/>
						)}
						{tp.tracking_torque && (
							<DataField
								label="Torque/Inclinaciones"
								value={tp.tracking_torque}
							/>
						)}
						{tp.tracking_angulations && (
							<DataField
								label="Angulaciones"
								value={tp.tracking_angulations}
							/>
						)}
						{tp.tracking_translations && (
							<DataField
								label="Traslaciones"
								value={tp.tracking_translations}
							/>
						)}
						{tp.tracking_expansion && (
							<DataField
								label="Expansión/Compresión"
								value={tp.tracking_expansion}
							/>
						)}
					</div>
				</SectionCard>
			)}

			{tp.additional_observations && (
				<SectionCard title="OBSERVACIONES" icon={MessageSquareText}>
					<div className="space-y-2">
						<h4 className="text-sm font-medium">
							Observaciones Adicionales
						</h4>
						<p className="text-sm leading-relaxed whitespace-pre-line">
							{tp.additional_observations}
						</p>
					</div>
				</SectionCard>
			)}

			{tp.commercial_potential && tp.commercial_potential.length > 0 && (
				<SectionCard title="ANÁLISIS COMERCIAL" icon={TrendingUp}>
					<Checklist
						label="Potencial Clínico-Comercial"
						values={tp.commercial_potential}
					/>
				</SectionCard>
			)}

			{hasQuality && (
				<SectionCard title="ESPACIO DE MEJORA CONTINUA" icon={Sparkles}>
					<div className="grid gap-6 md:grid-cols-2">
						{tp.quality_information &&
							tp.quality_information.length > 0 && (
								<Checklist
									label="Calidad de la Información"
									values={tp.quality_information}
								/>
							)}
						{tp.quality_scan && tp.quality_scan.length > 0 && (
							<Checklist
								label="Calidad de Escaneo"
								values={tp.quality_scan}
							/>
						)}
						{tp.quality_xrays && tp.quality_xrays.length > 0 && (
							<Checklist
								label="Calidad de Radiografías"
								values={tp.quality_xrays}
							/>
						)}
						{tp.quality_intraoral &&
							tp.quality_intraoral.length > 0 && (
								<Checklist
									label="Calidad de Fotos Intraorales"
									values={tp.quality_intraoral}
								/>
							)}
						{tp.quality_extraoral &&
							tp.quality_extraoral.length > 0 && (
								<Checklist
									label="Calidad de Fotos Extraorales"
									values={tp.quality_extraoral}
								/>
							)}
					</div>
				</SectionCard>
			)}
		</div>
	);
}

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
					{/* Varios títulos van en mayúsculas: necesitan tracking
					    positivo para no leerse apretados */}
					<span className="tracking-wide">{title}</span>
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6 px-4">{children}</CardContent>
		</Card>
	);
}

function KpiTile({
	icon: Icon,
	label,
	value,
}: {
	icon: React.ElementType;
	label: string;
	value: React.ReactNode;
}) {
	return (
		<Card className="gap-0 border py-3 shadow-sm">
			<div className="flex items-center gap-2.5 px-3">
				<div className="rounded-md bg-brand-muted p-1.5">
					<Icon className="h-4 w-4 text-brand" />
				</div>
				<div className="min-w-0">
					<p className="text-[11px] tracking-wide text-muted-foreground">
						{label}
					</p>
					<p className="truncate text-sm font-medium">
						{value || "No especificado"}
					</p>
				</div>
			</div>
		</Card>
	);
}

function DataField({
	label,
	value,
}: {
	label: string;
	value: React.ReactNode;
}) {
	return (
		<div className="space-y-1">
			<span className="text-xs text-muted-foreground">{label}</span>
			<div className="text-sm font-medium">
				{value || "No especificado"}
			</div>
		</div>
	);
}

/** Valores de un multi-select, listados con el mismo `Check` del formulario. */
function Checklist({ label, values }: { label: string; values: string[] }) {
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

function AssetLink({ label, href }: { label: string; href: string }) {
	return (
		<div className="space-y-1">
			<span className="text-xs text-muted-foreground">{label}</span>
			<div>
				<a
					href={href}
					target="_blank"
					rel="noopener noreferrer"
					className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
				>
					<LinkIcon className="h-3.5 w-3.5" />
					Ver enlace
				</a>
			</div>
		</div>
	);
}
