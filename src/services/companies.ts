import { checkIfCompanyExistsByUic } from "../dal/companies";
import { TManagementCompany } from "../types/companies";
import { USER_BEHAVIOR_ERRORS } from "../utils/constants/user";
import { handleErrors } from "../utils/errors";
import * as DAL from '../dal/companies';
import { SUCCESS_REGISTRATION_COMPANY } from "../utils/constants/success";
import { generateUUIDv4 } from "../utils/helpers";
import { IBaseResponse } from "../interfaces/base";
import { checkIfEmployeeExistsById } from "../dal/employee";


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