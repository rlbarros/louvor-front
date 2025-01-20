import { constants } from "@/constants";
import { Server } from "miragejs";
import mockCrudRoute from "../util.mock";

export default function mockService(server: Server) {
  const serviceDomain = constants.domains.service;
  const serviceRoute = `${constants.api}/${serviceDomain.name}`;

  const servicesMusicRoute = `${serviceRoute}/${serviceDomain.routes.servicesMusics}`;
  const servicesTypesRoute = `${serviceRoute}/${serviceDomain.routes.servicesTypes}`;
  const servicesRoute = `${serviceRoute}/${serviceDomain.routes.services}`;

  mockCrudRoute(
    server,
    servicesMusicRoute,
    serviceDomain.routes.servicesMusics
  );
  mockCrudRoute(server, servicesTypesRoute, serviceDomain.routes.servicesTypes);
  mockCrudRoute(server, servicesRoute, serviceDomain.routes.services);
}
