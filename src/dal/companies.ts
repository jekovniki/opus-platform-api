import { IFullManagementCompanyData } from "../interfaces/services/companies";
import { database } from "../libs/database";
import { ERRORS } from "../utils/constants/status-codes";

const companiesCollection = 'companies';

export async function addCompany(data: IFullManagementCompanyData): Promise<FirebaseFirestore.WriteResult> {
    const query = database.query();
    
    return query.collection(companiesCollection).doc(data.uic).set(data);
}

export async function checkIfCompanyExistsByUic(uic: string): Promise<boolean> {
    const query = database.query();
    const response = query.collection(companiesCollection).where("uic", "==", uic);

    return response.get().then((snapshot: any) => {
        if (snapshot.empty) {
            return false;
        }
        
        return true;
    });
}

export async function checkIfCompanyExistsById(id: string): Promise<boolean> {
    const query = database.query();
    const response = query.collection(companiesCollection).where("id", "==", id);

    return response.get().then((snapshot: any) => {
        if (snapshot.empty) {
            return false;
        }
        
        return true;
    });
}

export async function getCompanyById(id: string): Promise<IFullManagementCompanyData> {
    const query = database.query();
    const response = await query.collection(companiesCollection).where("id", "==", id).get();

    if (response.empty) {
        throw ERRORS.NOT_FOUND.MESSAGE;
    }
    const snapshot = response.docs[0];

    return snapshot.data() as IFullManagementCompanyData;
}