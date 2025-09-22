import type { Database } from "../database.types";

/**
 * Tipos de roles disponibles en el sistema
 */
export type UserRole = "client" | "planner" | "admin";

/**
 * Tipo de estado del usuario
 */
export type UserStatus = Database["op3dcloud"]["Enums"]["status"];

/**
 * Tipo base para filas de usuarios desde las views
 */
export type UserRow = Database["op3dcloud"]["Views"]["view_users"]["Row"];

/**
 * Tipo para usuarios clientes desde view_clients
 */
export type ClientUserRow = Database["op3dcloud"]["Views"]["view_clients"]["Row"];

/**
 * Tipo para usuarios planificadores desde view_planners  
 */
export type PlannerUserRow = Database["op3dcloud"]["Views"]["view_planners"]["Row"];

/**
 * Interfaz unificada para usuarios con información completa
 * Combina datos de auth.users + metadata + rol
 */
export interface User {
	// Campos básicos de identificación
	id: string;
	email: string;
	username: string;
	role: UserRole;
	
	// Campos de estado y sistema
	status?: UserStatus | null;
	created_at?: string | null;
	expiration?: string | null;
	
	// Campos de negocio
	credits?: number | null;
	id_role?: number | null;
	
	// Campos de metadata del usuario
	phone?: string | null;
	country?: string | null;
	entity?: string | null;
	user_type?: string | null;
	logo?: string | null;
	
	// Campos específicos del dominio médico
	experience_in_digital_planning?: string | null;
	digital_model_zocalo_height?: string | null;
	treatment_approach?: string | null;
	work_modality?: string | null;
	reports_language?: string | null;
	how_did_you_meet_us?: string | null;
	
	// Campos de planificación
	planner?: string | null;
	status_files?: string | null;
	case_status?: string | null;
	notes?: string | null;
}

/**
 * Tipo para crear usuarios (campos requeridos)
 */
export interface CreateUser {
	id: string;
	email: string;
	username: string;
	role: UserRole;
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
}

/**
 * Tipo para actualizar usuarios (campos opcionales)
 */
export interface UpdateUser {
	email?: string;
	username?: string;
	role?: UserRole;
	status?: UserStatus;
	credits?: number;
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
	planner?: string;
	status_files?: string;
	case_status?: string;
	notes?: string;
}

/**
 * Interfaz para usuario con información de rol (compatibilidad con código existente)
 * @deprecated Usar User en su lugar
 */
export interface UserWithRole {
	id: string;
	role: UserRole;
	email: string;
	username: string;
}

/**
 * Tipo para usuarios en el contexto de autenticación
 */
export interface AuthUser {
	id: string;
	email: string;
	username: string;
	role?: UserRole;
	access_token?: string;
}

/**
 * Tipo para respuesta de autenticación
 */
export interface AuthResponse {
	user: AuthUser | null;
	error?: string;
}