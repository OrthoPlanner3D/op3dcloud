import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/config/supabase.config";

export default function ResetPassword() {
	const navigate = useNavigate();
	const [password, setPassword] = useState("");
	const [confirm, setConfirm] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isValidSession, setIsValidSession] = useState(false);

	useEffect(() => {
		// Check existing session (set by Supabase from URL hash)
		supabase.auth.getSession().then(({ data: { session } }) => {
			if (session) setIsValidSession(true);
		});

		// Also listen in case the event hasn't fired yet
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((event, session) => {
			if (
				event === "PASSWORD_RECOVERY" ||
				(event === "INITIAL_SESSION" && session)
			) {
				setIsValidSession(true);
			}
		});
		return () => subscription.unsubscribe();
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (password !== confirm) {
			toast.error("Las contraseñas no coinciden");
			return;
		}
		if (password.length < 6) {
			toast.error("La contraseña debe tener al menos 6 caracteres");
			return;
		}
		setIsLoading(true);
		const { error } = await supabase.auth.updateUser({ password });
		setIsLoading(false);
		if (error) {
			toast.error("Error al actualizar la contraseña");
		} else {
			toast.success("Contraseña actualizada correctamente");
			navigate("/inicia-sesion");
		}
	};

	if (!isValidSession) {
		return (
			<div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
				<div className="w-full max-w-sm text-center space-y-2">
					<p className="text-sm text-muted-foreground">
						Verificando enlace de recuperación...
					</p>
					<p className="text-xs text-muted-foreground/70">
						Si este mensaje persiste, el enlace puede haber
						expirado. Solicitá uno nuevo desde la pantalla de inicio
						de sesión.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
			<div className="w-full max-w-sm space-y-6">
				<div className="space-y-1 text-center">
					<h1 className="text-2xl font-bold">Nueva contraseña</h1>
					<p className="text-sm text-muted-foreground">
						Ingresá tu nueva contraseña para continuar
					</p>
				</div>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="password">Nueva contraseña</Label>
						<Input
							id="password"
							type="password"
							placeholder="••••••••"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="confirm">Confirmar contraseña</Label>
						<Input
							id="confirm"
							type="password"
							placeholder="••••••••"
							value={confirm}
							onChange={(e) => setConfirm(e.target.value)}
							required
						/>
					</div>
					<Button
						type="submit"
						className="w-full"
						disabled={isLoading}
					>
						{isLoading
							? "Actualizando..."
							: "Actualizar contraseña"}
					</Button>
				</form>
			</div>
		</div>
	);
}
