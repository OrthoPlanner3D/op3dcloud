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
					created_at: string;
					declared_limitations: string | null;
					dental_restrictions: string | null;
					files: string | null;
					id: number;
					last_name: string | null;
					name: string;
					observations_or_instructions: string | null;
					suggested_adminations_and_actions: string | null;
					sworn_declaration: boolean;
					treatment_approach: string | null;
					treatment_objective: string | null;
					type_of_plan: string;
				};
				Insert: {
					created_at?: string;
					declared_limitations?: string | null;
					dental_restrictions?: string | null;
					files?: string | null;
					id?: number;
					last_name?: string | null;
					name: string;
					observations_or_instructions?: string | null;
					suggested_adminations_and_actions?: string | null;
					sworn_declaration?: boolean;
					treatment_approach?: string | null;
					treatment_objective?: string | null;
					type_of_plan: string;
				};
				Update: {
					created_at?: string;
					declared_limitations?: string | null;
					dental_restrictions?: string | null;
					files?: string | null;
					id?: number;
					last_name?: string | null;
					name?: string;
					observations_or_instructions?: string | null;
					suggested_adminations_and_actions?: string | null;
					sworn_declaration?: boolean;
					treatment_approach?: string | null;
					treatment_objective?: string | null;
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
			[_ in never]: never;
		};
		Enums: {
			status: "Active" | "Inactive";
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
	DefaultSchemaTableNameOrOptions extends
		| keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
		| { schema: keyof Database },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
				Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
		: never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
	? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
			Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
		| { schema: keyof Database },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
		: never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
	? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
		| { schema: keyof Database },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
		: never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
	? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
		| { schema: keyof Database },
	EnumName extends DefaultSchemaEnumNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
		: never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
	? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
	: DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
		? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
		: never;

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends
		| keyof DefaultSchema["CompositeTypes"]
		| { schema: keyof Database },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
		: never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
	? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
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
