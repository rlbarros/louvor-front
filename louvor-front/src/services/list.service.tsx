import { AuthService } from "./auth/auth.service";
import { BaseService } from "./base.service";

export abstract class ListService<T> extends BaseService {
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

  async list(): Promise<T[]> {
    const options = this.options("GET");
    return await fetch(this.apiPath(), options).then((r) => r.json());
  }
}
