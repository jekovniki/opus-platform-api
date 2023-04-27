import { Express, Request, Response } from "express";
import { logger } from "../libs/logger";

export function setRoutes(server: Express): void {
    try {
        server.get('/', (_request: Request, response: Response) => {
            response.status(200).send({
                message: 'Welcome to Opus Platform'
            })
        })

    } catch (error) {
        logger.error(error);
    }
}