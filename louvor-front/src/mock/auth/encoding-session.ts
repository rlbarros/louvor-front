
import { EncodeResult } from "../../models/auth/encode-result.model";
import * as jose from 'jose'

export async function encodeSession(): Promise<EncodeResult> {
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
    const token = await new jose.EncryptJWT({ 'urn:example:claim': true })
        .setProtectedHeader({ alg: 'dir', enc: 'A128CBC-HS256' })
        .setIssuedAt(issued)
        .setIssuer('urn:example:issuer')
        .setAudience('urn:example:audience')
        .setExpirationTime(expires)
        .encrypt(secret)

    return {
        token: token,
        issued: issued,
        expires: expires
    } as EncodeResult;
}