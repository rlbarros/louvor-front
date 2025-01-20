import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { constants } from "@/constants";
import { Genres } from "@/genres";
import { Styles } from "@/styles";
import ProtectedRoutes from "@/utils/protected.routes";
import slash from "@/utils/slash";

import { Route, Routes } from "react-router-dom";

export default function Page() {
  const musicsPath = slash(constants.domains.music.routes.musics);
  const interpretersPath = slash(constants.domains.music.routes.interpreters);

  const genresPath = slash(constants.domains.music.routes.genres);
  const stylesPath = slash(constants.domains.music.routes.styles);
  const serviceTypePath = slash(constants.domains.service.routes.servicesTypes);

  const location = window.location;
  const pathName = location.pathname;
  let breadcrumbLink = constants.menus.schedule;
  let breadcrumbItem = constants.menus.services;

  if (pathName.endsWith(musicsPath)) {
    breadcrumbLink = constants.menus.musics;
    breadcrumbItem = constants.menus.musics;
  } else if (pathName.endsWith(interpretersPath)) {
    breadcrumbLink = constants.menus.musics;
    breadcrumbItem = constants.menus.interpreters;
  }

  if (pathName.endsWith(genresPath)) {
    breadcrumbLink = constants.menus.configuration;
    breadcrumbItem = constants.menus.genres;
  } else if (pathName.endsWith(stylesPath)) {
    breadcrumbLink = constants.menus.configuration;
    breadcrumbItem = constants.menus.styles;
  } else if (pathName.endsWith(serviceTypePath)) {
    breadcrumbLink = constants.menus.configuration;
    breadcrumbItem = constants.menus.serviceTypes;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href={pathName}>
                    {breadcrumbLink}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{breadcrumbItem}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
            <Routes>
              <Route element={<ProtectedRoutes />}>
                <Route element={<Genres />} path={genresPath} />
                <Route element={<Styles />} path={stylesPath} />
              </Route>
            </Routes>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
