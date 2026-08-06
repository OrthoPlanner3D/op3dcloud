import {
	ArrowLeftIcon,
	CalendarIcon,
	ClipboardListIcon,
	FileTextIcon,
	FolderIcon,
	HashIcon,
	LayersIcon,
	PlusIcon,
	SearchXIcon,
	Share2Icon,
	ShieldCheckIcon,
	TargetIcon,
	UsersIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import SearchInput from "@/components/search-input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn, formatDate } from "@/lib/utils";
import { getPatientsByeCLient } from "@/services/supabase/patients.service";
import { useUserStore } from "@/state/stores/useUserStore";
import type { PatientsRow } from "@/types/db/patients/patients";
import PatientDetail from "./components/patientDetails";
import TreatmentPlanningView from "./components/TreatmentPlanningView";
import {
	countPatientFiles,
	getCaseStatusClass,
	getCaseStatusDotClass,
	getInitials,
} from "./lib/patient-ui";

export default function Patients() {
	const user = useUserStore((state) => state.user);
	const [patients, setPatients] = useState<PatientsRow[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedPatient, setSelectedPatient] = useState<PatientsRow | null>(
		null,
	);
	const [activeTab, setActiveTab] = useState<"details" | "form">("details");
	// En < md solo se ve un panel por vez: la lista o el detalle.
	const [mobileView, setMobileView] = useState<"list" | "detail">("list");

	const filteredPatients = searchQuery.trim()
		? patients.filter((patient) => {
				const query = searchQuery.toLowerCase();
				const fullName =
					`${patient.name} ${patient.last_name}`.toLowerCase();

				return fullName.includes(query);
			})
		: patients;

	const handleOnClick = (patient: PatientsRow) => {
		setSelectedPatient(patient);
		setActiveTab("details");
		setMobileView("detail");
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

	return (
		<div className="flex flex-col gap-3">
			<div className="flex flex-wrap gap-2">
				<Link to="/pacientes/crear">
					<Button variant="brand" size="sm" className="shadow-sm">
						<PlusIcon className="h-4 w-4" /> Crear Paciente
					</Button>
				</Link>
				<Button
					variant="outline"
					size="sm"
					className="border-dashed text-muted-foreground hover:text-foreground hover:border-solid"
					onClick={() => {
						const url = `${window.location.origin}/pacientes/crear/${user?.id}`;
						navigator.clipboard.writeText(url);
						toast.success("Link de registro copiado");
					}}
				>
					<Share2Icon className="h-4 w-4" /> Compartir registro
				</Button>
			</div>

			<div className="grid grid-cols-1 gap-3 md:grid-cols-12 md:items-start">
				{/* Panel de lista: acompaña el scroll de la página */}
				<aside
					className={cn(
						"md:sticky md:top-0 md:col-span-5 md:max-h-[calc(100vh-2rem)] lg:col-span-4 xl:col-span-3",
						mobileView === "detail" ? "hidden md:block" : "block",
					)}
				>
					<Card className="flex max-h-full flex-col gap-0 overflow-hidden border py-0 shadow-sm">
						<div className="shrink-0 space-y-3 border-b p-3">
							<div className="flex items-center justify-between gap-2">
								<h2 className="text-sm font-semibold">
									Pacientes
								</h2>
								<Badge
									variant="outline"
									className="text-muted-foreground"
								>
									{filteredPatients.length}
								</Badge>
							</div>
							<SearchInput
								onSearch={handleSearch}
								placeholder="Buscar paciente..."
								value={searchQuery}
							/>
						</div>

						<ScrollArea className="min-h-0 flex-1">
							{filteredPatients.length > 0 ? (
								<div className="space-y-1.5 p-2">
									{filteredPatients.map((patient) => (
										<PatientListItem
											key={patient.id}
											patient={patient}
											isSelected={
												selectedPatient?.id ===
												patient.id
											}
											onSelect={handleOnClick}
										/>
									))}
								</div>
							) : searchQuery.trim() ? (
								<div className="flex items-center justify-center p-8 text-center">
									<div className="space-y-2">
										<SearchXIcon className="mx-auto h-8 w-8 text-muted-foreground/60" />
										<p className="text-sm text-muted-foreground">
											No se encontraron pacientes que
											coincidan con "{searchQuery}"
										</p>
										<p className="text-xs text-muted-foreground/70">
											Intenta con otro nombre
										</p>
									</div>
								</div>
							) : (
								<div className="flex items-center justify-center p-8 text-center">
									<div className="space-y-2">
										<UsersIcon className="mx-auto h-8 w-8 text-muted-foreground/60" />
										<p className="text-sm text-muted-foreground">
											Todavía no hay pacientes cargados
										</p>
									</div>
								</div>
							)}
						</ScrollArea>
					</Card>
				</aside>

				{/* Panel de detalle */}
				<section
					className={cn(
						"flex-col md:col-span-7 lg:col-span-8 xl:col-span-9",
						mobileView === "list" ? "hidden md:flex" : "flex",
					)}
				>
					{selectedPatient ? (
						<div className="flex flex-col gap-3">
							{/* Barra flotante: el contenido scrollea por debajo */}
							<div className="translucent-bar sticky top-0 z-10 -mx-1 bg-background/75 px-1 py-1 backdrop-blur-md md:hidden">
								<Button
									variant="ghost"
									size="sm"
									className="w-fit"
									onClick={() => setMobileView("list")}
								>
									<ArrowLeftIcon className="h-4 w-4" /> Volver
								</Button>
							</div>

							<PatientHero patient={selectedPatient} />

							<TabNav
								activeTab={activeTab}
								onChange={setActiveTab}
								showPlanning={selectedPatient.planning_enabled}
							/>

							{/* Contenido de las pestañas. El `key` remonta al
							    cambiar de paciente o pestaña, así el contenido
							    entra en vez de aparecer de golpe. */}
							<div
								key={`${selectedPatient.id}-${activeTab}`}
								className="animate-in fade-in slide-in-from-bottom-1 duration-200 ease-out"
							>
								{activeTab === "details" ? (
									<PatientDetail patient={selectedPatient} />
								) : (
									<TreatmentPlanningView
										patientId={selectedPatient.id}
										patient={selectedPatient}
									/>
								)}
							</div>
						</div>
					) : (
						<div className="flex min-h-[60vh] items-center justify-center">
							<EmptyPatient />
						</div>
					)}
				</section>
			</div>
		</div>
	);
}

function PatientListItem({
	patient,
	isSelected,
	onSelect,
}: {
	patient: PatientsRow;
	isSelected: boolean;
	onSelect: (patient: PatientsRow) => void;
}) {
	const statuses = patient.case_status ?? [];

	return (
		<button
			type="button"
			onClick={() => onSelect(patient)}
			className={cn(
				"w-full rounded-lg border p-3 text-left",
				// El feedback ocurre en el pointer-down, no al soltar.
				"transition-[background-color,border-color,transform] duration-150 ease-out active:scale-[0.99]",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-ring",
				isSelected
					? "border-brand/60 bg-brand-muted"
					: "border-transparent hover:border-border hover:bg-accent",
			)}
		>
			<div className="flex items-start gap-3">
				<Avatar className="size-9 shrink-0">
					<AvatarFallback
						className={cn(
							"text-xs font-semibold",
							isSelected
								? "bg-brand text-brand-foreground"
								: "bg-muted text-muted-foreground",
						)}
					>
						{getInitials(patient.name, patient.last_name)}
					</AvatarFallback>
				</Avatar>

				<div className="min-w-0 flex-1 space-y-1.5">
					<div className="flex items-baseline justify-between gap-2">
						<span className="truncate text-sm font-medium">
							{patient.name} {patient.last_name}
						</span>
						<span className="shrink-0 text-[11px] text-muted-foreground">
							{formatDate(patient.created_at)}
						</span>
					</div>

					<p className="truncate text-xs text-muted-foreground">
						{patient.type_of_plan || "Sin plan asignado"}
					</p>

					{statuses.length > 0 && (
						<div className="flex flex-wrap gap-1">
							{statuses.map((status) => (
								<CaseStatusBadge key={status} status={status} />
							))}
						</div>
					)}
				</div>
			</div>
		</button>
	);
}

function CaseStatusBadge({ status }: { status: string }) {
	return (
		<Badge variant="outline" className={getCaseStatusClass(status)}>
			<span
				className={cn(
					"size-1.5 rounded-full",
					getCaseStatusDotClass(status),
				)}
			/>
			{status}
		</Badge>
	);
}

/**
 * Header del paciente: identidad arriba y, en la misma card, una fila
 * compacta con los datos del formulario que antes ocupaban 4 tiles.
 */
function PatientHero({ patient }: { patient: PatientsRow }) {
	const statuses = patient.case_status ?? [];

	// Superficie mayor que las cards de sección → sombra un punto más profunda
	return (
		<Card className="gap-3 border py-4 shadow-md">
			<div className="flex flex-wrap items-center gap-4 px-4">
				<Avatar className="size-12 shrink-0">
					<AvatarFallback className="bg-brand text-base font-semibold text-brand-foreground">
						{getInitials(patient.name, patient.last_name)}
					</AvatarFallback>
				</Avatar>

				<div className="min-w-0 flex-1 space-y-1.5">
					{/* Tracking negativo: a mayor tamaño, las letras se leen
					    demasiado separadas */}
					<h1 className="truncate text-xl leading-tight font-semibold tracking-tight">
						{patient.name} {patient.last_name}
					</h1>
					<div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
						<span className="inline-flex items-center gap-1">
							<HashIcon className="h-3.5 w-3.5" />
							{patient.id}
						</span>
						<span className="inline-flex items-center gap-1">
							<CalendarIcon className="h-3.5 w-3.5" />
							{formatDate(patient.created_at)}
						</span>
						<span className="inline-flex items-center gap-1">
							<LayersIcon className="h-3.5 w-3.5" />
							{patient.type_of_plan || "Sin plan"}
						</span>
					</div>
				</div>

				{statuses.length > 0 && (
					<div className="flex flex-wrap gap-1">
						{statuses.map((status) => (
							<CaseStatusBadge key={status} status={status} />
						))}
					</div>
				)}
			</div>

			<div className="grid gap-x-6 gap-y-3 border-t px-4 pt-3 sm:grid-cols-3">
				<HeroStat
					icon={TargetIcon}
					label="Enfoque de Tratamiento"
					value={patient.treatment_approach || "No especificado"}
				/>
				<HeroStat
					icon={ShieldCheckIcon}
					label="Declaración Jurada"
					value={
						patient.sworn_declaration ? "Completada" : "Pendiente"
					}
					valueClassName={
						patient.sworn_declaration
							? "text-emerald-600 dark:text-emerald-400"
							: "text-amber-600 dark:text-amber-400"
					}
				/>
				<HeroStat
					icon={FolderIcon}
					label="Archivos adjuntos"
					value={String(countPatientFiles(patient))}
				/>
			</div>
		</Card>
	);
}

function HeroStat({
	icon: Icon,
	label,
	value,
	valueClassName,
}: {
	icon: React.ElementType;
	label: string;
	value: string;
	valueClassName?: string;
}) {
	return (
		<div className="flex items-center gap-2.5">
			<div className="rounded-md bg-brand-muted p-1.5">
				<Icon className="h-4 w-4 text-brand" />
			</div>
			<div className="min-w-0">
				{/* Texto chico: tracking levemente positivo para legibilidad */}
				<p className="text-[11px] tracking-wide text-muted-foreground">
					{label}
				</p>
				<p
					className={cn(
						"truncate text-sm font-medium",
						valueClassName,
					)}
					title={value}
				>
					{value}
				</p>
			</div>
		</div>
	);
}

/**
 * Segmented control. El indicador se desplaza entre pestañas en vez de
 * saltar: el movimiento intermedio le dice al ojo hacia dónde va el foco.
 */
function TabNav({
	activeTab,
	onChange,
	showPlanning,
}: {
	activeTab: "details" | "form";
	onChange: (tab: "details" | "form") => void;
	showPlanning: boolean;
}) {
	const tabs = [
		{
			id: "details" as const,
			icon: FileTextIcon,
			label: "Detalles del Paciente",
		},
		...(showPlanning
			? [
					{
						id: "form" as const,
						icon: ClipboardListIcon,
						label: "Planificación de Tratamiento",
					},
				]
			: []),
	];

	return (
		<div
			className={cn(
				"relative grid w-fit gap-1 rounded-lg bg-muted p-1",
				tabs.length > 1 ? "grid-cols-2" : "grid-cols-1",
			)}
		>
			{/* Píldora deslizante */}
			<span
				aria-hidden="true"
				className={cn(
					"pointer-events-none absolute inset-y-1 left-1 rounded-md bg-background shadow-sm",
					"transition-transform duration-200 ease-out",
					tabs.length > 1
						? "w-[calc(50%-0.375rem)]"
						: "w-[calc(100%-0.5rem)]",
					activeTab === "form" && "translate-x-[calc(100%+0.25rem)]",
				)}
			/>

			{tabs.map((tab) => (
				<button
					key={tab.id}
					type="button"
					onClick={() => onChange(tab.id)}
					className={cn(
						"relative z-10 inline-flex items-center justify-center gap-2 rounded-md px-3 py-1.5",
						"text-sm font-medium transition-colors duration-150 ease-out active:scale-[0.98]",
						activeTab === tab.id
							? "text-brand"
							: "text-muted-foreground hover:text-foreground",
					)}
				>
					<tab.icon className="h-4 w-4" />
					{tab.label}
				</button>
			))}
		</div>
	);
}

function EmptyPatient() {
	return (
		<div className="flex items-center justify-center p-6">
			<div className="flex flex-col items-center space-y-6 text-center">
				{/* Icono con halo */}
				<div className="rounded-full bg-brand-muted p-6 ring-8 ring-brand-muted/40">
					<UsersIcon className="h-10 w-10 text-brand" />
				</div>

				{/* Contenido principal */}
				<div className="space-y-3">
					<h3 className="text-xl font-semibold text-foreground">
						Ningún paciente seleccionado
					</h3>
					<p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
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
