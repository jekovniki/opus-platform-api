import { addMarketInstruments, getAllMarketInstruments, getMarketInstrumentsByCode } from "../dal/instruments";
import { IBaseResponse } from "../interfaces/base";
import { IFullMarketInstrumentData } from "../interfaces/services/bse";
import { cache } from "../libs/cache";
import { MARKET_INSTRUMENTS_CACHE_KEY } from "../utils/configuration";
import { ERRORS } from "../utils/constants/status-codes";
import { handleErrors } from "../utils/errors";
import { getMarketInstrumentByCode } from "./bse";

export async function getMarketInstruments(code: string | undefined): Promise<IFullMarketInstrumentData | IFullMarketInstrumentData[] | IBaseResponse> {
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

export async function getTotalSharesForInstrument(code: string, amount: number): Promise<{code: string, totalShares: number, amount: number} | IBaseResponse> {
    try {
        const instruments = await getMarketInstruments(undefined);
        if ('success' in instruments && 'message' in instruments) {
            throw ERRORS.NOT_FOUND.MESSAGE;
        }
        if (!Array.isArray(instruments)) {
            throw 'getMarketInstruments returned different from array and it should return array - getTotalSharesForInstruments'
        }

        const instrumentData = instruments.find(instrument => instrument.code === code);

        if (typeof instrumentData === 'undefined') {
            throw 'Could not find instrument in getMarketInstruments'
        }

        return {
            code,
            totalShares: Number(instrumentData.last) * amount,
            amount
        }

    } catch (error) {
        return handleErrors(error);
    }
}

export async function getSectorSharesForInstrument(code: string, amount: number): Promise<{code: string, totalShares: number, sector: string, subSector: string, amount: number} | IBaseResponse> {
    try {
        const instruments = await getMarketInstruments(undefined);
        if ('success' in instruments && 'message' in instruments) {
            throw ERRORS.NOT_FOUND.MESSAGE;
        }
        if (!Array.isArray(instruments)) {
            throw 'getMarketInstruments returned different from array and it should return array - getTotalSharesForInstruments'
        }

        const instrumentData = instruments.find(instrument => instrument.code === code);
        if (typeof instrumentData === 'undefined') {
            throw 'Could not find instrument in getMarketInstruments'
        }

        return {
            code,
            totalShares: Number(instrumentData.last) * amount,
            sector: instrumentData?.sector,
            subSector: instrumentData?.subSector,
            amount
        }

    } catch (error) {
        return handleErrors(error);
    }
}