import { constants } from "@/constants";
import { Response, Server } from "miragejs";

export default function mockCrudRoute(
  server: Server,
  route: string,
  schemaName: string
) {
  server.get(
    route,
    (schema, request) => {
      const headers = request.requestHeaders;
      if (!("authorization" in headers)) {
        return new Response(403, {}, { errors: ["authorization not present"] });
      }

      if (schemaName in schema.db) {
        const values = schema.db[schemaName];
        return values;
      } else {
        return new Response(
          500,
          {},
          { errors: [`schema ${schemaName} not found`] }
        );
      }
    },
    {
      timing: constants.timeouts.mock,
    }
  );
}
