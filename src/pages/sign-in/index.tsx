import { Link, useLocation } from "react-router";
import { LoginForm } from "@/components/login-form";
import notificationSuccess from "@/services/notificacion.service";

export default function SignIn() {
	const { state } = useLocation();

	if (state?.message) {
		notificationSuccess({
			message: state.message,
			action: {
				label: "Cerrar",
				onClick: () => console.log("Cerrar"),
			},
		});
	}

	return (
		<div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
			<div className="w-full max-w-sm">
				<LoginForm />
				<p className="text-muted-foreground mt-6 text-center text-xs">
					¿Todavía no tenés un plan?{" "}
					<Link
						to="/suscripcion"
						className="hover:text-primary font-medium underline underline-offset-4"
					>
						Contratá créditos
					</Link>
				</p>
			</div>
		</div>
	);
}
