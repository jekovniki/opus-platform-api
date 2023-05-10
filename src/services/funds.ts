import { checkIfFundExistsByUic, setFundInstruments } from "../dal/funds";
import { IBaseResponse } from "../interfaces/base";
import { TFundInstruments, TMutualFund } from "../types/funds";
import { USER_BEHAVIOR_ERRORS } from "../utils/constants/user";
import { handleErrors } from "../utils/errors";
import { generateUUIDv4 } from "../utils/helpers";
import * as DAL from '../dal/funds';
import { SUCCESS_FUND_REGISTRATION } from "../utils/constants/success";
import { checkIfCompanyExistsById } from "../dal/companies";
import { checkIfEmployeeExistsById } from "../dal/employee";
import { IFundInstrumentFailedValidation, IFundInstrumentInput, IMutualFundData } from "../interfaces/services/funds";
import { getMarketInstruments } from "./instruments";


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
        return DAL.getMutualFundById(id);
    } catch (error) {
        return handleErrors(error);
    }
}

export async function getAllMutualFundsPerCompany(companyId: string): Promise<IBaseResponse | IMutualFundData[]> {
    try {
        return DAL.getMutualFundByCompanyId(companyId);
    } catch (error) {
        return handleErrors(error);
    }
}

export async function addInstrumentsToMutualFund(data: TFundInstruments): Promise<IBaseResponse | IFundInstrumentFailedValidation> {
    try {
        const fund = await validateFundAndInstruments(data.fundId, data.instruments);
        if ('fundUic' in fund) {
            await DAL.setFundInstruments(fund.fundUic, data.instruments);

            return {
                success: true,
                message: 'Successfully added instruments to fund'
            }
        }

        return fund;

    } catch (error) {
        return handleErrors(error);
    }
}

async function validateFundAndInstruments(fundId: string, instruments:IFundInstrumentInput[]): Promise<{ success: boolean, fundUic: string} | IFundInstrumentFailedValidation> {
    const fund = await DAL.getMutualFundById(fundId);

    const missingInstruments = [];
    const insufficientAmount = [];

    for (const instrument of instruments) {
        const instrumentFromDatabase = await getMarketInstruments(instrument.code);
        if ('success' in instrumentFromDatabase) {
            missingInstruments.push(instrument.code);
            continue;
        }
        if (!Array.isArray(instrumentFromDatabase) && instrument.amount > Number(instrumentFromDatabase.numberOfSecuritiesIssued)) {
            insufficientAmount.push({
                ...instrument,
                numberOfSecuritiesIssued: instrumentFromDatabase.numberOfSecuritiesIssued
            });
        }
    }

    if (missingInstruments.length || insufficientAmount.length) {
        return {
            success: false,
            missingInstruments,
            insufficientAmount
        }
    }

    return {
        success: true,
        fundUic: fund.uic
    };
}