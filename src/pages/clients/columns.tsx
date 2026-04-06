import type { ColumnDef } from "@tanstack/react-table";
import {
	ArrowUpDown,
	CalendarClockIcon,
	CalendarIcon,
	MoreHorizontal,
	PencilIcon,
	TrashIcon,
} from "lucide-react";
import { toast } from "sonner";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUserRole } from "@/hooks/useUserRole";
import { confirm, formatDate } from "@/lib/utils";
import { updatePatient } from "@/services/supabase/dashboard-admin.service";
import { updatePatientPlanningEnabled } from "@/services/supabase/patients.service";
import type { DashboardAdminViewRow } from "@/types/db/dashboard-admin/dashboard-admin";
import useEditClientModalStore from "./state/stores/useEditClientModalStore";

// Extender el tipo TableMeta para incluir updateData y planners
declare module "@tanstack/react-table" {
	// biome-ignore lint/correctness/noUnusedVariables: Required for type augmentation
	interface TableMeta<TData> {
		updateData?: (
			rowIndex: number,
			columnId: string,
			value: unknown,
		) => void;
		planners?: { id: string | null; username: string | null }[];
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
		accessorKey: "case_status",
		header: "Estado",
	},
	{
		accessorKey: "expiration",
		header: "Vencimiento",
		cell: ({ row }) => {
			const expiration = row.original.expiration;
			const today = new Date();
			today.setHours(0, 0, 0, 0);
			const expDate = new Date(expiration ?? "");
			expDate.setHours(0, 0, 0, 0);
			const diffDays = Math.ceil(
				(expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
			);

			let badgeClass = "";
			if (diffDays < 0) {
				badgeClass =
					"bg-red-600 text-white hover:bg-red-600 border-red-600";
			} else if (diffDays === 0) {
				badgeClass =
					"bg-red-500 text-white hover:bg-red-500 border-red-500";
			} else if (diffDays <= 3) {
				badgeClass =
					"bg-green-500 text-white hover:bg-green-500 border-green-500";
			} else if (diffDays <= 6) {
				badgeClass =
					"bg-yellow-400 text-black hover:bg-yellow-400 border-yellow-400";
			}

			return (
				<Badge variant="secondary" className={badgeClass}>
					<CalendarClockIcon
						className="-ms-0.5 opacity-60 capitalize"
						size={12}
						aria-hidden="true"
					/>
					{formatDate(expiration)}
				</Badge>
			);
		},
	},
	{
		accessorKey: "planner_name",
		header: "Planificador",
		cell: ({ row, table }) => {
			const planners = table.options.meta?.planners ?? [];

			const handleChange = async (plannerId: string) => {
				if (!row.original.id) return;

				const prevPlannerId = row.original.planner_id;
				const prevPlannerName = row.original.planner_name;
				const selected = planners.find((p) => p.id === plannerId);

				table.options.meta?.updateData?.(
					row.index,
					"planner_id",
					plannerId,
				);
				table.options.meta?.updateData?.(
					row.index,
					"planner_name",
					selected?.username ?? null,
				);

				try {
					await updatePatient(String(row.original.id), {
						id_planner: plannerId || null,
					});
					toast.success("Planificador actualizado");
				} catch (error) {
					table.options.meta?.updateData?.(
						row.index,
						"planner_id",
						prevPlannerId,
					);
					table.options.meta?.updateData?.(
						row.index,
						"planner_name",
						prevPlannerName,
					);
					console.error("Error updating planner:", error);
					toast.error("Error al actualizar el planificador");
				}
			};

			return (
				<Select
					value={row.original.planner_id ?? ""}
					onValueChange={handleChange}
				>
					<SelectTrigger className="w-40 h-7 text-xs">
						<SelectValue placeholder="Sin asignar" />
					</SelectTrigger>
					<SelectContent>
						{planners.map((planner) => (
							<SelectItem
								key={planner.id}
								value={planner.id ?? ""}
								className="text-xs"
							>
								{planner.username}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			);
		},
	},
	{
		accessorKey: "status_files",
		header: "Archivos",
		cell: ({ row }) => {
			const values = row.original.status_files;
			if (!values?.length) return null;
			return (
				<div className="flex flex-wrap gap-1">
					{values.map((v) => (
						<Badge key={v} variant="secondary">
							{v}
						</Badge>
					))}
				</div>
			);
		},
	},
	{
		accessorKey: "case_status",
		header: "Estado del Caso",
		cell: ({ row }) => {
			const values = row.original.case_status;
			if (!values?.length) return null;
			return (
				<div className="flex flex-wrap gap-1">
					{values.map((v) => (
						<Badge key={v} variant="secondary">
							{v}
						</Badge>
					))}
				</div>
			);
		},
	},
	{
		accessorKey: "notes",
		header: "Notas",
		cell: ({ row }) => {
			const notes = row.original.notes;
			if (!notes) return null;
			return (
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<span className="block max-w-[180px] truncate cursor-default text-sm">
								{notes}
							</span>
						</TooltipTrigger>
						<TooltipContent className="max-w-xs whitespace-pre-wrap">
							{notes}
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			);
		},
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
