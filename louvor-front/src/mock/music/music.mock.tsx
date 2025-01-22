import { constants } from "@/constants";
import { Server } from "miragejs";
import mockCrudRoute from "../util.mock";

export default function mockMusic(server: Server) {
  const musicDomain = constants.domains.music;
  const musicRoute = `${constants.api}/${musicDomain.name}`;

  const stylesRoute = `${musicRoute}/${musicDomain.routes.styles}`;
  const genresRoute = `${musicRoute}/${musicDomain.routes.genres}`;
  const musicsRoute = `${musicRoute}/${musicDomain.routes.musics}`;
  const interpretersRoute = `${musicRoute}/${musicDomain.routes.interpreters}`;

  mockCrudRoute(server, stylesRoute, musicDomain.routes.styles);
  mockCrudRoute(server, genresRoute, musicDomain.routes.genres);
  mockCrudRoute(server, musicsRoute, musicDomain.routes.musics);
  mockCrudRoute(server, interpretersRoute, musicDomain.routes.interpreters);
}
