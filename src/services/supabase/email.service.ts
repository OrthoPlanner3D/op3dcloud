import { supabase } from "@/config/supabase.config";

export async function sendPlanningEnabledEmail(
	clientId: string | null,
	patientName: string,
): Promise<void> {
	let email: string | null = null;

	if (clientId) {
		const { data: client, error } = await supabase
			.from("view_clients")
			.select("email")
			.eq("id", clientId)
			.single();

		if (error || !client?.email) {
			throw new Error("No se pudo obtener el email del cliente");
		}

		email = client.email;
	}

	console.log("Enviando email a:", email, "| Paciente:", patientName);

	const { error: fnError } = await supabase.functions.invoke(
		"email-welcome",
		{
			body: {
				to: email,
				patientName,
			},
		},
	);

	if (fnError) throw fnError;
}
