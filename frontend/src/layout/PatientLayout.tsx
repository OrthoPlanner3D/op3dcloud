import { Inbox, LayoutDashboard, Settings, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import logo from "@/assets/images/logos/logo-black.png";
import { NavUser } from "@/components/nav.user";
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
import { getUserRole, type UserRole } from "@/services/supabase/users.service";
import { useUserStore } from "@/state/stores/useUserStore";

interface Props {
	children: React.ReactNode;
}

export default function PatientLayout({ children }: Props) {
	const [role, setRole] = useState<UserRole | null>(null);
	const user = useUserStore((state) => state.user);

	useEffect(() => {
		async function fetchRole() {
			if (!user?.id) return;

			try {
				const userRole = await getUserRole(user.id);
				setRole(userRole);
			} catch (error) {
				console.error("Error fetching user role:", error);
			}
		}

		fetchRole();
	}, [user?.id]);

	const allItems = [
		{
			title: "Dashboard",
			url: "/",
			icon: LayoutDashboard,
			roles: ["admin", "planner", "client"] as UserRole[],
		},
		{
			title: "Pacientes",
			url: "/pacientes",
			icon: Inbox,
			roles: ["admin", "planner"] as UserRole[],
		},
		{
			title: "Planificadores",
			url: "/planificadores",
			icon: Users,
			roles: ["admin"] as UserRole[],
		},
		{
			title: "Accesos",
			url: "/accesos",
			icon: Settings,
			roles: ["admin"] as UserRole[],
		},
	];

	const items = allItems.filter((item) => role && item.roles.includes(role));

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
								{items.map((item) => (
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
