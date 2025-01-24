import { constants } from "@/constants";
import { Response, Server } from "miragejs";

export default function mockCrudRoute(
  server: Server,
  route: string,
  schemaName: string,
  timeout: number = constants.timeouts.mock
) {
  const idRoute = `${route}/:id`;

  const authorizationNotPresentResponse = new Response(
    403,
    {},
    { errors: ["authorization not present"] }
  );

  const notFoundResponse = new Response(
    404,
    {},
    { errors: ["authorization not present"] }
  );

  const paramNotPresent = new Response(
    422,
    {},
    { errors: ["required parameters not present"] }
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
        let values = schema.db[schemaName];

        const queryParams = request.queryParams;
        if (queryParams) {
          values = values.where(queryParams);
        }

        return values;
      } else {
        return schemaNotFoundResponse;
      }
    },
    {
      timing: timeout,
    }
  );

  server.get(
    idRoute,
    (schema, request) => {
      const headers = request.requestHeaders;
      if (!("authorization" in headers)) {
        return authorizationNotPresentResponse;
      }

      if (!("id" in request.params)) {
        return paramNotPresent;
      }

      const idParameter = request.params.id;
      if (!idParameter) {
        return paramNotPresent;
      }

      if (schemaName in schema.db) {
        const values = schema.db[schemaName];
        const value = values.find(idParameter);
        if (!value) {
          return notFoundResponse;
        }
        return value;
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

  server.delete(
    idRoute,
    (schema, request) => {
      const headers = request.requestHeaders;
      if (!("authorization" in headers)) {
        return authorizationNotPresentResponse;
      }

      if (!("id" in request.params)) {
        return paramNotPresent;
      }

      const idParameter = request.params.id;
      if (!idParameter) {
        return paramNotPresent;
      }

      if (schemaName in schema.db) {
        const values = schema.db[schemaName];
        const value = values.find(idParameter);
        if (!value) {
          return notFoundResponse;
        }
        values.remove(value);
        return value;
      } else {
        return schemaNotFoundResponse;
      }
    },
    {
      timing: constants.timeouts.mock,
    }
  );
}
