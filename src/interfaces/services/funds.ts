export interface IMutualFundData {
    id: string,
    uic: string,
    managementCompanyId: string,
    name: string,
    employeeId: string,
    type: string,
    createdAt: number
    instruments?: IFundInstrumentInput[]
}

export interface IFundInstrumentInput {
    code: string,
    amount: number
}

export interface IFundInstrumentWithAmount extends IFundInstrumentInput {
    numberOfSecuritiesIssued: string
}

export interface IFundInstrumentFailedValidation {
    success: boolean;
    missingInstruments: string[],
    insufficientAmount: IFundInstrumentWithAmount[]
}