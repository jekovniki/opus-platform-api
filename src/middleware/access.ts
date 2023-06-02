import { NextFunction, Request, Response } from 'express';
import { ERRORS } from '../utils/constants/status-codes';
import IdentityToken from '../libs/token';
import { crmMiddleware } from './crm';


export const accessControlMiddleware = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const token = getToken(request);
        const data = IdentityToken.validate(token);
        if ('message' in data) {
            throw ERRORS.UNAUTHORIZED.MESSAGE;
        }
        await crmMiddleware(data.id, request.method + request.path, JSON.stringify(request.query), request.body);
        // if (request.method !== 'GET' && request.body.id !== data.id) {
        //     throw ERRORS.UNAUTHORIZED.MESSAGE;
        // }
        // if (request.method === 'GET' && !request.query.id) {
        //     throw ERRORS.UNAUTHORIZED.MESSAGE;
        // }

        next();
    } catch (error) {
        console.error(error);
        response.status(ERRORS.UNAUTHORIZED.CODE).send({
            success: false,
            message: error && typeof error === 'object' && 'message' in error ? error.message : ERRORS.UNAUTHORIZED.MESSAGE
        })
    }
}

function getToken(request: Request): string {
    const token = request?.cookies?.accessToken ?? request?.headers?.cookie ? request?.headers?.cookie?.replace('accessToken=', '') : null;
    if (!token) {
        throw ERRORS.UNAUTHORIZED.MESSAGE;
    }
    return token;
}