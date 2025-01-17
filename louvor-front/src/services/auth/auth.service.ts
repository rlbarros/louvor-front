import { constants } from "../../constants";
import { EncodeResult } from "../../models/auth/encode-result.model";
import { Login } from "../../models/auth/login,model";
import { BaseService } from "../base.service";

export class AuthService extends BaseService {
    authDomain = constants.domains.auth;

    override domain(): string {
        return this.authDomain.name;
    }

    public async login(login: Login): Promise<EncodeResult> {
        const loginPath = `${super.apiPath()}/login`;
        const encodeReslt = await fetch(
            loginPath, {
            method: "POST",
            body: JSON.stringify(login)
        }
        ).then(r => r.json());
        return encodeReslt;
    }


}