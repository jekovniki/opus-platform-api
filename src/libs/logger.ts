
import { createLogger, transports, format } from 'winston';
import { ENVIRONMENT } from '../utils/configuration';
import { ILogger } from '../interfaces/libs/logger';

const { combine, timestamp, printf, colorize, errors } = format

const customFormat = combine(
    errors({ stack: true, reason: true }),
    colorize(),
    timestamp({ format: 'DD-MMM-YYYY HH:mm:ss'}),
    printf((info) => {
        let message = `${info.timestamp} | ${info.level} | ${info.message}`;
        message += `${info.stack ? `| Stack: \n ${info.stack}` : ""}`;
        message += `${info.reason ? `\n Reason: \n ${JSON.stringify(info.reason)}` : ""}`;

        return message;
        }
    )
)

const allTransports = [
    new transports.Console({ format: customFormat })
]

class Logger implements ILogger {
    protected loggerService: any;

    constructor() {
        this.loggerService = createLogger({ 
            exitOnError: false,  
            transports: allTransports,
            level: ENVIRONMENT === 'production' ? 'info' : 'debug'
        })
    }

    public http(message: string): void {
        this.loggerService.http(message);
    }

    public info(message: string): void {
        this.loggerService.info(message);
    }

    public debug(error: unknown, payload: Record<string, any> | null = null) {
        this.loggerService.debug(error, payload);
    }

    public warn(message: string): void {
        this.loggerService.warn(message);
    }

    public error(error: unknown): void {
        this.loggerService.error(error);
    }
}

export const logger = new Logger();