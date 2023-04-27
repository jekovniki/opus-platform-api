import { logger } from "./libs/logger";
import { server } from "./libs/server";

(async function() {
    try {
        server.start();

    } catch (error) {
        logger.error(error);
    }
})();