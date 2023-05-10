
import { IFullMarketInstrumentData } from "../interfaces/services/bse";
import { database } from "../libs/database";
import { ERRORS } from "../utils/constants/status-codes";

const marketInstrumentsCollection = 'market_instruments';

export async function addMarketInstruments(data:IFullMarketInstrumentData): Promise<FirebaseFirestore.WriteResult> {
    const query = database.query();

    return query.collection(marketInstrumentsCollection).doc(data.code).set(data);
}

export async function getMarketInstrumentsByCode(code: string): Promise<IFullMarketInstrumentData> {
    const query = database.query();
    const response = await query.collection(marketInstrumentsCollection).doc(code).get();
    if (!response.exists) {
        throw ERRORS.NOT_FOUND.MESSAGE;
    }

    const result = response.data();

    if (typeof result === 'undefined') {
        throw ERRORS.NOT_FOUND.MESSAGE;
    }

    return result as IFullMarketInstrumentData;
}

export async function getAllMarketInstruments(): Promise<IFullMarketInstrumentData[]> {
    const query = database.query();
    const response = await query.collection(marketInstrumentsCollection).get();
    const result: IFullMarketInstrumentData[] = [];
    if (response.empty) {
        throw ERRORS.NOT_FOUND.MESSAGE;
    }

    response.forEach(document => {
        result.push(document.data() as any);
    })

    return result;
}