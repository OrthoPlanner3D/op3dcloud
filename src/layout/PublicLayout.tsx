import { Link } from "react-router";

interface Props {
	children: React.ReactNode;
}

export default function PublicLayout({ children }: Props) {
	return (
		<div className="min-h-screen flex flex-col">
			<main className="flex-1">{children}</main>

			<footer className="bg-muted/50 border-t">
				<div className="container mx-auto px-4 py-6">
					<div className="flex flex-col md:flex-row justify-between items-center gap-4">
						<div className="text-sm text-muted-foreground">
							© 2024 OP3DCloud. Todos los derechos reservados.
						</div>

						<div className="flex items-center gap-6 text-sm">
							<Link
								to="/terminos-y-condiciones"
								className="text-muted-foreground hover:text-foreground transition-colors"
							>
								Términos y Condiciones
							</Link>
							<Link
								to="/politica-de-privacidad"
								className="text-muted-foreground hover:text-foreground transition-colors"
							>
								Política de Privacidad
							</Link>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}
