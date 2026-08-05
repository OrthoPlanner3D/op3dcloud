const WHATSAPP_NUMBER = "5491178898573";
const DEFAULT_MESSAGE = "¡Hola! Quiero más información sobre OrthoPlanner3D.";

const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;

export default function WhatsAppButton() {
	return (
		<a
			href={WHATSAPP_URL}
			target="_blank"
			rel="noreferrer"
			aria-label="Chatear por WhatsApp"
			title="Chatear por WhatsApp"
			className="fixed right-6 bottom-6 z-50 flex size-14 items-center justify-center rounded-full bg-black text-white shadow-lg transition-transform hover:scale-105 hover:bg-neutral-800"
		>
			<svg
				viewBox="0 0 24 24"
				className="size-7"
				fill="currentColor"
				aria-hidden="true"
			>
				<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
				<path d="M12.05 2C6.578 2 2.13 6.447 2.13 11.92c0 1.876.52 3.632 1.427 5.13L2 22l5.09-1.526a9.86 9.86 0 0 0 4.96 1.34h.005c5.472 0 9.919-4.447 9.919-9.919C21.974 6.447 17.527 2 12.05 2zm0 18.17h-.004a8.21 8.21 0 0 1-4.19-1.148l-.3-.179-3.017.905.905-2.94-.196-.313a8.19 8.19 0 0 1-1.264-4.375c0-4.535 3.69-8.226 8.226-8.226 4.535 0 8.225 3.69 8.225 8.226 0 4.535-3.69 8.226-8.225 8.226z" />
			</svg>
			<span className="sr-only">Chatear por WhatsApp</span>
		</a>
	);
}
