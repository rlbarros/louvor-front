import { constants } from "@/constants";
import { Music } from "@/models/music/music.model";
import { Server } from "miragejs";
import mockCrudRoute, {
  authorizationNotPresentResponse,
  notFoundResponse,
} from "../util.mock";
import { ServiceType } from "@/models/services/service-type.model";
import { Style } from "@/models/music/style.model";
import { Service } from "@/models/services/service.model";

export default function mockMusicService(server: Server) {
  const serviceDomain = constants.domains.service;
  const serviceRoute = `${constants.api}/${serviceDomain.name}`;
  const servicesMusicRoute = `${serviceRoute}/${serviceDomain.routes.servicesMusics}`;
  server.put(
    servicesMusicRoute,
    (schema, request) => {
      const musicDomain = constants.domains.music;

      const musicSchema = musicDomain.routes.musics;
      const styleSchema = musicDomain.routes.styles;
      const genresSchema = musicDomain.routes.genres;

      const styles = schema.db[styleSchema];
      const genres = schema.db[genresSchema];

      const serviceSchema = serviceDomain.routes.services;
      const serviceTypeSchema = serviceDomain.routes.servicesTypes;
      const interpretersSchema = musicDomain.routes.interpreters;
      const servicesMusicsSchema = serviceDomain.routes.servicesMusics;

      const headers = request.requestHeaders;
      if (!("authorization" in headers)) {
        return authorizationNotPresentResponse;
      }

      const queryParams = request.queryParams;
      let serviceId = 0;
      if (queryParams) {
        serviceId = Number(queryParams["service_id"]);
      }
      const services = schema.db[serviceSchema];
      const service = services.find(serviceId) as Service;
      if (!service) {
        return notFoundResponse;
      }
      const servicesTypes = schema.db[serviceTypeSchema];
      const serviceType = servicesTypes.find(
        service.service_type_id
      ) as ServiceType;
      if (!serviceType) {
        return notFoundResponse;
      }

      const musicCount = serviceType.music_count;

      const musics = schema.db[musicSchema];
      const stylesMusics = new Map<number, Music[]>();
      for (const style of styles) {
        const styleId = (style as Style).id;
        const musicsStyle = musics.filter((x) => x.style_id == styleId);
        stylesMusics.set(styleId, musicsStyle);
      }

      const division = Math.floor(musicCount / styles.length);
      const rest = musicCount % styles.length;
      const pickArray = new Array<number>();
      for (let i = 0; i < styles.length; i++) {
        if (i == 0) {
          if (rest > 0) {
            pickArray.push(rest + division);
          } else {
            pickArray.push(division);
          }
        } else {
          pickArray.push(division);
        }
      }

      const randomMusics = [];
      for (let i = 0; i < styles.length; i++) {
        const style = styles[i];
        const styleId = style.id;
        const pickCount = pickArray[i];
        const musics = stylesMusics.get(styleId);
        if (musics) {
          const randomItems = musics
            .sort(() => 0.5 - Math.random())
            .slice(0, pickCount);
          randomMusics.push(...randomItems);
        }
      }

      const interpreters = schema.db[interpretersSchema];

      const randomServiceMusics = randomMusics.map((item) => {
        const interpreter = interpreters.find(item.interpreter_id);

        let interpreterName = "";
        if (interpreter) {
          interpreterName = interpreter.name;
        }

        const style = styles.find(item.style_id);
        let styleName = "";
        if (style) {
          styleName = style.name;
        }

        const genre = genres.find(item.genre_id);
        let genreName = "";
        if (genre) {
          genreName = genre.name;
        }

        return {
          service_id: service.id,
          music_id: item.id,
          music: item.name,
          interpreter: interpreterName,
          style: styleName,
          genre: genreName,
        };
      });

      const servicesMusics = schema.db[servicesMusicsSchema];
      for (const randomServiceMusic of randomServiceMusics) {
        servicesMusics.insert(randomServiceMusic);
      }

      return randomServiceMusics;
    },
    {
      timing: constants.timeouts.mock,
    }
  );

  mockCrudRoute(
    server,
    servicesMusicRoute,
    serviceDomain.routes.servicesMusics,
    100
  );
}
