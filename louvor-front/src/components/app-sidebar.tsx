import * as React from "react";
import {
  AudioWaveform,
  CalendarDays,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import AuthContext from "@/utils/contexts";

// This is sample data.
const data = {
  teams: [
    {
      name: "Loteamento Brasil",
      logo: GalleryVerticalEnd,
      plan: "Igreja",
    },
    {
      name: "Santos Reis",
      logo: AudioWaveform,
      plan: "Igreja",
    },
    {
      name: "Rosa dos Ventos",
      logo: Command,
      plan: "Sede Estadual",
    },
  ],
  navMain: [
    {
      title: "Agenda",
      url: "/",
      icon: CalendarDays,
      isActive: true,
      items: [
        {
          title: "Styles",
          url: "/styles",
        },
        {
          title: "Genres",
          url: "/genres",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Músicas",
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
      title: "Configurações",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Styles",
          url: "/styles",
        },
        {
          title: "Genres",
          url: "/genres",
        },
        {
          title: "Settings",
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
  const currentUser = React.useContext(AuthContext);
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={currentUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
