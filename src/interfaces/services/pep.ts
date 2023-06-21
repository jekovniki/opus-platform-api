export interface IPEPDataJSON {
    name: string;
    position: string;
    category: string;
    institution: string;
    year: string
}

export interface IPoliticallyExposedPerson {
    name: string;
    history: {
        year: string;
        position: string;
        category: string;
        institution: string;
    }[];
}