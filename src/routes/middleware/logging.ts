import { NextFunction, Request, Response } from "express";
import { logger } from "../../libs/logger";
import { SERVER } from "../../utils/constants/status-codes";

export const loggingMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        logger.http(`HTTP: ${request.httpVersion} | METHOD: ${request.method} | URL: ${request.url}`);

        next();
    } catch (error) {
        response.status(SERVER.ERROR.CODE).send({
            success: false,
            message: SERVER.ERROR.MESSAGE
        })
    }
}