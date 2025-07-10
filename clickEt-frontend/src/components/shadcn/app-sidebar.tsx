import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Building,
  Building2Icon,
  Command,
  Frame,
  GalleryVerticalEnd,
  Glasses,
  IndianRupee,
  Map,
  PieChart,
  RectangleHorizontal,
  Settings2,
  SquareTerminal,

  TicketIcon,

  Video,
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";

import { NavUser } from "@/components/shadcn/nav-user";
import { TeamSwitcher } from "@/components/shadcn/team-switcher";
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
  SidebarRail,
} from "@/components/shadcn/sidebar";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "ClickEt",
      logo: GalleryVerticalEnd,
      plan: "Admin Dashboard",
    },
    {
      name: "Distributor",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "/admin/distributors",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
    
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const  { user }  = useAuth();
  const userData = {
    name: user?.full_name || "",
    email: user?.email || "",
    profile_URL: user?.profile_URL || "",
  };

  const items = [
    {
      title: "Movies",
      url: "/admin/movies",
      icon: Video,
    },
    {
      title: "Distributors",
      url: "/admin/distributors",
      icon: Building2Icon,
    },
    {
      title: "Theatres",
      url: "/admin/theatres",
      icon: Building,
    },
    {
      title: "Halls",
      url: "/admin/halls",
      icon: RectangleHorizontal,
    },
    {
      title: "Screeninigs",
      url: "/admin/screenings",
      icon: Glasses,
    },
    {
      title: "Bookings",
      url: "/admin/bookings",
      icon: TicketIcon,
    },
    {
      title: "Payments",
      url: "/admin/payments",
      icon: IndianRupee,
    },
  ]
  
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Manage Entities</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
