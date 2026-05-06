import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/config/supabase.config";
import { cn } from "@/lib/utils";
import { getUserRole } from "@/services/supabase/users.service";
import { useUserStore } from "@/state/stores/useUserStore";
import BrandLogo from "./ui/brandLogo";

interface ILoginForm {
	email: string;
	password: string;
}

export function LoginForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const { register, handleSubmit } = useForm<ILoginForm>();
	const setUser = useUserStore((state) => state.setUser);
	const [loginError, setLoginError] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showResetModal, setShowResetModal] = useState(false);
	const [resetEmail, setResetEmail] = useState("");
	const [isResetting, setIsResetting] = useState(false);

	async function onSubmit(data: ILoginForm) {
		setLoginError(false);
		const { data: userData, error } =
			await supabase.auth.signInWithPassword({
				email: data.email,
				password: data.password,
			});

		if (error) {
			setLoginError(true);
			toast.error(
				"Credenciales incorrectas. Verificá tu email y contraseña.",
			);
			return;
		}

		if (userData?.user?.id) {
			// Obtener el rol del usuario
			const userRole = await getUserRole(userData.user.id);

			setUser({
				id: userData.user.id,
				email: userData.user.email ?? "",
				username: `${userData.user.user_metadata?.name ?? ""} ${userData.user.user_metadata?.last_name ?? ""}`,
				role: userRole,
			});
		}
	}

	async function handleResetPassword() {
		if (!resetEmail) {
			toast.error("Por favor, ingresa tu email");
			return;
		}

		setIsResetting(true);
		const { error } = await supabase.auth.resetPasswordForEmail(
			resetEmail,
			{
				redirectTo: `${window.location.origin}/reset-password`,
			},
		);

		if (error) {
			toast.error("Error al enviar el email de recuperación");
			console.error(error);
		} else {
			toast.success(
				"Se ha enviado un email con las instrucciones para recuperar tu contraseña",
			);
			setShowResetModal(false);
			setResetEmail("");
		}
		setIsResetting(false);
	}

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="flex flex-col gap-6">
					<div className="flex flex-col items-center gap-2">
						<Link
							to="/"
							className="flex flex-col items-center gap-2 font-medium"
							target="_blank"
							rel="noreferrer"
						>
							<div className="flex items-center justify-center">
								<BrandLogo className="size-26" />
							</div>
							<span className="sr-only">OP3DCloud.</span>
						</Link>
						<h1 className="text-xl font-bold">
							Bienvenido a OP3D&trade;.
						</h1>
						<div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
							No tenés una cuenta? Todo empieza con una buena
							planificación.{" "}
							<Link
								to="/registro"
								className="underline underline-offset-4"
							>
								Registrate
							</Link>
						</div>
					</div>
					<div className="flex flex-col gap-6">
						<div className="grid gap-3">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								{...register("email")}
								placeholder="m@example.com"
								required
								aria-invalid={loginError}
							/>
						</div>
						<div className="grid gap-3">
							<div className="flex items-center justify-between">
								<Label htmlFor="password">Password</Label>
								<button
									type="button"
									className="text-xs text-muted-foreground hover:text-primary underline underline-offset-4"
									onClick={() => setShowResetModal(true)}
								>
									¿Olvidaste tu contraseña?
								</button>
							</div>
							<div className="relative">
								<Input
									id="password"
									type={showPassword ? "text" : "password"}
									{...register("password")}
									placeholder="********"
									required
									className="pr-10"
									aria-invalid={loginError}
								/>
								<button
									type="button"
									className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
									onClick={() =>
										setShowPassword((prev) => !prev)
									}
									onMouseDown={(e) => e.preventDefault()}
									tabIndex={-1}
									aria-label={
										showPassword
											? "Ocultar contraseña"
											: "Mostrar contraseña"
									}
								>
									{showPassword ? (
										<EyeOff size={16} />
									) : (
										<Eye size={16} />
									)}
								</button>
							</div>
						</div>
						<Button type="submit" className="w-full">
							Iniciar sesión
						</Button>
					</div>
				</div>
			</form>
			<div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
				Al hacer clic en Continuar, usted acepta nuestros{" "}
				<Link
					to="/terminos-y-condiciones"
					className="underline underline-offset-4"
				>
					Términos y condiciones
				</Link>{" "}
				y nuestra{" "}
				<Link
					to="/politica-de-privacidad"
					className="underline underline-offset-4"
				>
					Política de privacidad
				</Link>
				.
			</div>

			<Dialog open={showResetModal} onOpenChange={setShowResetModal}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Recuperar contraseña</DialogTitle>
						<DialogDescription>
							Ingresa tu email y te enviaremos un enlace para
							restablecer tu contraseña.
						</DialogDescription>
					</DialogHeader>
					<div className="flex flex-col gap-4">
						<div className="grid gap-2">
							<Label htmlFor="reset-email">Email</Label>
							<Input
								id="reset-email"
								type="email"
								placeholder="tu@email.com"
								value={resetEmail}
								onChange={(e) => setResetEmail(e.target.value)}
							/>
						</div>
						<Button
							onClick={handleResetPassword}
							disabled={isResetting}
							className="w-full"
						>
							{isResetting
								? "Enviando..."
								: "Enviar enlace de recuperación"}
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
