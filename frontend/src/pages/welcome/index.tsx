import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { useWelcomeCheck } from "@/hooks/useWelcomeCheck";

const greetings = [
	{ text: "¡Bienvenido!", language: "Español" },
	{ text: "Welcome", language: "English" },
	{ text: "Bienvenue", language: "Français" },
	{ text: "Willkommen", language: "Deutsch" },
	{ text: "Benvenuto", language: "Italiano" },
	{ text: "Bem-vindo", language: "Português" },
	{ text: "ようこそ", language: "日本語" },
];

export default function WelcomePage() {
	const [isLoading, setIsLoading] = useState(false);
	const [currentSlide, setCurrentSlide] = useState(0);
	const [isTransitioning, setIsTransitioning] = useState(false);
	const navigate = useNavigate();
	const { markWelcomeAsSeen } = useWelcomeCheck();

	// Auto-advance slides
	useEffect(() => {
		const interval = setInterval(() => {
			setIsTransitioning(true);
			setTimeout(() => {
				setCurrentSlide((prev) => (prev + 1) % greetings.length);
				setIsTransitioning(false);
			}, 800);
		}, 2000);

		return () => clearInterval(interval);
	}, []);

	const handleGetStarted = async () => {
		setIsLoading(true);

		try {
			const success = await markWelcomeAsSeen();

			if (success) {
				navigate("/", { replace: true });
			} else {
				console.error("No se pudo marcar la bienvenida como vista");
				setIsLoading(false);
			}
		} catch (error) {
			console.error("Error:", error);
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden">
			{/* Subtle background elements */}
			<div className="absolute inset-0">
				<div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gray-100/30 rounded-full blur-3xl" />
				<div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gray-100/20 rounded-full blur-3xl" />
			</div>

			<div className="relative z-10 text-center max-w-5xl mx-auto px-8 w-full">
				{/* Main greeting */}
				<div className="mb-16">
					<h1
						className={`text-7xl md:text-8xl lg:text-9xl font-thin text-gray-900 transition-all duration-500 ease-in-out ${
							isTransitioning
								? "opacity-0 scale-95"
								: "opacity-100 scale-100"
						}`}
						style={{
							fontFamily:
								"SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif",
							fontWeight: 100,
							letterSpacing: "-0.02em",
						}}
					>
						{greetings[currentSlide].text}
					</h1>

					<p
						className={`text-lg md:text-xl text-gray-500 mt-4 md:mt-6 transition-all duration-500 ease-in-out ${
							isTransitioning
								? "opacity-0 translate-y-2"
								: "opacity-100 translate-y-0"
						}`}
						style={{
							fontFamily:
								"SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif",
							fontWeight: 300,
						}}
					>
						{greetings[currentSlide].language}
					</p>
				</div>

				{/* Welcome message */}
				<div className="mb-16">
					<h2
						className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 mb-6 md:mb-8 transition-all duration-700 ease-in-out"
						style={{
							fontFamily:
								"SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif",
							fontWeight: 300,
							letterSpacing: "-0.01em",
						}}
					>
						Bienvenido a{" "}
						<span className="font-medium text-gray-900">
							OP3D Cloud
						</span>
					</h2>

					<p
						className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed px-4"
						style={{
							fontFamily:
								"SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif",
							fontWeight: 400,
						}}
					>
						Tu plataforma integral para planificación de
						tratamientos dentales en 3D. Comienza a crear
						experiencias digitales extraordinarias.
					</p>
				</div>

				{/* Get Started button */}
				<div className="space-y-6">
					<Button
						onClick={handleGetStarted}
						disabled={isLoading}
						size="lg"
						className="bg-gray-900 text-white hover:bg-gray-800 px-16 py-5 text-lg font-medium rounded-full transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
						style={{
							fontFamily:
								"SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif",
							fontWeight: 500,
						}}
					>
						{isLoading ? (
							<div className="flex items-center space-x-3">
								<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
								<span>Preparando...</span>
							</div>
						) : (
							"Comenzar"
						)}
					</Button>

					<p
						className="text-sm text-gray-400"
						style={{
							fontFamily:
								"SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif",
						}}
					>
						Esta experiencia solo aparece la primera vez que inicias
						sesión
					</p>
				</div>
			</div>
		</div>
	);
}
