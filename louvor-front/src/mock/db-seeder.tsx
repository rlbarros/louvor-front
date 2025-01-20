import genres from "./music/genres.json";
import interpreters from "./music/interpreters.json";
import musics from "./music/musics.json";
import styles from "./music/styles.json";
import serviceMusics from "./service/service-musics.json";
import serviceTypes from "./service/service-types.json";
import services from "./service/services.json";
import users from "./auth/users.json";
import { Server } from "miragejs";

export default function seed(server: Server) {
  server.db.loadData({
    users: users,
    genres: genres,
    interpreters: interpreters,
    musics: musics,
    serviceMusics: serviceMusics,
    serviceTypes: serviceTypes,
    services: services,
    styles: styles,
  });
}
