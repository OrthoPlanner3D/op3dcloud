import {
	ArrowLeftIcon,
	ClipboardListIcon,
	FileTextIcon,
	PlusIcon,
	EditIcon,
	TrashIcon,
	UsersIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import SearchInput from "@/components/search-input";
import RoleInfo from "@/components/RoleInfo";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDate } from "@/lib/utils";
import { getPatientsByeCLient } from "@/services/supabase/patients.service";
import { useAuthWithRole } from "@/hooks/useAuthWithRole";
import type { PatientsRow } from "@/types/db/patients/patients";
import TreatmentPlanningForm from "../clients/components/display-form";
import PatientDetail from "./components/patientDetails";

export default function Patients() {
	const { user, canEditPatients, canDeletePatients } = useAuthWithRole();
	const [patients, setPatients] = useState<PatientsRow[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedPatient, setSelectedPatient] = useState<PatientsRow | null>(
		null,
	);
	const [activeTab, setActiveTab] = useState<"details" | "form">("details");

	const filteredPatients = searchQuery.trim()
		? patients.filter((patient) => {
				const query = searchQuery.toLowerCase();
				const fullName =
					`${patient.name} ${patient.last_name}`.toLowerCase();

				return fullName.includes(query);
			})
		: patients;

	const handleOnClick = (patient: PatientsRow) => {
		console.log(patient);
		setSelectedPatient(patient);
		setActiveTab("details");
	};

	const handleSearch = (query: string) => {
		setSearchQuery(query);
	};

	useEffect(() => {
		if (user) {
			getPatientsByeCLient(user.id)
				.then((patients) => {
					setPatients(patients);
				})
				.catch((error) => {
					console.error(error);
				});
		}
	}, [user]);

	useEffect(() => {
		document.body.style.overflow = 'hidden';
		document.documentElement.style.overflow = 'hidden';
		
		return () => {
			document.body.style.overflow = '';
			document.documentElement.style.overflow = '';
		};
	}, []);

	return (
		<div>
			<div className="py-1">
				<div className="flex items-center gap-2">
					<Link to="/pacientes/crear">
						<Button variant="outline" size="sm">
							<PlusIcon /> Crear Paciente
						</Button>
					</Link>
					{canEditPatients() && (
						<Button variant="outline" size="sm" disabled>
							<EditIcon /> Editar Seleccionado
						</Button>
					)}
					{canDeletePatients() && (
						<Button variant="outline" size="sm" disabled>
							<TrashIcon /> Eliminar Seleccionado
						</Button>
					)}
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-12 lg:gap-2">
				<div className="col-span-3 h-[calc(100vh-4.5rem)] space-y-3">
					<RoleInfo />
					<div>
						<SearchInput
							onSearch={handleSearch}
							placeholder="Buscar paciente..."
							value={searchQuery}
						/>
					</div>
					<ScrollArea>
						{filteredPatients.length > 0 ? (
							filteredPatients.map((patient) => (
								<button
									key={patient.id}
									type="button"
									className="w-full hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex flex-col items-start gap-2 border-b p-4 text-sm leading-tight whitespace-nowrap last:border-b-0"
									onClick={() => handleOnClick(patient)}
								>
									<div className="flex w-full items-center gap-2">
										<span>
											{patient.name} {patient.last_name}
										</span>{" "}
										<span className="ml-auto text-xs">
											{formatDate(patient.created_at)}
										</span>
									</div>
									<span className="font-medium">
										{patient.type_of_plan}
									</span>
									<span className="line-clamp-2 w-[260px] text-xs whitespace-break-spaces text-left">
										{patient.treatment_approach}
									</span>
								</button>
							))
						) : searchQuery.trim() ? (
							<div className="flex items-center justify-center p-8 text-center">
								<div className="space-y-2">
									<UsersIcon className="h-8 w-8 text-muted-foreground/60 mx-auto" />
									<p className="text-sm text-muted-foreground">
										No se encontraron pacientes que
										coincidan con "{searchQuery}"
									</p>
									<p className="text-xs text-muted-foreground/70">
										Intenta con otro nombre
									</p>
								</div>
							</div>
						) : null}
					</ScrollArea>
				</div>

				<div className="col-span-9">
					{selectedPatient ? (
						<div>
							<div className="border-b mb-4">
								<div className="flex space-x-1">
									<button
										type="button"
										onClick={() => setActiveTab("details")}
										className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
											activeTab === "details"
												? "bg-background border-b-2 border-primary text-primary"
												: "text-muted-foreground hover:text-foreground"
										}`}
									>
										<FileTextIcon className="inline-block w-4 h-4 mr-2" />
										Detalles del Paciente
									</button>
									<button
										type="button"
										onClick={() => setActiveTab("form")}
										className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
											activeTab === "form"
												? "bg-background border-b-2 border-primary text-primary"
												: "text-muted-foreground hover:text-foreground"
										}`}
									>
										<ClipboardListIcon className="inline-block w-4 h-4 mr-2" />
										Planificación de Tratamiento
									</button>
								</div>
							</div>

							{activeTab === "details" ? (
								<div className="h-[calc(100vh-4.5rem)] overflow-auto">
									<PatientDetail patient={selectedPatient} />
								</div>
							) : (
								<div className="h-[calc(100vh-4.5rem)] overflow-auto">
									<TreatmentPlanningForm />
								</div>
							)}
						</div>
					) : (
						<div className="h-full flex items-center justify-center">
							<EmptyPatient />
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

function EmptyPatient() {
	return (
		<div className="flex items-center justify-center min-h-[600px] p-6">
			<div className="flex flex-col items-center text-center space-y-6">
				{/* Icono principal */}
				<div className="p-6 bg-muted/30 rounded-2xl">
					<UsersIcon className="h-12 w-12 text-muted-foreground/60" />
				</div>

				{/* Contenido principal */}
				<div className="space-y-3">
					<h3 className="text-xl font-semibold text-foreground">
						Ningún paciente seleccionado
					</h3>
					<p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
						Selecciona un paciente de la lista para ver sus detalles
						médicos, plan de tratamiento y archivos adjuntos.
					</p>
				</div>

				{/* Indicador visual sutil */}
				<div className="flex items-center space-x-2 text-muted-foreground/50">
					<ArrowLeftIcon className="h-4 w-4" />
					<span className="text-xs">Selecciona desde la lista</span>
				</div>
			</div>
		</div>
	);
}
