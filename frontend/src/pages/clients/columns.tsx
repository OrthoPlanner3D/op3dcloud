import type { ColumnDef } from "@tanstack/react-table";
import {
	ArrowUpDown,
	MoreHorizontal,
	PencilIcon,
	TrashIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { confirm, formatDate } from "@/lib/utils";
import type { ClientsViewRow } from "@/types/db/clients/clients";

export const columns: ColumnDef<ClientsViewRow>[] = [
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
			return formatDate(row.original.created_at);
		},
	},
	{
		accessorKey: "username",
		header: "Cliente",
	},
	{
		accessorKey: "status",
		header: "Estado",
	},
	{
		accessorKey: "expiration",
		header: "Vencimiento",
	},
	{
		accessorKey: "planner",
		header: "Planificador",
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
		id: "actions",
		cell: ({ row }) => {
			console.log(row.original.id);

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
						<DropdownMenuItem>
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
