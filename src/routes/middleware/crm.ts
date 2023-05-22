import { crm } from "../../libs/crm";
import { logger } from "../../libs/logger";

export async function crmMiddleware(id: string| undefined, event: string,  query: string, body: Record<string, any>) {
    try {
        crm.track(event, {
            distinct_id: id,
            created: (new Date()).toISOString(),
            requestQuery: query ?? "",
            requestBody: body ?? ""
        });

    } catch (error) {
        logger.error(`CRM error, method was executed but most likely wasn't recorded` + error)
    }
}