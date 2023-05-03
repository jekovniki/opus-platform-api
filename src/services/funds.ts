import { checkIfFundExistsByUic } from "../dal/funds";
import { IBaseResponse } from "../interfaces/base";
import { TMutualFund } from "../types/funds";
import { USER_BEHAVIOR_ERRORS } from "../utils/constants/user";
import { handleErrors } from "../utils/errors";
import { generateUUIDv4 } from "../utils/helpers";
import * as DAL from '../dal/funds';
import { SUCCESS_FUND_REGISTRATION } from "../utils/constants/success";
import { checkIfCompanyExistsById } from "../dal/companies";
import { checkIfEmployeeExistsById } from "../dal/employee";
import { IMutualFundData } from "../interfaces/services/funds";


export async function addMutualFund(data: TMutualFund): Promise<IBaseResponse> {
    try {
        const isFundRegistered = await checkIfFundExistsByUic(data.uic);
        if (isFundRegistered === true) {
            throw USER_BEHAVIOR_ERRORS.FUND_EXISTS;
        }

        const isManagementCompanyRegister = await checkIfCompanyExistsById(data.managementCompanyId);
        if (isManagementCompanyRegister === false) {
            throw USER_BEHAVIOR_ERRORS.COMPANY_NOT_EXISTS;
        }

        const isEmployeeExists = await checkIfEmployeeExistsById(data.employeeId);
        if (isEmployeeExists === false) {
            throw USER_BEHAVIOR_ERRORS.USER_NOT_EXISTS;
        }

        await DAL.addMutualFund({
            ...data,
            id: generateUUIDv4(),
            createdAt: Date.now()
        });

        return {
            success:true,
            message: SUCCESS_FUND_REGISTRATION
        }
    } catch (error) {
        return handleErrors(error);
    }
}

export async function getMutualFundById(id: string): Promise<IBaseResponse | IMutualFundData> {
    try {
        return await DAL.getMutualFundById(id);
    } catch (error) {
        return handleErrors(error);
    }
}

export async function getAllMutualFundsPerCompany(companyId: string): Promise<IBaseResponse | IMutualFundData[]> {
    try {
        return await DAL.getMutualFundByCompanyId(companyId);
    } catch (error) {
        return handleErrors(error);
    }
}