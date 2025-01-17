import { createServer, Model } from "miragejs";
import styles from "./music/styles.json";
import users from "./auth/users.json";
import { constants } from "../constants";
import { EncodeResult } from "../models/auth/encode-result.model";
import { Login } from "../models/auth/login,model";
import { encodeSession } from "./auth/encoding-session";

const { domains } = constants;

const api = constants.api;

if (import.meta.env.VITE_MOCK_API) {
  createServer({
    models: {
      user: Model,
    },
    seeds(server) {
      server.db.loadData({
        users: users
      });
    },
    routes() {
      const authDomain = domains.auth;
      const authRoute = `${api}/${authDomain.name}`;
      const loginRoute = `${authRoute}/${authDomain.routes.login}`;
      this.post(loginRoute, async (schema, request) => {
        const body = JSON.parse(request.requestBody);
        const email = (body as Login).email;
        const user = schema.db.users.findBy({
          email: email
        });

        let encodeResult = {
          token: '',
          issued: 0,
          expires: 0
        } as EncodeResult;

        if (user) {
          encodeResult = await encodeSession();
        }
        return JSON.stringify(encodeResult);
      });

      const musicDomain = domains.music;
      const musicRoute = `${api}/${musicDomain.name}`;
      const stylesRoute = `${musicRoute}/${musicDomain.routes.styles}`;
      this.get(stylesRoute, () => {
        return styles;
      }, {
        timing: constants.timeouts.mock
      });
    },
  });




}

