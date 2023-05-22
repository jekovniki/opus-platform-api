import { addMutualFund, getMutualFundById, getAllMutualFundsPerCompany, addInstrumentsToMutualFund } from "../../src/services/funds";
import * as DALFunds from "../../src/dal/funds";
import * as DALCompanies from "../../src/dal/companies";
import * as DALEmployees from "../../src/dal/employee";
import { SUCCESS_FUND_REGISTRATION } from "../../src/utils/constants/success";
import { USER_BEHAVIOR_ERRORS } from "../../src/utils/constants/user";
import { ERRORS } from "../../src/utils/constants/status-codes";
import { IFundInstrumentFailedValidation, IMutualFundData } from "../../src/interfaces/services/funds";
import { TFundInstruments } from "../../src/types/funds";


jest.mock('../../src/dal/funds', () => ({
    checkIfFundExistsByUic: jest.fn(),
    addMutualFund: jest.fn(),
    getMutualFundById: jest.fn(),
    getMutualFundByCompanyId: jest.fn(),
    setFundInstruments: jest.fn(),
}))

jest.mock('../../src/dal/companies', () => ({
    checkIfCompanyExistsById: jest.fn()
}))

jest.mock('../../src/dal/employee', () => ({
    checkIfEmployeeExistsById: jest.fn()
}))

describe('addMutualFund', () => {
    const fundData = {
        managementCompanyId: '1',
        employeeId: '1',
        uic: '1',
        type: 'Mutual fund',
        name: 'Test fund'
    }

    afterEach(() => {
        jest.clearAllMocks();
    })

    test('should return IBaseResponse with success true and success message', async () => {
        (DALFunds.checkIfFundExistsByUic as jest.Mock).mockImplementationOnce(() => Promise.resolve(false));
        (DALCompanies.checkIfCompanyExistsById as jest.Mock).mockImplementationOnce(() => Promise.resolve(true));
        (DALEmployees.checkIfEmployeeExistsById as jest.Mock).mockImplementationOnce(() => Promise.resolve(true));
        (DALFunds.addMutualFund as jest.Mock).mockImplementationOnce(() => Promise.resolve(true));

        const result = await addMutualFund(fundData);

        expect(result).toStrictEqual({
            success: true,
            message: SUCCESS_FUND_REGISTRATION
        });
        expect(DALFunds.addMutualFund).toHaveBeenCalledTimes(1);
        expect(DALCompanies.checkIfCompanyExistsById).toHaveBeenCalledTimes(1);
        expect(DALFunds.checkIfFundExistsByUic).toHaveBeenCalledTimes(1);
        expect(DALEmployees.checkIfEmployeeExistsById).toHaveBeenCalledTimes(1);

    });

    test('should return IBaseResponse with success false and message - FUND_EXISTS', async () => {
        (DALFunds.checkIfFundExistsByUic as jest.Mock).mockImplementationOnce(() => Promise.resolve(true));
        (DALFunds.addMutualFund as jest.Mock).mockImplementationOnce(() => Promise.resolve(true));
        (DALCompanies.checkIfCompanyExistsById as jest.Mock).mockImplementationOnce(() => Promise.resolve(true));
        (DALEmployees.checkIfEmployeeExistsById as jest.Mock).mockImplementationOnce(() => Promise.resolve(true));

        const result = await addMutualFund(fundData);

        expect(result).toStrictEqual({
            success: false,
            message: USER_BEHAVIOR_ERRORS.FUND_EXISTS
        });
        expect(DALFunds.checkIfFundExistsByUic).toHaveBeenCalledTimes(1);
        expect(DALFunds.addMutualFund).not.toHaveBeenCalled;
        expect(DALCompanies.checkIfCompanyExistsById).not.toHaveBeenCalled;
        expect(DALEmployees.checkIfEmployeeExistsById).not.toHaveBeenCalled;
    });
});

describe('getMutualFundById', () => {
    const fullFundData: IMutualFundData = {
        managementCompanyId: "9fe314fd-c5dc-40fd-bf34-56d665073c1f",
        createdAt: 1683618902116,
        name: "EF test",
        employeeId: "a3a6f449-623e-43e1-9586-383658b7651c",
        id: "b76f20bd-f944-4037-be8a-94ac4e78185c",
        type: "договорен фонд",
        uic: "9999999939"
    }
    afterEach(() => {
        jest.clearAllMocks();
    })
    test('should return full mutual fund data', async () => {
        (DALFunds.getMutualFundById as jest.Mock).mockImplementationOnce(() => Promise.resolve(fullFundData));

        const result = await getMutualFundById(fullFundData.id);

        expect(result).toStrictEqual(fullFundData);
    });
    test('should return IBaseResponse with failed message', async () => {
        (DALFunds.getMutualFundById as jest.Mock).mockImplementationOnce(() => { throw ERRORS.NOT_FOUND.MESSAGE });

        const result = await getMutualFundById("2");

        expect(result).toStrictEqual({
            success: false,
            message: ERRORS.NOT_FOUND.MESSAGE
        });
    });
});

describe('getAllMutualFundsPerCompany', () => {
    const allFundsPerCompany: IMutualFundData[] = [
        {
            managementCompanyId: "9fe314fd-c5dc-40fd-bf34-56d665073c1f",
            createdAt: 1683618902116,
            name: "EF test",
            employeeId: "a3a6f449-623e-43e1-9586-383658b7651c",
            id: "b76f20bd-f944-4037-be8a-94ac4e78185c",
            type: "договорен фонд",
            uic: "9999999939"
        },
        {
            managementCompanyId: "9fe314fd-c5dc-40fd-bf34-56d665073c1f",
            createdAt: 1683618902116,
            name: "EF test",
            employeeId: "a3a6f449-623e-43e1-9586-383658b7651c",
            id: "b76f20bd-f944-4037-be8a-94ac4e78185c",
            type: "договорен фонд",
            uic: "9999999939"
        }
    ]
    afterEach(() => {
        jest.clearAllMocks();
    })
    test('should return all funds per company', async () => {
        (DALFunds.getMutualFundByCompanyId as jest.Mock).mockImplementationOnce(() => Promise.resolve(allFundsPerCompany));

        const result = await getAllMutualFundsPerCompany(allFundsPerCompany[0].managementCompanyId);

        expect(result).toStrictEqual(allFundsPerCompany);
    });
    test(' should return IBaseResponse with failed message', async () => {
        (DALFunds.getMutualFundByCompanyId as jest.Mock).mockImplementationOnce(() => { throw ERRORS.NOT_FOUND.MESSAGE });

        const result = await getAllMutualFundsPerCompany(allFundsPerCompany[0].managementCompanyId);

        expect(result).toStrictEqual({
            success: false,
            message: ERRORS.NOT_FOUND.MESSAGE
        });
    });
});

describe("addInstrumentsToMutualFund", () => {
    const instrumentsAdding: TFundInstruments = {
        fundId: "5",
        instruments: [{
            code: "A4L",
            amount: 10
        }, {
            code: "ASDKDSA",
            amount: 30
        }, {
            code: "0DC1",
            amount: 90
        }]
    };
    const validateFundAndInstrumentsSuccess: { success: boolean, fundUic: string} = {
        success: true,
        fundUic: '99999222'
    }
    const validateFundAndInstrumentsInsufficientAmount: IFundInstrumentFailedValidation = {
        success: false,
        missingInstruments: ["AGH"],
        insufficientAmount: [{ code: "A4L", amount: 20, numberOfSecuritiesIssued: "20" }]
    }
    afterEach(() => {
        jest.clearAllMocks();
    })
    test('should return IBaseResponse with failed message', async () => {
        (DALFunds.setFundInstruments as jest.Mock).mockImplementationOnce(() => { throw ERRORS.NOT_FOUND.MESSAGE });

        const result = await addInstrumentsToMutualFund(instrumentsAdding);
        
        expect(result).toStrictEqual({
            success: false,
            message: ERRORS.NOT_FOUND.MESSAGE
        })
    });
});