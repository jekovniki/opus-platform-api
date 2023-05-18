import { IFundInstrumentInput } from "./funds";

export interface IObligationViolation {
    fundId: string,
    violation: boolean,
    minAmount: number,
    currentAmount: number,
    createdAt: string,
    noticePeriodExpiration: string,
    instrumentsAsString: string,
    status: string,
    type: string
}

export interface IInstrumentPercentage extends IFundInstrumentInput {
    percentage: number
    message: string
}