import { supabase, supabaseAdmin } from "@/config/supabase.config";

const BUCKET = "patient-files";

export async function uploadFile(file: File): Promise<string> {
	const ext = file.name.split(".").pop() ?? "";
	const path = `${crypto.randomUUID()}.${ext}`;

	const { error } = await supabase.storage.from(BUCKET).upload(path, file);

	if (error) {
		console.error("Error uploading file:", error.message);
		throw error;
	}

	return path;
}

export async function uploadFiles(files: File[]): Promise<string[]> {
	if (files.length === 0) return [];
	return Promise.all(files.map(uploadFile));
}

export async function uploadFileAdmin(file: File): Promise<string> {
	const ext = file.name.split(".").pop() ?? "";
	const path = `${crypto.randomUUID()}.${ext}`;

	const { error } = await supabaseAdmin.storage
		.from(BUCKET)
		.upload(path, file);

	if (error) {
		console.error("Error uploading file (admin):", error.message);
		throw error;
	}

	return path;
}

export async function uploadFilesAdmin(files: File[]): Promise<string[]> {
	if (files.length === 0) return [];
	return Promise.all(files.map(uploadFileAdmin));
}

export async function getSignedUrl(path: string): Promise<string> {
	const { data, error } = await supabase.storage
		.from(BUCKET)
		.createSignedUrl(path, 3600);

	if (error) {
		console.error("Error getting signed URL:", error.message);
		throw error;
	}

	return data.signedUrl;
}

export async function deleteFile(path: string): Promise<void> {
	const { error } = await supabase.storage.from(BUCKET).remove([path]);

	if (error) {
		console.error("Error deleting file:", error.message);
		throw error;
	}
}

// ─── Treatment Planning Storage ───────────────────────────────────────────────

const TREATMENT_BUCKET = "treatment-files";

export async function uploadTreatmentFile(file: File): Promise<string> {
	const ext = file.name.split(".").pop() ?? "";
	const path = `${crypto.randomUUID()}.${ext}`;

	const { error } = await supabase.storage
		.from(TREATMENT_BUCKET)
		.upload(path, file);

	if (error) {
		console.error("Error uploading treatment file:", error.message);
		throw error;
	}

	return path;
}

export function getTreatmentFilePublicUrl(path: string): string {
	const { data } = supabase.storage.from(TREATMENT_BUCKET).getPublicUrl(path);
	return data.publicUrl;
}

export async function deleteTreatmentFile(path: string): Promise<void> {
	const { error } = await supabase.storage
		.from(TREATMENT_BUCKET)
		.remove([path]);

	if (error) {
		console.error("Error deleting treatment file:", error.message);
		throw error;
	}
}

// ─── Client Storage ───────────────────────────────────────────────────────────

const CLIENT_BUCKET = "client-files";

export async function uploadClientFile(file: File): Promise<string> {
	const ext = file.name.split(".").pop() ?? "";
	const path = `${crypto.randomUUID()}.${ext}`;

	const { error } = await supabase.storage
		.from(CLIENT_BUCKET)
		.upload(path, file);

	if (error) {
		console.error("Error uploading client file:", error.message);
		throw error;
	}

	return path;
}

export function getClientFilePublicUrl(path: string): string {
	const { data } = supabase.storage.from(CLIENT_BUCKET).getPublicUrl(path);
	return data.publicUrl;
}

// ─── Patient Models Storage ───────────────────────────────────────────────────

const PATIENT_MODELS_BUCKET = "patient-models";

/**
 * Los GLB se nombran `<paso>_<Arco>[...].glb`. Ordenar por nombre a secas deja
 * `10_` antes que `2_`, así que se ordena por el número inicial y se desempata
 * alfabéticamente (deja `3_Maxillary` antes que `3_Maxillary_with_attachments`).
 */
function compareModelNames(a: string, b: string): number {
	const stepA = Number.parseInt(a, 10);
	const stepB = Number.parseInt(b, 10);
	const hasStepA = !Number.isNaN(stepA);
	const hasStepB = !Number.isNaN(stepB);

	if (hasStepA && hasStepB && stepA !== stepB) return stepA - stepB;
	if (hasStepA !== hasStepB) return hasStepA ? -1 : 1;

	return a.localeCompare(b);
}

/**
 * Rutas completas de los GLB de un caso. La tabla `patient_models` sólo guarda
 * el prefijo: los archivos hay que descubrirlos listando el bucket.
 *
 * El `limit` es explícito porque el default de Supabase es 100 y un caso largo
 * (un GLB por paso y por arco) lo supera sin avisar.
 */
export async function listPatientModelFiles(prefix: string): Promise<string[]> {
	const { data, error } = await supabase.storage
		.from(PATIENT_MODELS_BUCKET)
		.list(prefix, { limit: 1000 });

	if (error) {
		console.error("Error listing patient model files:", error.message);
		throw error;
	}

	return data
		.map((entry) => entry.name)
		.filter((name) => name.toLowerCase().endsWith(".glb"))
		.sort(compareModelNames)
		.map((name) => `${prefix}${name}`);
}

/**
 * URLs firmadas de un caso completo en un solo request. El bucket es privado,
 * así que `getPublicUrl` no sirve acá.
 */
export async function getPatientModelSignedUrls(
	paths: string[],
): Promise<Record<string, string>> {
	if (paths.length === 0) return {};

	const { data, error } = await supabase.storage
		.from(PATIENT_MODELS_BUCKET)
		.createSignedUrls(paths, 3600);

	if (error) {
		console.error("Error signing patient model URLs:", error.message);
		throw error;
	}

	const urls: Record<string, string> = {};
	for (const item of data) {
		if (item.path && item.signedUrl) urls[item.path] = item.signedUrl;
	}

	return urls;
}
