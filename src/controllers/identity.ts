import { Request, Response } from "express";
import * as Identity from '../services/identity';
import { SERVER, SUCCESS } from "../utils/constants/status-codes";
import { setEmployeeCookie } from "../services/identity/session";
import { SET_APPLICATION_PATH } from "../utils/configuration";

export async function register(request: Request, response: Response) {
    try {
        const result = await Identity.internalMethods.register(request.body);

        response.status(SUCCESS.CREATED.CODE).send(result);
    } catch (error) {
        response.status(SERVER.ERROR.CODE).send({
            success: false,
            message: SERVER.ERROR.MESSAGE
        })
    }
}

export function redirectToGoogle(_request: Request, response: Response): void {
    try {
        const result = Identity.google.redirectToGoogleAuthentication();

        response.redirect(result);

    } catch (error) {
        response.status(SERVER.ERROR.CODE).send({
            success: false,
            message: SERVER.ERROR.MESSAGE
        });
    }
}

export async function loginWithGoogle(request: Request, response: Response): Promise<void> {
    try {
        const result = await Identity.google.loginWithGoogle(request);

        if ('id' in result) {
            setEmployeeCookie(response, result.id);

            response.redirect(`${SET_APPLICATION_PATH()}/private?company=${result.companyUic}&job=${result.job}&id=${result.id}`);
            return;
        }

        response.send(result);

    } catch (error) {
        response.status(SERVER.ERROR.CODE).send({
            success: false,
            message: SERVER.ERROR.MESSAGE
        });
    }
}

export async function redirectToMicrosoft(_request: Request, response: Response): Promise<void> {
    try {
        const result = await Identity.microsoft.redirectToMicrosoftAuthentication();

        response.redirect(result);

    } catch (error) {
        response.status(SERVER.ERROR.CODE).send({
            success: false,
            message: SERVER.ERROR.MESSAGE
        });
    }
}

export async function loginWithMicrosoft(request: Request, response: Response): Promise<void> {
    try {
        const result = await Identity.microsoft.loginWithMicrosoft(request) as any;

        if ('id' in result) {
            setEmployeeCookie(response, result.id);

            response.redirect(`${SET_APPLICATION_PATH()}/private?company=${result.company}&job=${result.job}&id=${result.id}`);
            return;
        }

        response.send(result);

    } catch (error) {
        response.status(SERVER.ERROR.CODE).send({
            success: false,
            message: SERVER.ERROR.MESSAGE
        });
    }
}

export async function loginInternal(request: Request, response: Response): Promise<void> {
    try {
        const result = await Identity.internalMethods.login(request.body);
        if ('id' in result) {
            setEmployeeCookie(response, result.id);

            response.redirect(`${SET_APPLICATION_PATH()}/private?company=${result.companyUic}&job=${result.job}&id=${result.id}`);
            return;
        }

        response.send(result);

    } catch (error) {
        response.status(SERVER.ERROR.CODE).send({
            success: false,
            message: SERVER.ERROR.MESSAGE
        })
    }
}