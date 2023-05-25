import { IFundInstrumentInput } from "./funds";

export interface IFullManagementCompanyData {
    id: string,
    uic: string,
    employeeId: string,
    name: string,
    type: string,
    website: string,
    phone: string,
    ceo: string,
    createdAt: number,
    instruments?: IFundInstrumentInput[]
}