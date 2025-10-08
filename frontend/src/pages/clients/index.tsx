import { useCallback, useEffect, useState } from "react";
import { getDashboardAdmin } from "@/services/supabase/dashboard-admin.service";
import type { DashboardAdminViewRow } from "@/types/db/dashboard-admin/dashboard-admin";
import { createColumns } from "./columns";
import ModalEditClient from "./components/modalEditClient";
import { DataTable } from "./data-table";

export default function Clients() {
	const [data, setData] = useState<DashboardAdminViewRow[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const fetchData = useCallback(async () => {
		try {
			setIsLoading(true);
			const dashboardData = await getDashboardAdmin();
			setData(dashboardData);
		} catch (error) {
			console.error("Error fetching dashboard data:", error);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const handleClientUpdated = () => {
		fetchData();
	};

	if (isLoading) {
		return (
			<div className="w-full min-h-[calc(100vh-2.75rem)] lg:h-full">
				<div className="container mx-auto flex items-center justify-center h-full">
					<div className="text-center">
						<div className="text-sm text-muted-foreground">
							Cargando datos...
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="w-full min-h-[calc(100vh-2.75rem)] lg:h-full">
			<div className="container mx-auto">
				<DataTable
					columns={createColumns()}
					data={data}
					meta={{
						updateData: (
							rowIndex: number,
							columnId: string,
							value: any,
						) => {
							setData((prev) =>
								prev.map((row, index) =>
									index === rowIndex
										? { ...row, [columnId]: value }
										: row,
								),
							);
						},
					}}
				/>
				<ModalEditClient onClientUpdated={handleClientUpdated} />
			</div>
		</div>
	);
}
