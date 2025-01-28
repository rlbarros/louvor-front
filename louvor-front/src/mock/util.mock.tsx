import { constants } from "@/constants";
import { Response, Server } from "miragejs";

export const authorizationNotPresentResponse = new Response(
  403,
  {},
  { errors: ["authorization not present"] }
);
export const notFoundResponse = new Response(
  404,
  {},
  { errors: ["authorization not present"] }
);

export const paramNotPresent = new Response(
  422,
  {},
  { errors: ["required parameters not present"] }
);

export const schemaNotFoundResponse = new Response(
  500,
  {},
  { errors: [`schema not found`] }
);

export default function mockCrudRoute(
  server: Server,
  route: string,
  schemaName: string,
  timeout: number = constants.timeouts.mock,
  whereInsertProperty: string
) {
  const idRoute = `${route}/:id`;

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
      timing: timeout,
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
      if (schemaName == "musics") {
        const genres = schema.db["genres"];
        const genre = genres.where({ id: object.genre_id })[0];
        object.genre = genre.name;

        const styles = schema.db["styles"];
        const style = styles.where({ id: object.style_id })[0];
        object.style = style.name;

        const interpreters = schema.db["interpreters"];
        const interpreter = interpreters.where({
          id: object.interpreter_id,
        })[0];
        object.interpreter = interpreter.name;
      }
      if (schemaName in schema.db) {
        if (object.id == 0) {
          const objects = schema.db[schemaName];
          const whereObjects = objects.where({
            [whereInsertProperty]: object[whereInsertProperty],
          });
          if (whereObjects.length == 0) {
            let max = Math.max(...objects.map((o) => Number(o.id)));
            object.id = `${++max}`;

            objects.insert(object);
          } else {
            const whereObject = whereObjects[0];
            object.id = whereObject.id;
          }
        } else {
          const objects = schema.db[schemaName];
          const foundObject = objects.find(object.id);
          objects.update(foundObject.id, object);
        }
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
      timing: timeout,
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
