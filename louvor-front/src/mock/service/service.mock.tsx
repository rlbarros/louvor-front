import { constants } from "@/constants";
import { Server } from "miragejs";
import mockCrudRoute from "../util.mock";
import mockMusicService from "./services-musics.mock";

export default function mockService(server: Server) {
  const serviceDomain = constants.domains.service;
  const serviceRoute = `${constants.api}/${serviceDomain.name}`;

  const servicesTypesRoute = `${serviceRoute}/${serviceDomain.routes.servicesTypes}`;
  const servicesRoute = `${serviceRoute}/${serviceDomain.routes.services}`;

  mockCrudRoute(
    server,
    servicesTypesRoute,
    serviceDomain.routes.servicesTypes,
    0,
    "name"
  );
  mockCrudRoute(
    server,
    servicesRoute,
    serviceDomain.routes.services,
    100,
    "day"
  );

  mockMusicService(server);
}
