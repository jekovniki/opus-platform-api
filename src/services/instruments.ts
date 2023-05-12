import { addMarketInstruments, getAllMarketInstruments, getMarketInstrumentsByCode } from "../dal/instruments";
import { IBaseResponse } from "../interfaces/base";
import { IFullMarketInstrumentData } from "../interfaces/services/bse";
import { cache } from "../libs/cache";
import { MARKET_INSTRUMENTS_CACHE_KEY } from "../utils/configuration";
import { handleErrors } from "../utils/errors";
import { getMarketInstrumentByCode } from "./bse";

export async function getMarketInstruments(code: string | undefined) {
    try {
        if (!code) {
            const instrumentsInCache = await getInstrumentsFromCache();
            if (instrumentsInCache) {
                return instrumentsInCache;
            }

            const allInstruments = await getAllMarketInstruments();
            cache.set(MARKET_INSTRUMENTS_CACHE_KEY, JSON.stringify(allInstruments));
            return allInstruments;
        }

        const instrumentsInCache = await getInstrumentsFromCache(code);
        if (instrumentsInCache) {
            return instrumentsInCache;
        }

        return getMarketInstrumentsByCode(code);
    } catch (error) {
        return handleErrors(error);
    }
}

export async function addMarketInstrumentByCode(code:string): Promise<IBaseResponse> {
    try {
        const instrumentData = await getMarketInstrumentByCode(code);
        cache.remove([MARKET_INSTRUMENTS_CACHE_KEY]);
        await addMarketInstruments(instrumentData);
        return {
            success: true,
            message: 'Successfully added instrument'
        }
    } catch (error) {
        return handleErrors(error);
    }
}

export async function getInstrumentsFromCache(code: string | undefined = undefined): Promise<null | IFullMarketInstrumentData[] | IFullMarketInstrumentData> {
    const getInstrumentsFromCache = await cache.get(MARKET_INSTRUMENTS_CACHE_KEY);
    if (getInstrumentsFromCache && !code) {
        return JSON.parse(getInstrumentsFromCache);
    }
    if (getInstrumentsFromCache && code) {
        const getInstrumentsFromCacheJSON: IFullMarketInstrumentData[] = JSON.parse(getInstrumentsFromCache);
        const instrumentByCode = getInstrumentsFromCacheJSON?.find(item => item.code === code);

        return typeof instrumentByCode !== 'undefined' ? instrumentByCode : null;
    }
    return null;
}

