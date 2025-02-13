import { User } from "@/models/auth/user.model";
import { constants } from "../../constants";
import { EncodeResult } from "../../models/auth/encode-result.model";
import { Login } from "../../models/auth/login.model";
import { BaseService } from "../base.service";
import { ApiResponse } from "@/models/app/api-response.model";

export class AuthService extends BaseService {
  authDomain = constants.domains.auth;

  override domain(): string {
    return this.authDomain.name;
  }

  readonly authKey = this.domain();

  public async login(login: Login): Promise<ApiResponse<EncodeResult>> {
    const loginPath = `${super.apiPath()}/login`;
    const encodeReslt = await fetch(loginPath, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(login),
    }).then(async (r) => {
      const json = await r.json();
      const content = json.content;
      localStorage.setItem(this.authKey, JSON.stringify(content));
      return json;
    });
    return encodeReslt;
  }

  public logout() {
    localStorage.removeItem(this.authKey);
  }

  private encodedResult() {
    const auth = localStorage.getItem(this.authKey);
    if (!auth || auth == "undefined") {
      return {
        success: false,
      } as EncodeResult;
    }
    return JSON.parse(auth) as EncodeResult;
  }

  public user(): Omit<User, "password"> {
    const encodedResult = this.encodedResult();
    if (!encodedResult) {
      return {} as Omit<User, "password">;
    }
    return encodedResult.user;
  }

  public token() {
    const encodedResult = this.encodedResult();
    if (!encodedResult) {
      return "";
    }
    return encodedResult.token;
  }

  public isUserLogged(): boolean {
    const encodedResult = this.encodedResult();
    if (!encodedResult) {
      return false;
    }
    const now = Date.now();
    return now < encodedResult.expires;
  }
}
