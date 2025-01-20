import { createServer } from "miragejs";

import { models } from "./db-models";
import seed from "./db-seeder";
import mockAuth from "./auth/auth.mock";
import mockMusic from "./music/music.mock";
import mockService from "./service/service.mock";

if (import.meta.env.VITE_MOCK_API) {
  createServer({
    models: models,
    seeds(server) {
      seed(server);
    },
    routes() {
      mockAuth(this);
      mockMusic(this);
      mockService(this);
    },
  });
}
