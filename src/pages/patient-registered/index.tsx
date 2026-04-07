import BrandLogo from "@/components/ui/brandLogo";

export default function PatientRegisteredPage() {
	return (
		<div className="flex min-h-svh items-center justify-center p-4">
			<div className="flex flex-col items-center gap-6 text-center max-w-sm">
				<BrandLogo className="size-20" />
				<div>
					<h1 className="text-lg font-semibold">
						Caso enviado exitosamente
					</h1>
					<p className="text-sm text-muted-foreground mt-2">
						Tu información fue recibida. Nos pondremos en contacto a
						la brevedad.
					</p>
				</div>
			</div>
		</div>
	);
}
