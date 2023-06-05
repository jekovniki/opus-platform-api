import { handleErrors } from "../utils/errors";
import { Builder, By, until } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';
import { IExchangeRateData, IFullNationalExchangeRateData } from "../interfaces/services/exchange-rates";
import { IBaseResponse } from "../interfaces/base";
import { cache } from "../libs/cache";
import { EXCHANGE_RATE_KEY } from "../utils/configuration";

export async function getExchangeRates(): Promise<IFullNationalExchangeRateData | IBaseResponse> {
    try {
        const cacheKey = EXCHANGE_RATE_KEY + String(new Date().getDate());
        const cacheData = await getExchangeRateFromCache(cacheKey);
        if (!cacheData) {
            /**
             * TODO: Officially BNB updates it rates buy 18:00 at the current day.
             * The cache is set only for one day, so the first request for the new date will fetch the data and it will keep it there.
             * Thing about optimizing it so each request after 18:00 updates the cache
             */
            const latestExchangeRates = await getExchangeRatesFromBNB();
            if ('success' in latestExchangeRates) {
                return latestExchangeRates;
            }
            await cache.remove([EXCHANGE_RATE_KEY + String(new Date().getDate() - 1)]); 
            await cache.remove([EXCHANGE_RATE_KEY + String(new Date().getDate() - 2)]);
            await cache.remove([EXCHANGE_RATE_KEY + String(new Date().getDate() - 3)]);
            await cache.set(cacheKey, JSON.stringify(latestExchangeRates));

            return latestExchangeRates;
        }

        return cacheData;
    } catch (error) {
        return handleErrors(error);
    }
}

async function getExchangeRatesFromBNB(): Promise<IFullNationalExchangeRateData | IBaseResponse> {
    const driver = await new Builder().forBrowser("chrome").setChromeOptions(new Options().headless()).build();

    try {
        await driver.get('https://www.bnb.bg/Statistics/StExternalSector/StExchangeRates/StERForeignCurrencies/index.htm');
        await driver.wait(until.elementLocated(By.css('#Exchange_Rate_Search tbody tr')), 10000);

        const title = await driver.findElement(By.css('#Exchange_Rate_Search h2')).getText();
        const tableRows: any = await driver.findElements(By.css('#Exchange_Rate_Search tbody tr'));
        const exchangeRates: any[] = [];

        for (const row of tableRows) {
            const allTableDescriptions = await row.findElements(By.css("td"));
            if (allTableDescriptions) {
                exchangeRates.push({
                    name: await allTableDescriptions?.[0]?.getText(),
                    code: await allTableDescriptions?.[1]?.getText(),
                    perOneAmount: await allTableDescriptions?.[2]?.getText(),
                    bgn: await allTableDescriptions?.[3]?.getText(),
                    exchangeRate: await allTableDescriptions?.[4]?.getText()
                });
            }
        }
         
        return {
            title,
            exchangeRates
        }
    } catch (error) {
        return handleErrors(error);
    } finally {
        await driver.quit();
    }
}

async function getExchangeRateFromCache(key: string): Promise<IFullNationalExchangeRateData | null> {
    const cacheData = await cache.get(key);

    return cacheData ? JSON.parse(cacheData) : null;
}
