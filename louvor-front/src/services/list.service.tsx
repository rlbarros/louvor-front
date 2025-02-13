import { ApiResponse } from "@/models/app/api-response.model";
import { AuthService } from "./auth/auth.service";
import { BaseService } from "./base.service";

export abstract class ListService<V> extends BaseService {
  abstract route(): string;

  override apiPath(): string {
    const apiPath = `${super.apiPath()}/${this.route()}`;
    return apiPath;
  }

  authService = new AuthService();

  headers(token: string) {
    const headers = new Headers({
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
      Accept: "application/json",
    });
    return headers;
  }

  options(method: string) {
    const token = this.authService.token();
    const options = {
      method,
      headers: this.headers(token),
    };
    return options;
  }

  query(queryParams: Record<string, string>) {
    let query = "";
    if (queryParams) {
      let firstIteration = true;

      for (const property in queryParams) {
        if (firstIteration) {
          query += "?";
          firstIteration = false;
        } else {
          query += "&";
        }
        query += `${property}=${queryParams[property]}`;
      }
    }
    return query;
  }

  pathQuery(queryParams: Record<string, string> = {}) {
    let path = this.apiPath();
    const query = this.query(queryParams);
    if (query) {
      path += query;
    }
    return path;
  }

  async list(queryParams: Record<string, string> = {}): Promise<V[]> {
    const options = this.options("GET");
    const path = this.pathQuery(queryParams);
    const apiResponse = (await fetch(path, options).then((r) =>
      r.json()
    )) as ApiResponse<V[]>;
    return apiResponse.content;
  }
}
