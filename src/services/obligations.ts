import { getMutualFundById } from "../dal/funds";
import { addFundObligation, getFundObligations } from "../dal/obligations";
import { IBaseResponse } from "../interfaces/base";
import { IMutualFundData } from "../interfaces/services/funds";
import { IObligationViolation } from "../interfaces/services/obligations";
import { logger } from "../libs/logger";
import { FUND_INVESTMENT_RULES_BG, OBLIGATION_STATUS, OBLIGATION_TYPES } from "../utils/constants/obligations";
import { USER_BEHAVIOR_ERRORS } from "../utils/constants/user";
import { handleErrors } from "../utils/errors";
import { calculatePercentage, countEndDateByBusinessDays, generateUUIDv4, isObjectEmpty, separateArrayByProperties } from "../utils/helpers";
import { getSectorSharesForInstrument, getTotalSharesForInstrument } from "./instruments";


export async function getAllObligations(employeeId: string, managementCompanyId: string | undefined, fundIds: string[] | undefined): Promise<Record<string, any> | IBaseResponse> {
    try {
        const allObligations = {
            employee: {},
            managementCompany: {},
            allFunds: {}
        }

        allObligations.employee = await getEmployeeObligations(employeeId);
        if (managementCompanyId) {
            allObligations.managementCompany = await getManagementCompanyObligations(managementCompanyId);
        }
        if (fundIds) {
            allObligations.allFunds = await getAllFundObligations(fundIds);
        }

        return allObligations;
    } catch (error) {
        return handleErrors(error);
    }
}

async function getEmployeeObligations(employeeId: string): Promise<Record<string,any>> {
    // TODO: In the MVP version this will be empty.
    // Make sure that this method is utilized in the future;
    // It supposed to be for the cases when tickets are assigned to users. I.e. boss assigns task to employee

    return {};
}

async function getManagementCompanyObligations(managementCompanyId: string): Promise<Record<string,any>> {

    return {};
}

async function getAllFundObligations(fundIds: string[]): Promise<Record<string,any>> {
    const fullFundData = await getFullFundData(fundIds);
    if (!fullFundData.length) {
        throw USER_BEHAVIOR_ERRORS.FUND_NOT_EXISTS;
    }
    const fundObligations: Record<string, any> = {};
    for (const id in fullFundData) {
        const allSavedFundObligations = await getFundObligations(fullFundData[id].id);
        fundObligations[fullFundData[id].uic] = await getFundInvestmentObligations(fullFundData[id], allSavedFundObligations);
    }

    return fundObligations;
}

async function getFundInvestmentObligations(fundData: IMutualFundData, allFundObligation: IObligationViolation[]): Promise<Record<string,any>> {
    const rulesForFundType = FUND_INVESTMENT_RULES_BG[fundData.type];

    const diversificationObligations = allFundObligation?.filter(obligation => obligation.type === OBLIGATION_TYPES.MIN_AMOUNT_OF_DIVERSIFICATION);
    const singleInvestmentPercentageObligations = allFundObligation?.filter(obligation => obligation.type === OBLIGATION_TYPES.MAX_SINGLE_INVESTMENT_PERCENTAGE);
    const sectorInvestmentPercentageObligations = allFundObligation?.filter(obligation => obligation.type === OBLIGATION_TYPES.MAX_SECTOR_INVESTMENT_PERCENTAGE);

    return {
        diversification: await checkDiversificationRules(rulesForFundType.MIN_AMOUNT_OF_DIVERSIFICATION, fundData, diversificationObligations),
        singleInvestmentPercentage: await checkSingleInvestmentPercentage(rulesForFundType.MAX_SINGLE_INVESTMENT_PERCENTAGE, fundData, singleInvestmentPercentageObligations),
        sectorInvestmentPercentage: await checkSectorInvestmentPercentage(rulesForFundType.MAX_SECTOR_INVESTMENT_PERCENTAGE, fundData, sectorInvestmentPercentageObligations)
    };
}

async function checkDiversificationRules(MIN_AMOUNT_OF_DIVERSIFICATION: number, fundData: IMutualFundData, allObligations: IObligationViolation[]): Promise<IObligationViolation> {
    const fundInstruments = fundData?.instruments;
    const diversification: Record<string, any> = {};

    if (typeof fundInstruments !== 'undefined' && MIN_AMOUNT_OF_DIVERSIFICATION > fundInstruments.length) {
        diversification.violation = true;
        diversification.type = OBLIGATION_TYPES.MIN_AMOUNT_OF_DIVERSIFICATION;
        diversification.minAmount = MIN_AMOUNT_OF_DIVERSIFICATION;
        diversification.currentAmount = fundInstruments.length;
        diversification.createdAt = new Date().toISOString().slice(0, 10);
        diversification.noticePeriodExpiration = countEndDateByBusinessDays(Date.now(), 10);
        diversification.instrumentsAsString = JSON.stringify(fundInstruments);
        diversification.status = OBLIGATION_STATUS.PENDING;
        diversification.fundId = fundData.id;
        
        if (isViolationRecorded(allObligations) === false) {
            await addFundObligation(generateUUIDv4(), diversification as IObligationViolation)
        }
    }

    return isObjectEmpty(diversification) ? allObligations[0] : diversification as IObligationViolation;
}

async function checkSingleInvestmentPercentage(MAX_SINGLE_INVESTMENT_PERCENTAGE: number, fundData: IMutualFundData, allObligations: IObligationViolation[]) {
    const fundInstruments = fundData.instruments;
    const fundInstrumentsViolated: IObligationViolation[] = [];
    const latestInstrumentsDataPromise: any[] = [];
    if (typeof fundInstruments === 'undefined') {
        return allObligations;
    }

    for (const instrument of fundInstruments) {
        latestInstrumentsDataPromise.push(getTotalSharesForInstrument(instrument.code, instrument.amount));
    }
    const latestInstrumentsData = await Promise.all(latestInstrumentsDataPromise);
    const total = latestInstrumentsData.reduce((accumulator: number, object: Record<string, any>) => {
        // Error validate this
        return accumulator + object.totalShares;
    }, 0);

    let index = 0;
    for (const instrument in latestInstrumentsData) {
        if ('success' in latestInstrumentsData[instrument]) {
            logger.info(`Couldn't find ${fundInstruments[instrument].code} in the checkSingleInvestmentPercentage`)
        } else {
            const percentage = calculatePercentage(latestInstrumentsData[instrument].totalShares, total);
            const isInstrumentSaved = allObligations.filter(obligation => obligation.status === OBLIGATION_STATUS.PENDING && obligation.type === OBLIGATION_TYPES.MAX_SINGLE_INVESTMENT_PERCENTAGE);
            if (percentage > MAX_SINGLE_INVESTMENT_PERCENTAGE) {
                if (typeof isInstrumentSaved === 'undefined' || !isInstrumentSaved.length) {
                    const newObligation = {
                        violation: true,
                        type: OBLIGATION_TYPES.MAX_SINGLE_INVESTMENT_PERCENTAGE,
                        minAmount: MAX_SINGLE_INVESTMENT_PERCENTAGE,
                        currentAmount: percentage,
                        createdAt: new Date().toISOString().slice(0, 10),
                        noticePeriodExpiration: countEndDateByBusinessDays(Date.now(), 10),
                        instrumentsAsString: JSON.stringify(fundInstruments[instrument]),
                        status: OBLIGATION_STATUS.PENDING,
                        fundId: fundData.id
                    };
                    await addFundObligation(generateUUIDv4(), newObligation);
                    fundInstrumentsViolated.push(newObligation);
                } else {
                    fundInstrumentsViolated.push(isInstrumentSaved[index]);
                    index++;
                }
            }
        }
    }
    return fundInstrumentsViolated;
}

async function checkSectorInvestmentPercentage(MAX_SECTOR_INVESTMENT_PERCENTAGE: number, fundData: IMutualFundData, allObligations: IObligationViolation[]) {
    const fundInstruments = fundData.instruments;
    const fundInstrumentsViolated: IObligationViolation[] = [];
    const latestInstrumentsDataPromise: any[] = [];
    if (typeof fundInstruments === 'undefined') {
        return allObligations;
    }

    for (const instrument of fundInstruments) {
        latestInstrumentsDataPromise.push(getSectorSharesForInstrument(instrument.code, instrument.amount));
    }
    const latestInstrumentsData = await Promise.all(latestInstrumentsDataPromise);

    const total = latestInstrumentsData.reduce((accumulator: number, object: Record<string, any>) => {
        // Error validate this
        return accumulator + object.totalShares;
    }, 0);

    const splittedArray = separateArrayByProperties(latestInstrumentsData, 'sector');
    let index = 0;
    for (const item in splittedArray) {
        if ('success' in splittedArray[item]) {
            logger.info(`Couldn't find ${splittedArray[item].code} in the checkSingleInvestmentPercentage`)
        } else {
            const marketObject = {
                sector: splittedArray[item][0].sector,
                marketTotalShares: 0
            }
            marketObject.marketTotalShares = splittedArray[item].reduce((accumulator: number, object: Record<string, any>) => {
                // Error validate this
                return accumulator + object.totalShares;
            }, 0);
            const isInstrumentSaved = allObligations.filter(obligation => obligation.status === OBLIGATION_STATUS.PENDING && obligation.type === OBLIGATION_TYPES.MAX_SECTOR_INVESTMENT_PERCENTAGE);
            const percentageAmount = calculatePercentage(marketObject.marketTotalShares, total);
            if (percentageAmount > MAX_SECTOR_INVESTMENT_PERCENTAGE) {
                if (typeof isInstrumentSaved === 'undefined' || !isInstrumentSaved.length) {
                    const newObligation = {
                        violation: true,
                        type: OBLIGATION_TYPES.MAX_SECTOR_INVESTMENT_PERCENTAGE,
                        minAmount: MAX_SECTOR_INVESTMENT_PERCENTAGE,
                        currentAmount: percentageAmount,
                        createdAt: new Date().toISOString().slice(0, 10),
                        noticePeriodExpiration: countEndDateByBusinessDays(Date.now(), 10),
                        instrumentsAsString: JSON.stringify(splittedArray[item]),
                        status: OBLIGATION_STATUS.PENDING,
                        fundId: fundData.id
                    };
                    await addFundObligation(generateUUIDv4(), newObligation);
                    fundInstrumentsViolated.push(newObligation);
                } else {
                    fundInstrumentsViolated.push(isInstrumentSaved[index]);
                    index++;
                }
            }
        }
    }

    return fundInstrumentsViolated;

}

function isViolationRecorded(allObligations: IObligationViolation[]): boolean {
    if (!allObligations.length) {
        return false;
    }

    const filteredObligations = allObligations?.filter(obligation => obligation.status === OBLIGATION_STATUS.PENDING);
    if (!filteredObligations || !filteredObligations?.length) {
        return false;
    }

    return true;
}

async function getFullFundData(fundIds: string[]): Promise<IMutualFundData[]> {
    const fundData: Array<Promise<IMutualFundData>> = [];
    for (const id of fundIds) {
        fundData.push(getMutualFundById(id));
    }

    return Promise.all(fundData);
}