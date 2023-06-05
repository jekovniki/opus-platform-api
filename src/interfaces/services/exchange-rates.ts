export interface IExchangeRateData {
    name: string,
    code: string,
    perOneAmount: string,
    bgn: string,
    exchangeRate: string
}

export interface IFullNationalExchangeRateData {
    title:  string,
    exchangeRates: Array<IExchangeRateData>
}