import { IFundInstrumentInput, IMutualFundData } from "../interfaces/services/funds";
import { database } from "../libs/database";
import { ERRORS } from "../utils/constants/status-codes";

const fundsCollection = 'funds';

export async function checkIfFundExistsByUic(uic: string): Promise<boolean> {
    const query = database.query();
    const response = query.collection(fundsCollection).where("uic", "==", uic);

    return response.get().then((snapshot: any) => {
        if (snapshot.empty) {
            return false;
        }
        
        return true;
        
    });
}

export async function addMutualFund(data: IMutualFundData): Promise<FirebaseFirestore.WriteResult> {
    const query = database.query();
    
    return query.collection(fundsCollection).doc(data.uic).set(data);
}

export async function getMutualFundById(id: string): Promise<IMutualFundData> {
    const query = database.query();
    const response = await query.collection(fundsCollection).where("id", "==", id).get();
    if (response.empty) {
        throw ERRORS.NOT_FOUND.MESSAGE;
    }
    const snapshot = response.docs[0];

    return snapshot.data() as IMutualFundData;
}

export async function getMutualFundByCompanyId(managementCompanyId: string): Promise<IMutualFundData[]> {
    const query = database.query();
    const response = await query.collection(fundsCollection).where("managementCompanyId", "==", managementCompanyId).get();
    const result: IMutualFundData[] = [];
    if (response.empty) {
        throw ERRORS.NOT_FOUND.MESSAGE;
    }
    response.forEach(document => {
        result.push(document.data() as any);
    })

    return result;
}

export async function setFundInstruments(fundUic: string, instrumentCodes: IFundInstrumentInput[]) {
    const query = database.query();

    return query.collection(fundsCollection).doc(fundUic).update({ instruments: instrumentCodes });
}