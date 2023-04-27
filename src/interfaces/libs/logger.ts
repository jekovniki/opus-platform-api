export interface ILogger {
    http(message: string): void;
    info(message: string): void;
    warn(message: string): void;
    debug(message: string, payload: null | Record<string, any>): void;
    error(error: unknown): void;
}