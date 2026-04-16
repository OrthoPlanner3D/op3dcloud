// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
console.log("Hello from Functions!")

Deno.serve(async (req) => {
	const { to, patientName } = await req.json();

	const res = await fetch("https://api.resend.com/emails", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${RESEND_API_KEY}`,
		},
		body: JSON.stringify({
			from: "team@op3dcloud.com",
			to: [to],
			template: {
				id: "planificacin-habilitada",
				variables: {
					patient_name: patientName,
				},
			},
		}),
	});

	const data = await res.json();

	return new Response(JSON.stringify(data), {
		status: res.status,
		headers: {
			"Content-Type": "application/json",
		},
	});
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i -X POST 'http://127.0.0.1:54321/functions/v1/email-welcome' -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS
  1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' -H 'Content-Type: application/json' -d                   
  '{"patientName":"Hernán arica","to":"hernan.arica96@gmail.com"}'

*/
