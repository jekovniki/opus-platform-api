import  { addManagementCompany, getManagementCompanyById } from "../../src/services/companies";
import * as DALCompanies from '../../src/dal/companies';
import * as DALEmployees from '../../src/dal/employee';

import { SUCCESS_REGISTRATION_COMPANY } from "../../src/utils/constants/success";
import { USER_BEHAVIOR_ERRORS } from "../../src/utils/constants/user";
import { ERRORS } from "../../src/utils/constants/status-codes";

jest.mock('../../src/dal/companies', () => ({
    addCompany: jest.fn(),
    checkIfCompanyExistsByUic: jest.fn(),
    getCompanyById: jest.fn()
}))

jest.mock('../../src/dal/employee', () => ({
    checkIfEmployeeExistsById: jest.fn()
}))


describe('addManagementCompany', () => {
    const test_management_company = {
        uic: '0000000000',
        employeeId: '33dd185e-5f0d-4a92-b1b9-44d9f0e0585e',
        name: 'Test',
        type: 'Akcionerno drujestvo',
        website: 'sss',
        phone: '2313213312231',
        ceo: 'Goshko Ivanov'
    }
    afterEach(() => {
        jest.clearAllMocks();
    })
    test('should return IBaseResponse with success information', async () => {
        (DALCompanies.addCompany as jest.Mock).mockImplementationOnce(() => Promise.resolve());
        (DALCompanies.checkIfCompanyExistsByUic as jest.Mock).mockImplementationOnce(() => Promise.resolve(false));
        (DALEmployees.checkIfEmployeeExistsById as jest.Mock).mockImplementationOnce(() => Promise.resolve(true));

        const result = await addManagementCompany(test_management_company);

        expect(result).toStrictEqual({
            success: true,
            message: SUCCESS_REGISTRATION_COMPANY
        });
        expect(DALCompanies.addCompany).toHaveBeenCalledTimes(1);
    });
    test('should return IBaseResponse with fail information - COMPANY EXISTS', async () => {
        (DALCompanies.checkIfCompanyExistsByUic as jest.Mock).mockImplementationOnce(() => Promise.resolve(true));

        const result = await addManagementCompany(test_management_company);

        expect(result).toStrictEqual({
            success: false,
            message: USER_BEHAVIOR_ERRORS.COMPANY_EXISTS
        });
        expect(DALCompanies.checkIfCompanyExistsByUic).toHaveBeenCalledTimes(1);
    });
    test('should return IBaseResponse with success false - ADMIN_NOT_EXISTS', async () => {
        (DALEmployees.checkIfEmployeeExistsById as jest.Mock).mockImplementationOnce(() => Promise.resolve(false));

        const result = await addManagementCompany(test_management_company);

        expect(result).toStrictEqual({
            success: false,
            message: USER_BEHAVIOR_ERRORS.ADMIN_NOT_EXISTS
        });
        expect(DALCompanies.checkIfCompanyExistsByUic).toHaveBeenCalledTimes(1);
    });
});

describe('getManagementCompanyById', () => {
    const id = "9fe314fd-c5dc-40fd-bf34-56d665073c1f";
    const missing_id = '1';
    const fullCompanyInformation = {
        createdAt: 1683198733901,
        website: "www.efam.bg",
        phone: "087722222",
        name: "Test Asset Management",
        admin: "manual-user@yopmail.com",
        id,
        type: "Акционерно дружество",
        ceo: "Иван Йорданов",
        uic: "9232455"
    }

    afterEach(() => {
        jest.clearAllMocks();
    })
    test('should return object with full company information', async () => {
        (DALCompanies.getCompanyById as jest.Mock).mockImplementationOnce(() => Promise.resolve(fullCompanyInformation));

        const result = await getManagementCompanyById(id);

        expect(result).toStrictEqual(fullCompanyInformation);
        expect(DALCompanies.getCompanyById).toHaveBeenCalledTimes(1);
    })
    test('should return IBaseResponse with success false', async () => {
        (DALCompanies.getCompanyById as jest.Mock).mockImplementationOnce(() => { throw ERRORS.NOT_FOUND.MESSAGE });

        const result = await getManagementCompanyById(missing_id);

        expect(result).toStrictEqual({ success: false, message: ERRORS.NOT_FOUND.MESSAGE });
        expect(DALCompanies.getCompanyById).toHaveBeenCalledTimes(1);
    })
})