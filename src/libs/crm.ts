import { init } from "mixpanel";
import { CRM_TOKEN } from "../utils/configuration";
import { logger } from "./logger";
import { CRM_EVENT_ERROR_MESSAGE, CRM_PERSON_CREATE_ERROR_MESSAGE, CRM_PERSON_UPDATE_ERROR_MESSAGE } from "../utils/constants/errors";
import { IInternalEmployeeData } from "../interfaces/services/employee";

export const crm = init(CRM_TOKEN);

export async function addCRMEvent(event: any, distinct_id: any, requestQuery: any = "", requestBody: any = ""): Promise<void> {
    try {
        crm.track(event, {
            distinct_id,
            created: (new Date()).toISOString(),
            requestQuery,
            requestBody,
        });

    } catch (error) {
        logger.warn(CRM_EVENT_ERROR_MESSAGE);
    }
}

export async function addCRMPerson(user: IInternalEmployeeData, registrationType: string) {
    try {
        crm.people.set(user.id, {
            $name: user.email,
            created: (new Date()).toISOString(),
            registrationType,
            companyUic: user.companyUic,
            name: user.givenName + user.familyName,
            status: user.status,
            job: user.job,
            agreedTerms: user.agreedTerms,
            verifiedEmail: user.verifiedEmail
        });

    } catch (error) {
        logger.warn(CRM_PERSON_CREATE_ERROR_MESSAGE);
    }
}

export async function updateCRMPerson(id: string, updateData: Record<string, any>) {
    try {
        crm.people.set(id, updateData);

    } catch (error) {
        logger.warn(CRM_PERSON_UPDATE_ERROR_MESSAGE);
    }
}