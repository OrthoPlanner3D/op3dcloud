import type { ColumnDef } from "@tanstack/react-table";
import {
	ArrowUpDown,
	CalendarClockIcon,
	CalendarIcon,
	MoreHorizontal,
	PencilIcon,
	TrashIcon,
	UserIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { useUserRole } from "@/hooks/useUserRole";
import { confirm, formatDate } from "@/lib/utils";
import { updatePatientPlanningEnabled } from "@/services/supabase/patients.service";
import type { DashboardAdminViewRow } from "@/types/db/dashboard-admin/dashboard-admin";
import useEditClientModalStore from "./state/stores/useEditClientModalStore";

// Extender el tipo TableMeta para incluir updateData
declare module "@tanstack/react-table" {
	// biome-ignore lint/correctness/noUnusedVariables: Required for type augmentation
	interface TableMeta<TData> {
		updateData?: (
			rowIndex: number,
			columnId: string,
			value: unknown,
		) => void;
	}
}

export const createColumns = (): ColumnDef<DashboardAdminViewRow>[] => [
	{
		accessorKey: "id",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === "asc")
					}
				>
					ID
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: "created_at",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === "asc")
					}
				>
					Ingreso
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			return (
				<Badge variant="secondary">
					<CalendarIcon
						className="-ms-0.5 opacity-60 capitalize"
						size={12}
						aria-hidden="true"
					/>
					{formatDate(row.original.created_at)}
				</Badge>
			);
		},
	},
	{
		accessorKey: "client_name",
		header: "Cliente",
	},
	{
		accessorKey: "patient_name",
		header: "Paciente",
	},
	{
		accessorKey: "status",
		header: "Estado",
	},
	{
		accessorKey: "expiration",
		header: "Vencimiento",
		cell: ({ row }) => {
			return (
				<Badge variant="secondary">
					<CalendarClockIcon
						className="-ms-0.5 opacity-60 capitalize"
						size={12}
						aria-hidden="true"
					/>
					{formatDate(row.original.expiration)}
				</Badge>
			);
		},
	},
	{
		accessorKey: "planner_name",
		header: "Planificador",
		cell: ({ row }) => {
			return (
				<Badge variant="secondary">
					<UserIcon
						className="-ms-0.5 opacity-60 capitalize"
						size={12}
						aria-hidden="true"
					/>
					{row.original.planner_name}
				</Badge>
			);
		},
	},
	{
		accessorKey: "status_files",
		header: "Archivos",
	},
	{
		accessorKey: "case_status",
		header: "Estado del Caso",
	},
	{
		accessorKey: "notes",
		header: "Notas",
	},
	{
		id: "planning_enabled",
		header: "Planificación",
		cell: ({ row, table }) => {
			const { role } = useUserRole();
			const canModify = role === "admin" || role === "planner";

			if (!canModify) {
				return (
					<Badge
						variant={
							row.original.planning_enabled
								? "default"
								: "secondary"
						}
					>
						{row.original.planning_enabled
							? "Habilitada"
							: "Deshabilitada"}
					</Badge>
				);
			}

			const handleToggle = async (checked: boolean) => {
				if (!row.original.id) return;

				// Optimistic update - actualizar inmediatamente la UI usando el método de la tabla
				const originalValue = row.original.planning_enabled;

				// Actualizar el estado de la tabla para que React detecte el cambio
				table.options.meta?.updateData?.(
					row.index,
					"planning_enabled",
					checked,
				);

				try {
					await updatePatientPlanningEnabled(
						row.original.id,
						checked,
					);
				} catch (error) {
					// Revertir en caso de error
					table.options.meta?.updateData?.(
						row.index,
						"planning_enabled",
						originalValue,
					);
					console.error("Error updating planning enabled:", error);
					// Opcional: mostrar notificación de error al usuario
				}
			};

			return (
				<div className="flex items-center space-x-2">
					<Switch
						checked={row.original.planning_enabled ?? false}
						onCheckedChange={handleToggle}
						aria-label="Toggle planning enabled"
					/>
					<span className="text-sm text-muted-foreground">
						{row.original.planning_enabled
							? "Habilitada"
							: "Deshabilitada"}
					</span>
				</div>
			);
		},
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const open = useEditClientModalStore((state) => state.open);
			const setId = useEditClientModalStore((state) => state.setId);

			if (!row.original.id) return null;

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Acciones</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={() => {
								if (!row.original.id) return;

								setId(row.original.id);
								open();
							}}
						>
							<PencilIcon className="h-4 w-4 mr-2" />
							Editar
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() =>
								confirm(
									"¿Estás seguro de querer eliminar este cliente?",
								)
							}
						>
							<TrashIcon className="h-4 w-4 mr-2 stroke-red-500" />
							Eliminar
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];

export const columns = createColumns();
