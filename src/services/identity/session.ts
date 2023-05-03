import { Response } from "express";
import IdentityToken from "../../libs/token";
import { addHoursToCurrentTime, generateUUIDv4 } from "../../utils/helpers";
import { ACCESS_TOKEN_LIVE_IN_HOURS } from "../../utils/configuration";

export function setEmployeeCookie(response: Response, employeeId: string): void {
    const accessToken = IdentityToken.generate({ id: employeeId, sessionId: generateUUIDv4() });

    const expirationTime = addHoursToCurrentTime(ACCESS_TOKEN_LIVE_IN_HOURS);

    response.cookie('accessToken', accessToken, {
        sameSite: 'none',
        expires: new Date(expirationTime),
        httpOnly: true,
        secure: true
    })
}