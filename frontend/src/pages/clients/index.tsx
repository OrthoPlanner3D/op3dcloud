import { use } from "react";
import { getDashboardAdmin } from "@/services/supabase/dashboard-admin.service";
import { columns } from "./columns";
import ModalEditClient from "./components/modalEditClient";
import { DataTable } from "./data-table";

const dashboardAdminPromise = getDashboardAdmin();

export default function Clients() {
	const data = use(dashboardAdminPromise);

	return (
		<div className="w-full min-h-[calc(100vh-2.75rem)] lg:h-full">
			<div className="container mx-auto">
				<DataTable columns={columns} data={data} />
				<ModalEditClient />
			</div>
		</div>
	);
}
