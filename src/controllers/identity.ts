import { Request, Response } from "express";
import * as identity from '../services/identity';
import { SERVER } from "../utils/constants/status-codes";
import { setEmployeeCookie } from "../services/identity/session";

export async function register(request: Request, response: Response) {
    try {
        const result = await identity.internalMethods.register(request.body);

        response.send(result);
    } catch (error) {
        response.status(SERVER.ERROR.CODE).send({
            success: false,
            message: SERVER.ERROR.MESSAGE
        })
    }
}

export function redirectToGoogle(_request: Request, response: Response): void {
    try {
        const result = identity.google.redirectToGoogleAuthentication();

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
        const result = await identity.google.loginWithGoogle(request);

        if ('id' in result) {
            setEmployeeCookie(response, result.id);

            response.redirect(`http://localhost:3001/private?company=${result.company}&job=${result.job}&id=${result.id}`);
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
        const result = await identity.microsoft.redirectToMicrosoftAuthentication();

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
        const result = await identity.microsoft.loginWithMicrosoft(request) as any;

        if ('id' in result) {
            setEmployeeCookie(response, result.id);

            response.redirect(`http://localhost:3001/private?company=${result.company}&job=${result.job}&id=${result.id}`);
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
        const result = await identity.internalMethods.login(request.body);
        if ('id' in result) {
            setEmployeeCookie(response, result.id);

            response.redirect(`http://localhost:3001/private?company=${result.company}&job=${result.job}`);
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