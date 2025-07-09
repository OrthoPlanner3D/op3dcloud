import type { Database } from "../database.types";

export type ClientRow = Database["op3dcloud"]["Tables"]["patients"]["Row"];
export type ClientInsert =
	Database["op3dcloud"]["Tables"]["patients"]["Insert"];
export type ClientUpdate =
	Database["op3dcloud"]["Tables"]["patients"]["Update"];
