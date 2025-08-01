import { use } from "react";
import { getClients } from "@/services/supabase/clients.service";
import { columns } from "./columns";
import { DataTable } from "./data-table";

const patientsPromise = getClients();

export default function Clients() {
	const data = use(patientsPromise);

	return (
		<div className="border-2 border-blue-500 border-dotted w-full min-h-[calc(100vh-2.75rem)] lg:h-full">
			<div className="container mx-auto">
				<DataTable columns={columns} data={data} />
			</div>
		</div>
	);
}
