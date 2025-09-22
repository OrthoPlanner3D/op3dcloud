import { Inbox, LayoutDashboard, Users, Settings } from "lucide-react";
import { Link } from "react-router";
import { useAuthWithRole } from "@/hooks/useAuthWithRole";
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

export default function NavigationGuard() {
	const { hasAnyRole, isAdmin } = useAuthWithRole();

	const navigationItems = [
		{
			title: "Dashboard",
			url: "/dashboard",
			icon: LayoutDashboard,
			allowedRoles: ["admin", "planner"],
		},
		{
			title: "Pacientes",
			url: "/pacientes",
			icon: Inbox,
			allowedRoles: ["admin", "planner", "client"],
		},
		{
			title: "Planificadores",
			url: "/planificadores",
			icon: Users,
			allowedRoles: ["admin"],
		},
		{
			title: "Accesos",
			url: "/accesos",
			icon: Settings,
			allowedRoles: ["admin"],
		},
	];

	const visibleItems = navigationItems.filter((item) => {
		return hasAnyRole(item.allowedRoles);
	});

	return (
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
	);
}
