import * as React from "react";
import {
  AudioWaveform,
  CalendarDays,
  Command,
  GalleryVerticalEnd,
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
import slash from "@/utils/slash";
import { constants } from "@/constants";

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
      title: constants.menus.schedule,
      url: slash(""),
      icon: CalendarDays,
      isActive: true,
      items: [
        {
          title: constants.menus.services,
          url: slash(""),
        },
      ],
    },
    {
      title: constants.menus.musics,
      url: slash(constants.domains.music.routes.musics),
      icon: AudioWaveform,
      items: [
        {
          title: constants.menus.musics,
          url: slash(constants.domains.music.routes.musics),
        },
        {
          title: constants.menus.interpreters,
          url: slash(constants.domains.music.routes.interpreters),
        },
      ],
    },
    {
      title: constants.menus.configuration,
      url: "#",
      icon: Settings2,
      items: [
        {
          title: constants.menus.styles,
          url: slash(constants.domains.music.routes.styles),
        },
        {
          title: constants.menus.genres,
          url: slash(constants.domains.music.routes.genres),
        },
        {
          title: constants.menus.servicesTypes,
          url: slash(constants.domains.service.routes.servicesTypes),
        },
      ],
    },
  ],
  projects: [
    {
      name: "Relatórios",
      url: "#",
      icon: PieChart,
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
