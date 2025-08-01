import { Inbox, LayoutDashboard } from "lucide-react";
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

interface Props {
	children: React.ReactNode;
}

const items = [
	{
		title: "Dashboard",
		url: "/",
		icon: LayoutDashboard,
	},
	{
		title: "Pacientes",
		url: "/pacientes",
		icon: Inbox,
	},
];

export default function PatientLayout({ children }: Props) {
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
			<main className="border-2 border-red-500 border-dotted w-full p-4 overflow-hidden">
				<SidebarTrigger className="lg:hidden" />
				{children}
			</main>
		</SidebarProvider>
	);
}
