import { LoginForm } from "@/components/login-form";
import notificationSuccess from "@/services/notificacion.service";
import { useLocation } from "react-router";

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
			</div>
		</div>
	);
}
