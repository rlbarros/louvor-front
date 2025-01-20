import { EncodeResult } from "@/models/auth/encode-result.model";
import { User } from "@/models/auth/user.model";
import { Server } from "miragejs";
import { encodeSession } from "./encoding-session";
import { constants } from "@/constants";
import { Login } from "@/models/auth/login.model";

export default function mockAuth(server: Server) {
    const authDomain = constants.domains.auth;
    const authRoute = `${constants.api}/${authDomain.name}`;
    const loginRoute = `${authRoute}/${authDomain.routes.login}`;
    server.post(loginRoute, async (schema, request) => {
        const body = JSON.parse(request.requestBody);
        const email = (body as Login).email;
        const user = schema.db.users.findBy({
            email: email
        });

        let encodeResult = {
            success: false,
            token: '',
            issued: 0,
            expires: 0
        } as EncodeResult;

        if (user) {
            encodeResult = await encodeSession(user);
            const viewableUser = user as Omit<User, 'password'>;
            encodeResult.user = viewableUser;
        }
        return JSON.stringify(encodeResult);
    }, {
        timing: constants.timeouts.mock
    });
}