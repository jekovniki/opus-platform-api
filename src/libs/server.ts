import express, { Express } from "express";
import helmet from "helmet";
import bodyParser from "body-parser";
import cors from "cors";

import { IRestServer, IServerConfiguration } from "../interfaces/libs/server";
import { SERVER } from "../utils/configuration";
import { setRoutes } from "../routes";
import { logger } from "./logger";

class Server implements IRestServer {
    private server: Express;
    private port: number;
    private host: string;

    constructor(configuration: IServerConfiguration) {
        this.server = configuration.server;
        this.port = configuration.port;
        this.host = configuration.host;
    }

    public start(): void {
        this.server.listen(this.port, () => {
            logger.info(`Server is listening on: ${this.host}:${this.port}`);
        });
        this.middleware();
        this.setRoutes();
    }

    public getServer(): Express {
        return this.server;
    }

    public getPort(): number {
        return this.port;
    }

    private middleware(): void {
        this.server.use(helmet());
        this.server.use(bodyParser.json());
        this.server.use(cors({
            origin: SERVER.ORIGIN(),
            credentials: true
        }))
    }

    private setRoutes(): void {
        setRoutes(this.server);
    }
}

export const server = new Server({
    port: SERVER.PORT,
    host: SERVER.HOST,
    server: express()
});