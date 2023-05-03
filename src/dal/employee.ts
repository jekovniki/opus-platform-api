import { IEmployeeData } from "../interfaces/services/employee";
import { database } from "../libs/database";
import { USER_BEHAVIOR_ERRORS } from "../utils/constants/user";

const employeeCollection = "employee"

export async function addEmployee(data: IEmployeeData) {
    const query = database.query();
    
    return query.collection(employeeCollection).doc(data.email).set(data);
}

export async function checkIfEmployeeExistsByID(id: string): Promise<boolean> {
    const query = database.query();
    const response = query.collection(employeeCollection).where("id", "==", id);

    return response.get().then((snapshot: any) => {
        if (snapshot.empty) {
            return false;
        }
        
        return true;
        
    });
}

export async function checkIfEmployeeExistsByEmail(email: string): Promise<boolean> {
    const query = database.query();
    const response = query.collection(employeeCollection).where("email", "==", email);

    return response.get().then((snapshot: any) => {
        if (snapshot.empty) {
            return false;
        }
        
        return true;
        
    });
}

export async function getEmployeeByEmail(email: string): Promise<IEmployeeData> {
    const query = database.query();
    const response = query.collection(employeeCollection).doc(email);
    const employee = await response.get();
    if (typeof employee === "undefined") {
        throw USER_BEHAVIOR_ERRORS.INVALID_CREDENTIALS;
    }

    const result = employee.data();
    if (typeof result === "undefined") {
        throw USER_BEHAVIOR_ERRORS.INVALID_CREDENTIALS;
    }

    return result as any;
}

export async function setEmployeeLastLogin(email: string) {
    const query = database.query();
    const response = query.collection(employeeCollection).doc(email);

    return response.update({ lastLogin: Date.now() });
}