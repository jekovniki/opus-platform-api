import { IInternalEmployeeData } from "../interfaces/services/employee";
import { TRegistrationSchema } from "../types/identity";
import { USER, USER_BEHAVIOR_ERRORS} from "../utils/constants/user";
import { generateHash, generateUUIDv4, hasNumberInString, hasSpecialSymbolInString, hasUppercaseInString, validatePasswordLength } from "../utils/helpers";


export class Employee {
    private email: string;
    private password: string;
    private agreedTerms: boolean;
    private firstName: string;
    private lastName: string;
    private job: string;
    private id: string;
    private picture: string;
    private company: string;
    private verifiedEmail: boolean;

    constructor(data: TRegistrationSchema) {
        this.email = this.validateEmail(data.email);
        this.validatePassword(data.password, data.confirmPassword);
        this.password = this.setPassword(data.password);
        this.agreedTerms = this.validateTerms(data.agreedTerms);
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.job = data.job;
        this.id = generateUUIDv4();
        this.picture = data.picture;
        this.verifiedEmail = true;
        this.company = data.company;
    }

    public generate(): IInternalEmployeeData {
        return {
            id: this.id,
            email: this.email,
            password: this.password,
            agreedTerms: this.agreedTerms,
            givenName: this.firstName,
            familyName: this.lastName,
            verifiedEmail: this.verifiedEmail,
            picture: this.picture,
            company: this.company,
            job: this.job,
            createdAt: Date.now(),
            lastLogin: Date.now()
        }
    }

    private validateTerms(agreed: boolean): boolean {
        if (agreed === false) {
            throw USER_BEHAVIOR_ERRORS.TERMS_NOT_ACCEPTED;
        }

        return agreed;
    }

    private validateEmail(email: string): string {
        const matchSymbols = email.match(USER.ALLOWED_EMAIL_SYMBOLS);
        const isValidEmail = email.includes(USER.EMAIL_SYMBOL);

        if(matchSymbols === null || !matchSymbols.length) {
            throw USER_BEHAVIOR_ERRORS.INVALID_SYMBOL;
        }

        if(isValidEmail === false) {
            throw USER_BEHAVIOR_ERRORS.NOT_AN_EMAIL;
        }

        return email;
    }

    private validatePassword(password: string, confirmPassword: string): void {
        validatePasswordLength(password);

        if(!hasNumberInString(password) || !hasUppercaseInString(password) || !hasSpecialSymbolInString(password)) {
            throw USER_BEHAVIOR_ERRORS.PASSWORD_TOO_WEAK;
        }

        if(password !== confirmPassword) {
            throw USER_BEHAVIOR_ERRORS.NOT_MATCHING;
        }
    }

    private setPassword(password: string): string {
        return generateHash(password, USER.PASSWORD_SALT_ROUNDS)
    }
}