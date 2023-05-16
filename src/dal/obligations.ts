import { IObligationViolation } from "../interfaces/services/obligations";
import { database } from "../libs/database";
import { ERRORS } from "../utils/constants/status-codes";

const obligationsCollection = 'obligations';

export async function addFundObligation(obligationId: string, fundObligation: IObligationViolation) {
    const query = database.query();
    
    return query.collection(obligationsCollection).doc(obligationId).set(fundObligation);
}

export async function getFundObligations(fundId: string): Promise<IObligationViolation[]> {
    const query = database.query();
    const response = await query.collection(obligationsCollection).where("fundId", "==", fundId).get();
    const result: IObligationViolation[] = [];

    if (response.empty) {
        return [];
    }

    response.forEach(document => {
        result.push(document.data() as any);
    })

    return result;
}

export async function setObligationStatus(fundId: string, status: string) {
    const query = database.query();
    
    return query.collection(obligationsCollection).doc(fundId).update({ status });
}