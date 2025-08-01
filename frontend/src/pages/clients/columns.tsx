import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PatientsRow } from "@/types/db/patients/patients";

export const columns: ColumnDef<PatientsRow>[] = [
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
		accessorKey: "name",
		header: "Nombre",
	},
	{
		accessorKey: "last_name",
		header: "Apellido",
	},
	{
		accessorKey: "type_of_plan",
		header: "Tipo de Plan",
	},
	{
		accessorKey: "treatment_approach",
		header: "Enfoque de Tratamiento",
	},
	{
		accessorKey: "treatment_objective",
		header: "Objetivo de Tratamiento",
	},
	{
		accessorKey: "dental_restrictions",
		header: "Restricciones Dentales",
	},
	{
		accessorKey: "declared_limitations",
		header: "Limitaciones Declaradas",
	},
	{
		accessorKey: "suggested_adminations_and_actions",
		header: "Administraciones y Acciones Sugeridas",
	},
	{
		accessorKey: "observations_or_instructions",
		header: "Observaciones o Instrucciones",
	},
	{
		accessorKey: "sworn_declaration",
		header: "Declaración Jurada",
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
					Fecha de Creación
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const date = new Date(row.getValue("created_at"));
			return date.toLocaleDateString("es-ES");
		},
	},
];
