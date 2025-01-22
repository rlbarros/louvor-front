import { constants } from "@/constants";
import { Response, Server } from "miragejs";

export default function mockCrudRoute(
  server: Server,
  route: string,
  schemaName: string
) {
  const authorizationNotPresentResponse = new Response(
    403,
    {},
    { errors: ["authorization not present"] }
  );

  const schemaNotFoundResponse = new Response(
    500,
    {},
    { errors: [`schema ${schemaName} not found`] }
  );

  server.get(
    route,
    (schema, request) => {
      const headers = request.requestHeaders;
      if (!("authorization" in headers)) {
        return authorizationNotPresentResponse;
      }

      if (schemaName in schema.db) {
        const values = schema.db[schemaName];
        return values;
      } else {
        return schemaNotFoundResponse;
      }
    },
    {
      timing: constants.timeouts.mock,
    }
  );

  server.post(
    route,
    (schema, request) => {
      const headers = request.requestHeaders;
      if (!("authorization" in headers)) {
        return authorizationNotPresentResponse;
      }

      const object = JSON.parse(request.requestBody);

      if (schemaName in schema.db) {
        schema.db[schemaName].push(object);
        return object;
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
