import { init } from "mixpanel";
import { CRM_TOKEN } from "../utils/configuration";

export const crm = init(CRM_TOKEN);