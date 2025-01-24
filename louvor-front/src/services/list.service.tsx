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
      Authorization: "Beader " + token,
      "Content-Type": "application/json",
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

  async list(queryParams: Record<string, string> = {}): Promise<V[]> {
    const options = this.options("GET");
    let path = this.apiPath();
    if (queryParams) {
      let firstIteration = true;

      for (const property in queryParams) {
        if (firstIteration) {
          path += "?";
          firstIteration = false;
        } else {
          path += "&";
        }
        path += `${property}=${queryParams[property]}`;
      }
    }

    return await fetch(path, options).then((r) => r.json());
  }
}
