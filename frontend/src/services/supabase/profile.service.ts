import { supabase } from "@/config/supabase.config";
import { DataBaseError } from "@/errors/dataBaseError";

interface UserMetadata {
	name?: string;
	last_name?: string;
	phone?: string;
	country?: string;
	entity?: string;
	user_type?: string;
	logo?: string;
	experience_in_digital_planning?: string;
	digital_model_zocalo_height?: string;
	treatment_approach?: string;
	work_modality?: string;
	reports_language?: string;
	how_did_you_meet_us?: string;
	credits?: number;
	status?: string;
	planner?: string;
	status_files?: string;
	case_status?: string;
	notes?: string;
}

export async function updateUserProfile(
	metadata: Partial<UserMetadata>,
): Promise<void> {
	const { error } = await supabase.auth.updateUser({
		data: metadata,
	});

	if (error) {
		throw new DataBaseError(error.message);
	}
}

export async function updateUserPassword(newPassword: string): Promise<void> {
	const { error } = await supabase.auth.updateUser({
		password: newPassword,
	});

	if (error) {
		throw new DataBaseError(error.message);
	}
}
