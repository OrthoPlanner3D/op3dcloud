import { Inbox, LayoutDashboard, Users, Settings } from "lucide-react";
import { Link } from "react-router";
import logo from "@/assets/images/logos/logo-black.png";
import { NavUser } from "@/components/nav.user";
import { useAuthWithRole } from "@/hooks/useAuthWithRole";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";

/**
 * Props para el componente PatientLayout
 */
interface Props {
	children: React.ReactNode;
}

/**
 * Layout principal para usuarios autenticados con navegación basada en roles
 * @param props - Propiedades del componente
 * @returns JSX.Element - Layout con sidebar y contenido
 */
export default function PatientLayout({ children }: Props) {
	const { canAccessDashboard, isAdmin } = useAuthWithRole();

	// Configuración de elementos de navegación
	const navigationItems = [
		{
			title: "Dashboard",
			url: "/dashboard",
			icon: LayoutDashboard,
			requiresDashboardAccess: true,
		},
		{
			title: "Pacientes",
			url: "/pacientes",
			icon: Inbox,
			requiresDashboardAccess: false,
		},
		{
			title: "Planificadores",
			url: "/planificadores",
			icon: Users,
			requiresAdmin: true,
		},
		{
			title: "Accesos",
			url: "/accesos",
			icon: Settings,
			requiresAdmin: true,
		},
	];

	// Filtrar elementos según permisos del usuario
	const visibleItems = navigationItems.filter((item) => {
		if (item.requiresDashboardAccess) return canAccessDashboard();
		if (item.requiresAdmin) return isAdmin();
		return true;
	});

	return (
		<SidebarProvider defaultOpen={false}>
			<Sidebar collapsible="icon">
				<SidebarHeader>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton
								size="lg"
								asChild
								tooltip="Visitar web"
							>
								<a
									href="https://www.orthoplanner3d.com"
									target="blank"
								>
									<div className="flex aspect-square size-8 items-center justify-center rounded-lg">
										<img
											src={logo}
											alt="OrthoPlanner3D"
											className="size-7"
										/>
									</div>
									<div className="grid flex-1 text-left text-sm leading-tight">
										<span className="truncate font-medium">
											OrthoPlanner3D™
										</span>
									</div>
								</a>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarHeader>

				<SidebarContent>
					<SidebarGroup>
						<SidebarGroupLabel>Acciones</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{visibleItems.map((item) => (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton
											asChild
											tooltip={item.title}
										>
											<Link to={item.url}>
												<item.icon />
												<span>{item.title}</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarContent>
				<SidebarFooter>
					<NavUser />
				</SidebarFooter>
			</Sidebar>
			<main className="w-full p-4">
				<SidebarTrigger className="lg:hidden" />
				{children}
			</main>
		</SidebarProvider>
	);
}
