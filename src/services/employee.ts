import { handleErrors } from "../utils/errors";
import { isValueInObject } from "../utils/helpers";
import { USER_BEHAVIOR_ERRORS, USER_STATUS } from "../utils/constants/user";
import { SUCCESS_REGISTRATION_COMPANY, SUCCESS_USER_UPDATE } from "../utils/constants/success";
import * as DAL from "../dal/employee";
import { IBaseResponse } from "../interfaces/base";
import { TEmployeeStatus } from "../types/employee";

export async function setEmployeeCompanyAndStatus(data: { email: string, companyUic: string, status: string }): Promise<IBaseResponse> {
    try {
        if (isValueInObject(USER_STATUS, data.status) === false) {
            throw USER_BEHAVIOR_ERRORS.INVALID_STATUS;
        }

        await DAL.setEmployeeCompanyAndStatus(data.email, data.companyUic, data.status);

        return {
            success: true,
            message: SUCCESS_REGISTRATION_COMPANY
        }
    } catch (error) {
        return handleErrors(error);
    }
}

export async function setEmployeeStatus(data: TEmployeeStatus): Promise<IBaseResponse> {
    try {
        if (isValueInObject(USER_STATUS, data.status) === false) {
            throw USER_BEHAVIOR_ERRORS.INVALID_STATUS;
        }

        await DAL.setEmployeeStatus(data.email, data.status);

        return {
            success: true,
            message: SUCCESS_USER_UPDATE
        }
    } catch (error) {
        return handleErrors(error);
    }
}