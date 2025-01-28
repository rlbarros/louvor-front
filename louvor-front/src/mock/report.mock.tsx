import { constants } from "@/constants";
import {
  authorizationNotPresentResponse,
  schemaNotFoundResponse,
} from "./util.mock";
import { Server } from "miragejs";

export default function mockReports(server: Server) {
  const timeout = constants.timeouts.mock;
  const reportDomain = constants.domains.report;
  const reportRoute = `${constants.api}/${reportDomain.name}`;
  const musicsByGenreRoute = `${reportRoute}/${reportDomain.routes.musicsByGenre}`;
  const musicsByInterpreterRoute = `${reportRoute}/${reportDomain.routes.musicsByInterpreter}`;

  mockReport(server, musicsByGenreRoute, "genre", "genre_id");
  mockReport(server, musicsByInterpreterRoute, "interpreter", "interpreter_id");

  type ReportType = {
    id: number;
    name: string;
    count: number;
  };

  function group(
    values: Array<Record<string, unknown>>,
    labelField: string,
    idField: string
  ): ReportType[] {
    const genreCountMap = new Map<number, [string, number]>();

    values.forEach((i) => {
      if (!genreCountMap.has(Number(i[idField]))) {
        genreCountMap.set(Number(i[idField]), [i[labelField] as string, 0]);
      }
      const tuple = genreCountMap.get(Number(i[idField]));
      if (tuple) {
        let count = tuple[1];
        tuple[1] = ++count;
        genreCountMap.set(Number(i[idField]), tuple);
      }
    });

    const returnValues = [] as ReportType[];
    genreCountMap.forEach((tuple, key) => {
      returnValues.push({
        id: key,
        name: tuple[0],
        count: tuple[1],
      });
    });

    return returnValues;
  }

  function mockReport(
    server: Server,
    route: string,
    labelField: string,
    idField: string
  ) {
    server.get(
      route,
      (schema, request) => {
        const headers = request.requestHeaders;
        if (!("authorization" in headers)) {
          return authorizationNotPresentResponse;
        }

        const schemaName = "servicesMusics";
        if (schemaName in schema.db) {
          const values = schema.db["servicesMusics"];

          return group(values, labelField, idField);
        } else {
          return schemaNotFoundResponse;
        }
      },
      {
        timing: timeout,
      }
    );
  }
}
