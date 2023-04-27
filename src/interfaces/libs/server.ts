import { Express} from 'express';

export interface IServerConfiguration {
    server: Express;
    port: number;
    host: string;
}

export interface IRestServer {
    start(): void;
    getServer(): Express;
    getPort(): number;
}