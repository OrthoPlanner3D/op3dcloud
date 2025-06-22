import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router";
import BrandLogo from "./ui/brandLogo";
import { useForm } from "react-hook-form";
import { supabase } from "@/config/supabase.config";

interface ILoginForm {
	email: string;
	password: string;
}

export function LoginForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const { register, handleSubmit } = useForm<ILoginForm>();

	async function onSubmit(data: ILoginForm) {
		const { data: userData, error } = await supabase.auth.signInWithPassword({
			email: data.email,
			password: data.password,
		});

		if (error) {
			console.error("Error al iniciar sesión", error.message);
		}

		console.log(userData);
	}

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="flex flex-col gap-6">
					<div className="flex flex-col items-center gap-2">
						<a
							href="https://www.orthoplanner3d.com/"
							className="flex flex-col items-center gap-2 font-medium"
							target="_blank"
							rel="noreferrer"
						>
							<div className="flex items-center justify-center">
								<BrandLogo className="size-26" />
							</div>
							<span className="sr-only">OP3DCloud.</span>
						</a>
						<h1 className="text-xl font-bold">Bienvenido a OP3D&trade;.</h1>
						<div className="text-center text-sm">
							No tenés una cuenta?{" "}
							<Link to="/registro" className="underline underline-offset-4">
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
							/>
						</div>
						<div className="grid gap-3">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								{...register("password")}
								placeholder="********"
								required
							/>
						</div>
						<Button type="submit" className="w-full">
							Iniciar sesión
						</Button>
					</div>
				</div>
			</form>
			<div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
				Al hacer clic en Continuar, usted acepta nuestros{" "}
				<a href="https://www.orthoplanner3d.com/terminos-y-condiciones">
					Términos y condiciones
				</a>{" "}
				y nuestra{" "}
				<a href="https://www.orthoplanner3d.com/politica-de-privacidad">
					Política de privacidad
				</a>
				.
			</div>
		</div>
	);
}
