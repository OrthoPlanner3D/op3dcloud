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
			patients: {
				Row: {
					case_status: string | null;
					created_at: string;
					declared_limitations: string;
					dental_restrictions: string;
					expiration: string | null;
					files: string;
					id: number;
					id_client: string;
					id_planner: string | null;
					last_name: string;
					name: string;
					notes: string | null;
					observations: string | null;
					observations_or_instructions: string;
					status: string | null;
					status_files: string | null;
					suggested_adminations_and_actions: string;
					sworn_declaration: boolean;
					treatment_approach: string;
					treatment_objective: string;
					type_of_plan: string;
				};
				Insert: {
					case_status?: string | null;
					created_at?: string;
					declared_limitations: string;
					dental_restrictions: string;
					expiration?: string | null;
					files: string;
					id?: never;
					id_client: string;
					id_planner?: string | null;
					last_name: string;
					name: string;
					notes?: string | null;
					observations?: string | null;
					observations_or_instructions: string;
					status?: string | null;
					status_files?: string | null;
					suggested_adminations_and_actions: string;
					sworn_declaration?: boolean;
					treatment_approach: string;
					treatment_objective: string;
					type_of_plan: string;
				};
				Update: {
					case_status?: string | null;
					created_at?: string;
					declared_limitations?: string;
					dental_restrictions?: string;
					expiration?: string | null;
					files?: string;
					id?: never;
					id_client?: string;
					id_planner?: string | null;
					last_name?: string;
					name?: string;
					notes?: string | null;
					observations?: string | null;
					observations_or_instructions?: string;
					status?: string | null;
					status_files?: string | null;
					suggested_adminations_and_actions?: string;
					sworn_declaration?: boolean;
					treatment_approach?: string;
					treatment_objective?: string;
					type_of_plan?: string;
				};
				Relationships: [
					{
						foreignKeyName: "patients_id_client_fkey";
						columns: ["id_client"];
						isOneToOne: false;
						referencedRelation: "view_clients";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "patients_id_client_fkey";
						columns: ["id_client"];
						isOneToOne: false;
						referencedRelation: "view_dashboard_admin";
						referencedColumns: ["client_id"];
					},
					{
						foreignKeyName: "patients_id_client_fkey";
						columns: ["id_client"];
						isOneToOne: false;
						referencedRelation: "view_dashboard_admin";
						referencedColumns: ["planner_id"];
					},
					{
						foreignKeyName: "patients_id_client_fkey";
						columns: ["id_client"];
						isOneToOne: false;
						referencedRelation: "view_planners";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "patients_id_planner_fkey";
						columns: ["id_planner"];
						isOneToOne: false;
						referencedRelation: "view_clients";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "patients_id_planner_fkey";
						columns: ["id_planner"];
						isOneToOne: false;
						referencedRelation: "view_dashboard_admin";
						referencedColumns: ["client_id"];
					},
					{
						foreignKeyName: "patients_id_planner_fkey";
						columns: ["id_planner"];
						isOneToOne: false;
						referencedRelation: "view_dashboard_admin";
						referencedColumns: ["planner_id"];
					},
					{
						foreignKeyName: "patients_id_planner_fkey";
						columns: ["id_planner"];
						isOneToOne: false;
						referencedRelation: "view_planners";
						referencedColumns: ["id"];
					},
				];
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
						foreignKeyName: "team_user_roles_id_role_fkey";
						columns: ["id_role"];
						isOneToOne: false;
						referencedRelation: "view_clients";
						referencedColumns: ["id_role"];
					},
					{
						foreignKeyName: "team_user_roles_id_role_fkey";
						columns: ["id_role"];
						isOneToOne: false;
						referencedRelation: "view_planners";
						referencedColumns: ["id_role"];
					},
					{
						foreignKeyName: "team_user_roles_id_user_fkey";
						columns: ["id_user"];
						isOneToOne: false;
						referencedRelation: "view_clients";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "team_user_roles_id_user_fkey";
						columns: ["id_user"];
						isOneToOne: false;
						referencedRelation: "view_dashboard_admin";
						referencedColumns: ["client_id"];
					},
					{
						foreignKeyName: "team_user_roles_id_user_fkey";
						columns: ["id_user"];
						isOneToOne: false;
						referencedRelation: "view_dashboard_admin";
						referencedColumns: ["planner_id"];
					},
					{
						foreignKeyName: "team_user_roles_id_user_fkey";
						columns: ["id_user"];
						isOneToOne: false;
						referencedRelation: "view_planners";
						referencedColumns: ["id"];
					},
				];
			};
		};
		Views: {
			view_clients: {
				Row: {
					case_status: string | null;
					country: string | null;
					created_at: string | null;
					credits: number | null;
					digital_model_zocalo_height: string | null;
					email: string | null;
					entity: string | null;
					experience_in_digital_planning: string | null;
					expiration: string | null;
					how_did_you_meet_us: string | null;
					id: string | null;
					id_role: number | null;
					logo: string | null;
					notes: string | null;
					phone: string | null;
					planner: string | null;
					reports_language: string | null;
					role: string | null;
					status: Database["op3dcloud"]["Enums"]["status"] | null;
					status_files: string | null;
					treatment_approach: string | null;
					user_type: string | null;
					username: string | null;
					work_modality: string | null;
				};
				Relationships: [];
			};
			view_dashboard_admin: {
				Row: {
					case_status: string | null;
					client_id: string | null;
					client_name: string | null;
					created_at: string | null;
					expiration: string | null;
					id: number | null;
					notes: string | null;
					patient_name: string | null;
					planner_id: string | null;
					planner_name: string | null;
					status: string | null;
					status_files: string | null;
				};
				Relationships: [];
			};
			view_planners: {
				Row: {
					case_status: string | null;
					country: string | null;
					created_at: string | null;
					credits: number | null;
					digital_model_zocalo_height: string | null;
					email: string | null;
					entity: string | null;
					experience_in_digital_planning: string | null;
					expiration: string | null;
					how_did_you_meet_us: string | null;
					id: string | null;
					id_role: number | null;
					logo: string | null;
					notes: string | null;
					phone: string | null;
					planner: string | null;
					reports_language: string | null;
					role: string | null;
					status: Database["op3dcloud"]["Enums"]["status"] | null;
					status_files: string | null;
					treatment_approach: string | null;
					user_type: string | null;
					username: string | null;
					work_modality: string | null;
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
