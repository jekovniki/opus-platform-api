import { addEmployee, checkIfEmployeeExistsByEmail, getEmployeeByEmail, setEmployeeLastLogin } from "../../dal/employee";
import { IBaseResponse } from "../../interfaces/base";
import { IEmployeeData } from "../../interfaces/services/employee";
import { TLoginSchema, TRegistrationSchema } from "../../types/identity";
import { SUCCESS_REGISTRATION } from "../../utils/constants/success";
import { USER_BEHAVIOR_ERRORS } from "../../utils/constants/user";
import { handleErrors } from "../../utils/errors";
import { comparePasswords } from "../../utils/helpers";
import { Employee } from "../class/employee";


export async function register(user: TRegistrationSchema): Promise<IBaseResponse> {
    try {
        const isExists = await checkIfEmployeeExistsByEmail(user.email);
        if(isExists === true) {
            return {
                success: false,
                message: USER_BEHAVIOR_ERRORS.USER_EXISTS
            }
        }
        const employee = new Employee(user);

        await addEmployee(employee.generate());
        
        return {
            success: true,
            message: SUCCESS_REGISTRATION
        }
    } catch (error) {
        return handleErrors(error);
    }
}

export async function login(user: TLoginSchema): Promise<IEmployeeData | IBaseResponse> {
    try {
        const employee = await getEmployeeByEmail(user.email);

        if (!employee?.password) {
            return {
                success: false,
                message: USER_BEHAVIOR_ERRORS.SOCIAL_SIGN_IN
            }
        }
        await comparePasswords(user.password, employee.password);
        await setEmployeeLastLogin(employee.email);

        return {
            id: employee.id,
            email: employee.email,
            verifiedEmail: employee.verifiedEmail,
            givenName: employee.givenName,
            familyName: employee.familyName,
            picture: employee.picture,
            job: employee.job,
            status: employee.status,
            companyUic: employee.companyUic,
            createdAt: employee.createdAt,
            lastLogin: Date.now()
          }

    } catch (error) {
        return handleErrors(error);
    }
}

export async function logout() {

}