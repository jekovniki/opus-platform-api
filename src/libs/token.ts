import jsonwebtoken from 'jsonwebtoken';
import { handleErrors } from '../utils/errors';
import { IBaseResponse } from '../interfaces/base';
import { addHoursToCurrentTime } from '../utils/helpers';
import { ACCESS_TOKEN_ISSUER, ACCESS_TOKEN_LIVE_IN_HOURS, ACCESS_TOKEN_SECRET } from '../utils/configuration';
import { IdentityTokenPayload, IdentityTokenPayloadSuccess } from '../interfaces/libs/token';

export default class IdentityToken {
    public static generate(identityData: IdentityTokenPayload): string | IBaseResponse {
        try {
            const expiresAt = addHoursToCurrentTime(ACCESS_TOKEN_LIVE_IN_HOURS);

            return jsonwebtoken.sign({
                sub: identityData.id,
                jti: identityData.sessionId,
                iss: ACCESS_TOKEN_ISSUER,
                iat: Date.now(),
                exp: expiresAt
            }, ACCESS_TOKEN_SECRET, { algorithm: "HS256" });
        } catch (error) {
            return handleErrors(error);
        }
    }

    public static validate(token: string): IdentityTokenPayloadSuccess | IBaseResponse {
        try {
            const tokenPayload = jsonwebtoken.verify(token, ACCESS_TOKEN_SECRET, {
                algorithms: ["HS256"],
                issuer: ACCESS_TOKEN_ISSUER,
                ignoreExpiration: false
            }) as jsonwebtoken.JwtPayload;


            return {
                success: true,
                id: tokenPayload.sub,
                sessionId: tokenPayload.jti
            }
        } catch(error) {
            return handleErrors(error)
        }
    }
}