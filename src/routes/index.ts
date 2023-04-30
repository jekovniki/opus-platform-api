import { Express, Request, Response } from "express";
import { logger } from "../libs/logger";
import { PATH } from "../utils/configuration";
import { register, redirectToGoogle, loginWithGoogle, loginInternal, redirectToMicrosoft, loginWithMicrosoft } from "../controllers/identity";
import { loggingMiddleware } from "./middleware/logging";
import { validationMiddleware } from "./middleware/validation";
import { loginSchema, registrationSchema } from "../types/identity";
import { accessControlMiddleware } from "./middleware/access";

export function setRoutes(server: Express): void {
    try {
        server.get('/', loggingMiddleware, (_request: Request, response: Response) => {
            response.status(200).send({
                message: 'Welcome to Opus Platform'
            })
        })

        server.post(`${PATH.API.v1.name}/register`, validationMiddleware(registrationSchema), loggingMiddleware, register);

        setIdentityRoutes(server);
        setPrivateRoutes(server);

    } catch (error) {
        logger.error(error);
    }
}

export function setIdentityRoutes(server: Express): void {
    try {
        server.get(`${PATH.API.v1.auth}/google`, loggingMiddleware, redirectToGoogle);
        server.get(`${PATH.API.v1.auth}/google/callback`, loggingMiddleware, loginWithGoogle);

        server.get(`${PATH.API.v1.auth}/microsoft`, loggingMiddleware, redirectToMicrosoft);
        server.get(`${PATH.API.v1.auth}/microsoft/callback`, loggingMiddleware, loginWithMicrosoft);
        
        server.post(`${PATH.API.v1.auth}/internal/login`, validationMiddleware(loginSchema), loggingMiddleware, loginInternal);

    } catch (error) {
        logger.error(error);
    }
}

export function setPrivateRoutes(server: Express):void {
    try {
        server.get(`/private`, loggingMiddleware, accessControlMiddleware, (_request: Request, response: Response) => {
            response.status(200).send({
                message: 'You are signed in successfully'
            });
        })

    } catch (error) {
        logger.error(error);
    }
}