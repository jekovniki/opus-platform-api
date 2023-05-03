export interface IEmployeeData {
    id: string,
    email: string,
    password?: string,
    verifiedEmail: boolean,
    givenName: string,
    familyName: string;
    picture: string | undefined,
    job: string | undefined,
    company: string | undefined,
    createdAt: number,
    lastLogin: number
}

export interface IInternalEmployeeData extends IEmployeeData {
    password: string,
    agreedTerms: boolean
}