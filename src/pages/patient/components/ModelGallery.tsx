import { Box, ChevronDown, Download } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { getPatientModelSignedUrls } from "@/services/supabase/storage.service";
import {
	type PatientModelCase,
	usePatientModels,
} from "../lib/usePatientModels";

function getFileName(path: string): string {
	return path.split("/").pop() ?? path;
}

function formatCaseDate(iso: string): string {
	return new Date(iso).toLocaleDateString("es-AR", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});
}

interface ModelGalleryProps {
	patientId: number;
}

/**
 * Modelos 3D del paciente, cargados desde la plataforma `stl-render`.
 *
 * No reusa `FileGallery` a propósito: un caso trae un GLB por paso y por arco
 * (fácilmente 40-80 archivos) y los GLB no tienen preview, así que la grilla de
 * tarjetas daría cientos de tiles vacíos. Se agrupa por caso y se colapsa.
 */
export function ModelGallery({ patientId }: ModelGalleryProps) {
	const { cases, isLoading } = usePatientModels(patientId);
	const totalFiles = cases.reduce((sum, item) => sum + item.files.length, 0);

	return (
		<div className="space-y-3">
			<div className="flex items-baseline gap-2">
				<h4 className="text-sm font-medium">Modelos 3D</h4>
				<span className="text-xs text-muted-foreground">
					{totalFiles}
				</span>
			</div>

			{isLoading ? (
				<div className="space-y-2">
					<Skeleton className="h-14 rounded-xl" />
					<Skeleton className="h-14 rounded-xl" />
				</div>
			) : cases.length === 0 ? (
				<p className="text-sm text-muted-foreground">Sin modelos 3D</p>
			) : (
				<div className="space-y-2">
					{cases.map((item) => (
						<ModelCase key={item.id} modelCase={item} />
					))}
				</div>
			)}
		</div>
	);
}

function ModelCase({ modelCase }: { modelCase: PatientModelCase }) {
	const [open, setOpen] = useState(false);
	const [urls, setUrls] = useState<Record<string, string> | null>(null);
	const [signing, setSigning] = useState(false);

	// Las URLs se firman recién al abrir el caso: un paciente con tres casos no
	// tiene por qué firmar doscientas URLs para mostrar tres renglones cerrados.
	const handleOpenChange = (next: boolean) => {
		setOpen(next);
		if (!next || urls !== null || signing || modelCase.files.length === 0) {
			return;
		}

		setSigning(true);
		getPatientModelSignedUrls(modelCase.files)
			.then(setUrls)
			.catch(() => {
				toast.error("Error al generar los enlaces de descarga");
			})
			.finally(() => setSigning(false));
	};

	return (
		<Collapsible
			open={open}
			onOpenChange={handleOpenChange}
			className="overflow-hidden rounded-xl border bg-card"
		>
			<CollapsibleTrigger className="flex w-full items-center gap-3 p-3 text-left transition-[background-color,transform] duration-150 ease-out hover:bg-muted/50 active:scale-[0.99]">
				<div className="rounded-md bg-brand-muted p-1.5">
					<Box className="h-4 w-4 text-brand" />
				</div>
				<div className="min-w-0 flex-1">
					<p className="truncate text-sm font-medium">
						Caso del {formatCaseDate(modelCase.createdAt)}
					</p>
					<p className="text-[11px] tracking-wide text-muted-foreground">
						{modelCase.files.length}{" "}
						{modelCase.files.length === 1 ? "archivo" : "archivos"}
					</p>
				</div>
				<ChevronDown
					className={cn(
						"h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-out",
						open && "rotate-180",
					)}
				/>
			</CollapsibleTrigger>

			<CollapsibleContent>
				<div className="max-h-72 overflow-y-auto border-t">
					{modelCase.files.length === 0 ? (
						<p className="p-3 text-sm text-muted-foreground">
							El caso no tiene archivos cargados
						</p>
					) : (
						<ul className="divide-y">
							{modelCase.files.map((path) => (
								<ModelFileRow
									key={path}
									path={path}
									url={urls?.[path]}
								/>
							))}
						</ul>
					)}
				</div>
			</CollapsibleContent>
		</Collapsible>
	);
}

function ModelFileRow({ path, url }: { path: string; url?: string }) {
	const name = getFileName(path);

	return (
		<li className="flex items-center gap-3 px-3 py-2">
			<Box className="h-4 w-4 shrink-0 text-muted-foreground" />
			<span className="min-w-0 flex-1 truncate text-sm">{name}</span>
			{url ? (
				<a
					href={url}
					download={name}
					className="flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-brand transition-colors hover:bg-brand-muted"
				>
					<Download className="h-3.5 w-3.5" />
					Descargar
				</a>
			) : (
				<Skeleton className="h-6 w-24 shrink-0 rounded-md" />
			)}
		</li>
	);
}
