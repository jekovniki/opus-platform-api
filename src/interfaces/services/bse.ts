

export interface IFullMarketInstrumentData{
    code: string;
    isin: string;
    securityType: string;
    numberOfSecuritiesIssued: string,
    nominalValue: string,
    tradingCurrency: string,
    firstTradingDate: string,
    market: string,
    marketMaker: string | undefined;
    volume: string,
    previousClose: string,
    last: string,
    high: string,
    low: string,
    average: string,
    change: string,
    tradingPhase: string,
    lastUpdate: number
}