
import { User } from "@/models/auth/user.model";
import { EncodeResult } from "../../models/auth/encode-result.model";
import * as jose from 'jose'

export async function encodeSession(user: User): Promise<EncodeResult> {
    // Always use HS512 to sign the token
    // Determine when the token should expire
    const issued = Date.now();
    const fifteenMinutesInMs = 15 * 60 * 1000;
    const expires = issued + fifteenMinutesInMs;
    // const session: Session = {
    //     ...partialSession,
    //     issued: issued,
    //     expires: expires
    // };


    const secret = jose.base64url.decode('zH4NRP1HMALxxCFnRZABFA7GOJtzU_gIj02alfL1lvI')
    const token = await new jose.SignJWT(user) // details to  encode in the token
        .setProtectedHeader({
            alg: 'HS256'
        }) // algorithm
        .setIssuedAt()
        .setIssuer("react-louvor") // issuer
        .setAudience("react-louvor") // audience
        .setSubject(user.name)
        .setExpirationTime('15 min') // token expiration time, e.g., "1 day"
        .sign(secret)


    return {
        success: true,
        token: token,
        issued: issued,
        expires: expires
    } as EncodeResult;
}