import { addMutualFund, getMutualFundById, getAllMutualFundsPerCompany, addInstrumentsToMutualFund } from "../../src/services/funds";
import * as DALFunds from "../../src/dal/funds";
import * as DALCompanies from "../../src/dal/companies";
import * as DALEmployees from "../../src/dal/employee";
import { SUCCESS_FUND_REGISTRATION } from "../../src/utils/constants/success";
import { USER_BEHAVIOR_ERRORS } from "../../src/utils/constants/user";


jest.mock('../../src/dal/funds', () => ({
    checkIfFundExistsByUic: jest.fn(),
    addMutualFund: jest.fn(),
    getMutualFundById: jest.fn(),
    getMutualFundByCompanyId: jest.fn(),
    setFundInstruments: jest.fn()
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
})