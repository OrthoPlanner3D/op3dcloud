import { CopyIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUpload } from "@/components/ui/file-upload";
import { formatUsd, type Plan } from "../plans.data";

interface StepReceiptProps {
	plan: Plan;
	files: File[];
	onFilesChange: (files: File[]) => void;
	onBack: () => void;
	onSubmit: () => void;
}

// Datos de transferencia de relleno. Se reemplazan por los reales al
// conectar el backend.
const TRANSFER_DATA = [
	{ label: "Titular", value: "OrthoPlanner3D S.A." },
	{ label: "CBU", value: "0000000000000000000000" },
	{ label: "Alias", value: "op3d.pagos" },
	{ label: "CUIT", value: "30-00000000-0" },
];

export default function StepReceipt({
	plan,
	files,
	onFilesChange,
	onBack,
	onSubmit,
}: StepReceiptProps) {
	async function copyToClipboard(value: string, label: string) {
		try {
			await navigator.clipboard.writeText(value);
			toast.success(`${label} copiado`);
		} catch {
			toast.error("No se pudo copiar");
		}
	}

	return (
		<div className="mx-auto max-w-lg space-y-6">
			<div className="text-center">
				<h2 className="text-foreground text-2xl font-semibold">
					Realizá la transferencia
				</h2>
				<p className="text-muted-foreground mt-1 text-sm">
					Transferí {plan.total != null ? formatUsd(plan.total) : ""}{" "}
					y subí el comprobante para que verifiquemos tu pago.
				</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="text-base">
						Datos para transferir
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="divide-y">
						{TRANSFER_DATA.map((row) => (
							<div
								key={row.label}
								className="flex items-center justify-between py-2"
							>
								<span className="text-muted-foreground text-sm">
									{row.label}
								</span>
								<div className="flex items-center gap-2">
									<span className="text-foreground text-sm font-medium">
										{row.value}
									</span>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										className="size-6"
										onClick={() =>
											copyToClipboard(
												row.value,
												row.label,
											)
										}
									>
										<CopyIcon className="size-3" />
									</Button>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			<div className="space-y-2">
				<p className="text-foreground text-sm font-medium">
					Comprobante de transferencia
				</p>
				<FileUpload
					files={files}
					onFilesChange={onFilesChange}
					accept="image/*,application/pdf"
					multiple={false}
				/>
				<p className="text-muted-foreground text-xs">
					Formatos aceptados: imagen o PDF.
				</p>
			</div>

			<div className="flex items-center justify-between">
				<Button type="button" variant="outline" onClick={onBack}>
					Volver
				</Button>
				<Button
					type="button"
					disabled={files.length === 0}
					onClick={onSubmit}
				>
					Enviar comprobante
				</Button>
			</div>
		</div>
	);
}
