import { addCRMEvent } from "../libs/crm";
import { logger } from "../libs/logger";

export async function crmMiddleware(id: string| undefined, event: string,  query: string, body: Record<string, any>) {
    try {
        addCRMEvent(event, id, query, body);

    } catch (error) {
        logger.error(`CRM error, method was executed but most likely wasn't recorded` + error)
    }
}