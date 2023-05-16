import { checkIfCompanyExistsByUic } from "../dal/companies";
import { TManagementCompany } from "../types/companies";
import { USER_BEHAVIOR_ERRORS } from "../utils/constants/user";
import { handleErrors } from "../utils/errors";
import * as DAL from '../dal/companies';
import { SUCCESS_REGISTRATION_COMPANY } from "../utils/constants/success";
import { generateUUIDv4, isValueInObject } from "../utils/helpers";
import { IBaseResponse } from "../interfaces/base";
import { checkIfEmployeeExistsById } from "../dal/employee";
import { FUND_TYPES } from "../utils/constants/funds";


export async function addManagementCompany(companyDetails:TManagementCompany): Promise<IBaseResponse> {
    try {
        const isCompanyRegistered = await checkIfCompanyExistsByUic(companyDetails.uic);
        if (isCompanyRegistered === true) {
            throw USER_BEHAVIOR_ERRORS.COMPANY_EXISTS;
        }
        const isAdminExists = await checkIfEmployeeExistsById(companyDetails.employeeId);
        if (isAdminExists === false) {
            throw USER_BEHAVIOR_ERRORS.ADMIN_NOT_EXISTS;
        }
        const isValidType = isValueInObject(FUND_TYPES, companyDetails.type);
        if (isValidType === false) {
            throw USER_BEHAVIOR_ERRORS.INVALID_FUND_TYPE;
        }

        await DAL.addCompany({
            ...companyDetails,
            id: generateUUIDv4(),
            createdAt: Date.now()
        });

        return {
            success: true,
            message: SUCCESS_REGISTRATION_COMPANY
        }
        
    } catch (error) {
        return handleErrors(error);
    }
}

export async function getManagementCompanyById(id: string) {
    try {
        return DAL.getCompanyById(id);
    } catch(error) {
        return handleErrors(error);
    }
}