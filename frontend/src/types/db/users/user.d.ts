import type { Database } from "../database.types";

export type UserRow = Database["op3dcloud"]["Views"]["view_users"]["Row"];

/**
 * Tipos de roles disponibles en el sistema
 */
export type UserRole = "client" | "planner" | "admin";
