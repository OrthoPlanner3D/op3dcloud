import type { Database } from "../database.types";

export type PlanRow = Database["op3dcloud"]["Tables"]["plans"]["Row"];

export type CreditPaymentRow =
	Database["op3dcloud"]["Tables"]["credit_payments"]["Row"];

export type CreditPaymentInsert =
	Database["op3dcloud"]["Tables"]["credit_payments"]["Insert"];
