import { User } from "@/models/auth/user.model";
import { constants } from "../../constants";
import { EncodeResult } from "../../models/auth/encode-result.model";
import { Login } from "../../models/auth/login.model";
import { BaseService } from "../base.service";

export class AuthService extends BaseService {
    authDomain = constants.domains.auth;

    override domain(): string {
        return this.authDomain.name;
    }

    readonly authKey = this.domain();

    public async login(login: Login): Promise<EncodeResult> {
        const loginPath = `${super.apiPath()}/login`;
        const encodeReslt = await fetch(
            loginPath, {
            method: "POST",
            body: JSON.stringify(login)
        }
        ).then(async r => {
            const json = await r.json()
            localStorage.setItem(this.authKey, JSON.stringify(json))
            return json
        });
        return encodeReslt;
    }

    private encodedResult() {
        const auth = localStorage.getItem(this.authKey);
        if (!auth) {
            return {
                success: false
            } as EncodeResult;
        }
        return JSON.parse(auth) as EncodeResult;
    }

    public user(): Omit<User, 'password'> {
        const encodedResult = this.encodedResult();
        if (!encodedResult) {
            return {} as Omit<User, 'password'>;
        }
        return encodedResult.user;
    }

    public isUserLogged(): boolean {
        const encodedResult = this.encodedResult();
        if (!encodedResult) {
            return false;
        }
        const now = Date.now();
        return (now < encodedResult.expires);
    }


}