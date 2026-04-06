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
