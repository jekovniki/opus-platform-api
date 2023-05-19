import { setEmployeeCompanyAndStatus, setEmployeeStatus } from "../../src/services/employee";
import * as DALEmployee from "../../src/dal/employee";
import { SUCCESS_REGISTRATION_COMPANY, SUCCESS_USER_UPDATE } from "../../src/utils/constants/success";
import { USER_BEHAVIOR_ERRORS } from "../../src/utils/constants/user";


jest.mock('../../src/dal/employee', () => ({
    setEmployeeCompanyAndStatus: jest.fn(),
    setEmployeeStatus: jest.fn()
}))

describe('setEmployeeCompanyAndStatus', () => {
    const status = { 
        email: 'test@yopmail.com', 
        companyUic: '11231231232132123', 
        status: 'approved'
    }
    const invalidStatus = 'TEST';
    afterEach(() => {
        jest.clearAllMocks();
    })
    test('should return IBaseResponse with success true', async () => {
        (DALEmployee.setEmployeeCompanyAndStatus as jest.Mock).mockImplementationOnce(() => Promise.resolve(true));

        const result = await setEmployeeCompanyAndStatus(status);

        expect(result).toStrictEqual({
            success: true,
            message: SUCCESS_REGISTRATION_COMPANY
        });
        expect(DALEmployee.setEmployeeCompanyAndStatus).toHaveBeenCalledTimes(1);
    });

    test('should return IBaseResponse with success false', async () => {
        const result = await setEmployeeCompanyAndStatus({ ...status, status: invalidStatus });

        expect(result).toStrictEqual({
            success: false,
            message: USER_BEHAVIOR_ERRORS.INVALID_STATUS
        });
        expect(DALEmployee.setEmployeeCompanyAndStatus).not.toHaveBeenCalled;

    });
});

describe('setEmployeeStatus', () => {
    const employeeStatus = {
        email: 'test@test.co.uk',
        status: 'approved'
    }
    const invalidStatus = 'invalid'
    afterEach(() => {
        jest.clearAllMocks();
    })
    test('should return IBaseResponse with success true', async () => {
        const result = await setEmployeeStatus(employeeStatus);

        expect(result).toStrictEqual({
            success: true,
            message: SUCCESS_USER_UPDATE
        })
        expect(DALEmployee.setEmployeeStatus).toHaveBeenCalledTimes(1);
    });
    test('should return IBaseResponse with success false', async () => {
        const result = await setEmployeeStatus({ ...employeeStatus, status: invalidStatus});

        expect(result).toStrictEqual({
            success: false,
            message: USER_BEHAVIOR_ERRORS.INVALID_STATUS
        })
        expect(DALEmployee.setEmployeeStatus).not.toHaveBeenCalled;
    });
});