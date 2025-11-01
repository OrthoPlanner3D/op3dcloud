import type { Database } from "../database.types";

export type PatientsRow = Database["op3dcloud"]["Tables"]["patients"]["Row"];
export type PatientsInsert =
	Database["op3dcloud"]["Tables"]["patients"]["Insert"];
export type PatientsUpdate =
	Database["op3dcloud"]["Tables"]["patients"]["Update"];
