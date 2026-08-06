import { Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * Piezas compartidas por las tres vistas del caso: el resumen, los datos del
 * paciente y la planificación. Estaban duplicadas en los tres archivos.
 */

export function SectionCard({
	title,
	icon: Icon,
	step,
	children,
}: {
	title: string;
	icon: React.ElementType;
	/** Número del paso del formulario, cuando la sección espeja `create.tsx`. */
	step?: number;
	children: React.ReactNode;
}) {
	return (
		<Card className="gap-4 border py-4 shadow-sm">
			<CardHeader className="px-4">
				<CardTitle className="flex items-center gap-2.5 text-sm font-semibold">
					<span className="rounded-md bg-brand-muted p-1.5">
						<Icon className="h-4 w-4 text-brand" />
					</span>
					{step !== undefined && (
						<span className="text-muted-foreground tabular-nums">
							{step} ·
						</span>
					)}
					{/* Varios títulos van en mayúsculas: sin tracking positivo
					    se leen apretados */}
					<span className="tracking-wide">{title}</span>
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6 px-4">{children}</CardContent>
		</Card>
	);
}

export function KpiTile({
	icon: Icon,
	label,
	value,
	hint,
	muted,
}: {
	icon: React.ElementType;
	label: string;
	value: React.ReactNode;
	hint?: string;
	/** Atenúa el valor cuando es un placeholder y no un dato real. */
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
					>
						{value || "No especificado"}
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

/** Valores de un multi-select, listados con el mismo `Check` del formulario. */
export function FieldChecklist({
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
