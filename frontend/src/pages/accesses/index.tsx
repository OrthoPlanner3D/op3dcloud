import { ArrowLeftIcon, SearchIcon, UsersIcon } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

const planners = [
	{
		id: 1,
		name: "Planner 1",
		lastname: "Planner 1",
		email: "planner1@example.com",
		isActive: true,
	},
	{
		id: 2,
		name: "Planner 2",
		lastname: "Planner 2",
		email: "planner2@example.com",
		isActive: false,
	},
	{
		id: 3,
		name: "Planner 3",
		lastname: "Planner 3",
		email: "planner3@example.com",
		isActive: true,
	},
	{
		id: 4,
		name: "Planner 4",
		lastname: "Planner 4",
		email: "planner4@example.com",
		isActive: false,
	},
	{
		id: 5,
		name: "Planner 5",
		lastname: "Planner 5",
		email: "planner5@example.com",
		isActive: true,
	},
];

export default function Accesses() {
	const [searchTerm, setSearchTerm] = useState("");
	const [plannersState, setPlannersState] = useState(planners);

	const filteredPlanners = plannersState.filter(
		(planner) =>
			planner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			planner.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
			planner.email.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	const toggleUserStatus = (id: number) => {
		setPlannersState((prev) =>
			prev.map((planner) =>
				planner.id === id
					? { ...planner, isActive: !planner.isActive }
					: planner,
			),
		);
	};

	return (
		<div>
			<Button variant="ghost" asChild>
				<Link to="/">
					<ArrowLeftIcon />
				</Link>
			</Button>

			<div className="container mx-auto">
				<div className="space-y-8">
					<div className="space-y-2">
						<h1 className="text-3xl font-bold tracking-tight">
							Gestión de planificadores
						</h1>
						<p className="text-muted-foreground">
							Busca y administra el estado de los planificadores
							del sistema
						</p>
					</div>

					<div className="space-y-4 max-w-lg mx-auto">
						<div className="flex items-center space-x-2">
							<div className="relative flex-1">
								<SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
								<Input
									placeholder="Buscar planificadores..."
									value={searchTerm}
									onChange={(e) =>
										setSearchTerm(e.target.value)
									}
									className="pl-8"
								/>
							</div>
						</div>

						<div className="space-y-0">
							{filteredPlanners.map((planner) => (
								<div
									key={planner.id}
									className="flex items-center justify-between py-4 border-b border-border/40 last:border-b-0"
								>
									<div className="flex items-center space-x-4">
										<div className="space-y-1">
											<h3 className="font-semibold text-base leading-none">
												{planner.name}{" "}
												{planner.lastname}
											</h3>
											<p className="text-sm text-muted-foreground">
												{planner.email}
											</p>
											<div className="flex items-center space-x-1 text-xs">
												<div className="relative flex items-center justify-center">
													{/* Outer glow circle */}
													<div
														className={`h-3 w-3 rounded-full ${planner.isActive ? "bg-green-500/30" : "bg-red-500/30"}`}
													/>
													{/* Inner solid dot */}
													<div
														className={`absolute h-1.5 w-1.5 rounded-full ${planner.isActive ? "bg-green-500" : "bg-red-500"}`}
													/>
												</div>
												<span
													className={
														planner.isActive
															? "text-green-600"
															: "text-red-600"
													}
												>
													{planner.isActive
														? "Activo"
														: "Inactivo"}
												</span>
											</div>
										</div>
									</div>

									<div className="flex items-center space-x-4">
										<Switch
											checked={planner.isActive}
											onCheckedChange={() =>
												toggleUserStatus(planner.id)
											}
										/>
									</div>
								</div>
							))}

							{filteredPlanners.length === 0 && (
								<div className="flex flex-col items-center justify-center py-16">
									<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
										<UsersIcon className="h-6 w-6 text-muted-foreground" />
									</div>
									<div className="mt-4 text-center">
										<h3 className="text-sm font-semibold">
											No se encontraron planificadores
										</h3>
										<p className="mt-1 text-sm text-muted-foreground">
											Intenta ajustar tu búsqueda o
											filtros para encontrar lo que
											buscas.
										</p>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
