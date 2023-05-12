import { logger } from "./libs/logger";
import { server } from "./libs/server";
import { dailyDownloadLatestMarketInstruments } from "./services/bse";
import { UNCAUGHT_EXCEPTION_ERROR, UNHANDLED_REJECTION_ERROR } from "./utils/constants/errors";

(async function() {
    try {
        server.start();
        await dailyDownloadLatestMarketInstruments();
    } catch (error) {
        logger.error(error);
    }
})();

process.on('uncaughtException', (error: Error, origin: string) => {
    logger.error(`${UNCAUGHT_EXCEPTION_ERROR} | Origin: ${origin} | Error: ${JSON.stringify(error)}`);
    // TODO: Put graceful shutdown here
 })

 process.on('unhandledRejection', (reason: Error | any, promise: any) => {
    logger.error(`${UNHANDLED_REJECTION_ERROR} | Reason: ${JSON.stringify(reason)} | Promise: ${JSON.stringify(promise)}`);
 });

 process.on('warning', (warning) => {
    logger.warn(`Name: ${warning.name} |\n Message: ${warning.message} |\n Stack Trace: ${warning.stack}`);
 });