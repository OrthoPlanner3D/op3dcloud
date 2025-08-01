export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[];

export type Database = {
	op3dcloud: {
		Tables: {
			clients: {
				Row: {
					case_status: string;
					country: string;
					created_at: string;
					credits: number;
					digital_model_zocalo_height: string;
					entity: string;
					experience_in_digital_planning: string;
					expiration: string;
					how_did_you_meet_us: string;
					id: number;
					last_name: string;
					logo: string;
					name: string;
					notes: string;
					password: string;
					phone: string;
					planner: string;
					reports_language: string;
					status: string;
					status_files: string;
					treatment_approach: string;
					user_type: string;
					work_modality: string;
				};
				Insert: {
					case_status: string;
					country: string;
					created_at?: string;
					credits: number;
					digital_model_zocalo_height: string;
					entity: string;
					experience_in_digital_planning: string;
					expiration: string;
					how_did_you_meet_us: string;
					id?: never;
					last_name: string;
					logo: string;
					name: string;
					notes: string;
					password: string;
					phone: string;
					planner: string;
					reports_language: string;
					status: string;
					status_files: string;
					treatment_approach: string;
					user_type: string;
					work_modality: string;
				};
				Update: {
					case_status?: string;
					country?: string;
					created_at?: string;
					credits?: number;
					digital_model_zocalo_height?: string;
					entity?: string;
					experience_in_digital_planning?: string;
					expiration?: string;
					how_did_you_meet_us?: string;
					id?: never;
					last_name?: string;
					logo?: string;
					name?: string;
					notes?: string;
					password?: string;
					phone?: string;
					planner?: string;
					reports_language?: string;
					status?: string;
					status_files?: string;
					treatment_approach?: string;
					user_type?: string;
					work_modality?: string;
				};
				Relationships: [
					{
						foreignKeyName: "clients_planner_fkey";
						columns: ["planner"];
						isOneToOne: false;
						referencedRelation: "view_users";
						referencedColumns: ["id"];
					},
				];
			};
			patients: {
				Row: {
					created_at: string;
					declared_limitations: string;
					dental_restrictions: string;
					files: string;
					id: number;
					last_name: string;
					name: string;
					observations_or_instructions: string;
					suggested_adminations_and_actions: string;
					sworn_declaration: boolean;
					treatment_approach: string;
					treatment_objective: string;
					type_of_plan: string;
				};
				Insert: {
					created_at?: string;
					declared_limitations: string;
					dental_restrictions: string;
					files: string;
					id?: never;
					last_name: string;
					name: string;
					observations_or_instructions: string;
					suggested_adminations_and_actions: string;
					sworn_declaration?: boolean;
					treatment_approach: string;
					treatment_objective: string;
					type_of_plan: string;
				};
				Update: {
					created_at?: string;
					declared_limitations?: string;
					dental_restrictions?: string;
					files?: string;
					id?: never;
					last_name?: string;
					name?: string;
					observations_or_instructions?: string;
					suggested_adminations_and_actions?: string;
					sworn_declaration?: boolean;
					treatment_approach?: string;
					treatment_objective?: string;
					type_of_plan?: string;
				};
				Relationships: [];
			};
			roles: {
				Row: {
					created_at: string;
					id: number;
					name: string;
					updated_at: string | null;
				};
				Insert: {
					created_at?: string;
					id?: never;
					name: string;
					updated_at?: string | null;
				};
				Update: {
					created_at?: string;
					id?: never;
					name?: string;
					updated_at?: string | null;
				};
				Relationships: [];
			};
			user_has_role: {
				Row: {
					created_at: string;
					id: number;
					id_role: number;
					id_user: string;
					updated_at: string | null;
				};
				Insert: {
					created_at?: string;
					id?: never;
					id_role: number;
					id_user: string;
					updated_at?: string | null;
				};
				Update: {
					created_at?: string;
					id?: never;
					id_role?: number;
					id_user?: string;
					updated_at?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "team_user_roles_id_role_fkey";
						columns: ["id_role"];
						isOneToOne: false;
						referencedRelation: "roles";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "team_user_roles_id_user_fkey";
						columns: ["id_user"];
						isOneToOne: false;
						referencedRelation: "view_users";
						referencedColumns: ["id"];
					},
				];
			};
		};
		Views: {
			view_users: {
				Row: {
					credits: number | null;
					email: string | null;
					id: string | null;
					role: string | null;
					status: Database["op3dcloud"]["Enums"]["status"] | null;
					username: string | null;
				};
				Relationships: [];
			};
		};
		Functions: {
			assign_client_role: {
				Args: { p_id_client: string };
				Returns: string;
			};
			assign_planner_role: {
				Args: { p_id_planner: string };
				Returns: string;
			};
		};
		Enums: {
			status: "Active" | "Inactive";
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
	keyof Database,
	"public"
>];

export type Tables<
	DefaultSchemaTableNameOrOptions extends
		| keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
				DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
		: never = never,
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
			DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
			Row: infer R;
		}
		? R
		: never
	: DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
				DefaultSchema["Views"])
		? (DefaultSchema["Tables"] &
				DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
				Row: infer R;
			}
			? R
			: never
		: never;

export type TablesInsert<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema["Tables"]
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
		: never = never,
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Insert: infer I;
		}
		? I
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
		? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
				Insert: infer I;
			}
			? I
			: never
		: never;

export type TablesUpdate<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema["Tables"]
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
		: never = never,
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Update: infer U;
		}
		? U
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
		? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
				Update: infer U;
			}
			? U
			: never
		: never;

export type Enums<
	DefaultSchemaEnumNameOrOptions extends
		| keyof DefaultSchema["Enums"]
		| { schema: keyof DatabaseWithoutInternals },
	EnumName extends DefaultSchemaEnumNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
		: never = never,
> = DefaultSchemaEnumNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
	: DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
		? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
		: never;

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends
		| keyof DefaultSchema["CompositeTypes"]
		| { schema: keyof DatabaseWithoutInternals },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
		: never = never,
> = PublicCompositeTypeNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
		? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
		: never;

export const Constants = {
	op3dcloud: {
		Enums: {
			status: ["Active", "Inactive"],
		},
	},
} as const;
