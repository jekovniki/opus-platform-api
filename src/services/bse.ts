import { handleErrors } from "../utils/errors";
import { Builder, By, until } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';
import { IFullMarketInstrumentData } from "../interfaces/services/bse";
import { addMarketInstruments } from "../dal/instruments";
import { logger } from "../libs/logger";
import { MARKET_INSTRUMENTS_CACHE_KEY } from "../utils/configuration";
import { cache } from "../libs/cache";

export async function dailyDownloadLatestMarketInstruments(): Promise<void> {
    try {
        const now = new Date();
        const currentHour = now.getUTCHours() + 3;
        const targetHour = 10;
        const targetMinute = 1;
        const targetTime = new Date (now.getFullYear(), now.getMonth(), now.getDate(), targetHour, targetMinute);
        let delay = targetTime.getTime() - now.getTime();

        if (currentHour >= targetHour && now.getUTCMinutes() >= targetMinute) {
            delay += 24 * 60 * 60 * 1000;
        }

        setTimeout(async () => { await downloadLatestMarketInstruments() }, delay);

    } catch (error) {
        handleErrors(error);
    }
}

export async function getMarketInstrumentByCode(code: string): Promise<IFullMarketInstrumentData> {
    const driver = await new Builder()
        .forBrowser("chrome")
        .setChromeOptions(new Options().headless())
        .build();

        try {
            await driver.get(`https://www.bse-sofia.bg/en/issuer-profile/${code}`);
            const marketInformationProperties = ['code', 'isin', 'securityType', 'numberOfSecuritiesIssued', 'nominalValue', 'tradingCurrency', 'firstTradingDate', 'market', 'marketMaker'];
            const lastTradingSessionProperties = ['code', 'volume', 'previousClose', 'last', 'high', 'low', 'average', 'change', 'tradingPhase']
            const marketInformation = await getInstrumentInformationByTableId('#table_profil_market_info', driver, marketInformationProperties) as any;
            const lastTradingSessionResults = await getInstrumentInformationByTableId('#table_profil_market_session_results', driver, lastTradingSessionProperties) as any;

            return {
                ...marketInformation,
                ...lastTradingSessionResults,
                lastUpdate: Date.now()
            }
        } catch (error) {
            throw handleErrors(error);
        } finally {
            await driver.quit();
        }
}

async function downloadLatestMarketInstruments(): Promise<void> {
    const driver = await new Builder()
        .forBrowser("chrome")
        .setChromeOptions(new Options().headless())
        .build();

    try {
        logger.info('Executing daily market instruments update | START');
        await driver.get("https://www.bse-sofia.bg/bg/listed-instruments");

        const premiumEquitiesSegment = await getInstrumentCodeByTableId('#ListedInstrumentsUnited_TableSession_0', driver);
        const standardEquitiesSegment = await getInstrumentCodeByTableId('#ListedInstrumentsUnited_TableSession_1', driver);
        const specialPurposeVehiclesSegment = await getInstrumentCodeByTableId('#ListedInstrumentsUnited_TableSession_2', driver);
        const bondsSegment = await getInstrumentCodeByTableId('#ListedInstrumentsUnited_TableSession_3', driver);
        const compensatoryInstrumentsSegment = await getInstrumentCodeByTableId('#ListedInstrumentsUnited_TableSession_4', driver);
        const exchangeTradedProductsSegment = await getInstrumentCodeByTableId('#ListedInstrumentsUnited_TableSession_5', driver);
        const subscriptionRightsSegment = await getInstrumentCodeByTableId('#ListedInstrumentsUnited_TableSession_6', driver);
        const privatisationSegment = await getInstrumentCodeByTableId('#ListedInstrumentsUnited_TableSession_7', driver);
        const initialPublicOfferingSegment = await getInstrumentCodeByTableId('#ListedInstrumentsUnited_TableSession_8', driver);
        const governmentSecuritiesSegment = await getInstrumentCodeByTableId('#ListedInstrumentsUnited_TableSession_9', driver);

        const allSegments = [
            ...premiumEquitiesSegment, 
            ...standardEquitiesSegment,
            ...specialPurposeVehiclesSegment,
            ...bondsSegment,
            ...compensatoryInstrumentsSegment,
            ...exchangeTradedProductsSegment,
            ...subscriptionRightsSegment,
            ...privatisationSegment,
            ...initialPublicOfferingSegment,
            ...governmentSecuritiesSegment
        ];
        logger.info(`Executing daily market instruments update | Successful download of BSE codes: \n ${allSegments}`);

        const allMarketInstrumentData = [];
        logger.info(`Executing daily market instruments update | Starting to pull instruments market data`);
        for (const instrumentCode of allSegments) {
            if (instrumentCode === '') {
                continue;
            }
            allMarketInstrumentData.push(await getMarketInstrumentByCodeDaily(instrumentCode, driver));
        }
        logger.info(`Executing daily market instruments update | Successful instrument data pull | Begin merging`);

        await mergeMarketInstrumentsToDatabase(allMarketInstrumentData);

        cache.set(MARKET_INSTRUMENTS_CACHE_KEY, JSON.stringify(allMarketInstrumentData));

        logger.info('Successfully downloaded latest market instruments from BSE');
    } catch (error) {
        logger.error('Could not download latest market instruments from BSE');
        handleErrors(error);
    } finally {
        await driver.quit();
    }
}

export async function getMarketInstrumentByCodeDaily(code: string, driver: any): Promise<IFullMarketInstrumentData> {

        try {
            await driver.get(`https://www.bse-sofia.bg/en/issuer-profile/${code}`);
            const marketInformationProperties = ['code', 'isin', 'securityType', 'numberOfSecuritiesIssued', 'nominalValue', 'tradingCurrency', 'firstTradingDate', 'market', 'marketMaker'];
            const lastTradingSessionProperties = ['code', 'volume', 'previousClose', 'last', 'high', 'low', 'average', 'change', 'tradingPhase']
            const marketInformation = await getInstrumentInformationByTableId('#table_profil_market_info', driver, marketInformationProperties) as any;
            const lastTradingSessionResults = await getInstrumentInformationByTableId('#table_profil_market_session_results', driver, lastTradingSessionProperties) as any;

            return {
                ...marketInformation,
                ...lastTradingSessionResults,
                lastUpdate: Date.now()
            }
        } catch (error) {
            throw handleErrors(error);
        }
}

async function getInstrumentInformationByTableId(id: string, driver: any, objectProperties: string[]): Promise<Record<string, any>> {
    await driver.wait(until.elementLocated(By.css(`${id} tbody tr`)), 10000);

    const tableRows = await driver.findElements(By.css(`${id} tbody tr`));

    const result: any = new Map();

    for (const row in tableRows) {
        const cells = await tableRows[row].findElements(By.css("td"));
        result.set(objectProperties[Number(row)], await cells[1].getText())
    }

    return Object.fromEntries(result);
}

async function getInstrumentCodeByTableId(id: string, driver: any): Promise<string[]> {
    await driver.wait(until.elementLocated(By.css(`${id} tbody tr`)), 10000);

    const tableRows = await driver.findElements(By.css(`${id} tbody tr`));

    const rowData: string[] = [];
    for (const row of tableRows) {
        const cells = await row.findElements(By.css("td"));
        rowData.push(await cells[0].getText());
    }

    return rowData;
}

async function mergeMarketInstrumentsToDatabase(data: IFullMarketInstrumentData[]): Promise<void> {
    const results = [];

    for (const instrument of data) {
        if (instrument.code === '') {
            continue;
        }
        results.push(addMarketInstruments(instrument));
    }

    await Promise.all(results);
}