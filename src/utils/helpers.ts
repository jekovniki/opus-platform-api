import bcrypt from 'bcrypt';
import { v4 } from 'uuid'; 
import { ENVIRONMENT_VARIABLE } from "./constants/errors";
import { USER, USER_BEHAVIOR_ERRORS } from "./constants/user";

export function validateEnvironmentVariable(variable: string | undefined): string {
    if (typeof variable === 'undefined') {
        throw new Error(ENVIRONMENT_VARIABLE);
    }

    return variable;
}

export function validatePasswordLength(password: string): void {
    if (password.length < USER.MIN_PASSWORD_LENGTH) {
        throw USER_BEHAVIOR_ERRORS.PASSWORD_TOO_SHORT;
    }
}

export function hasNumberInString(string: string): boolean {
    return /[0-9]/.test(string);
}

export function hasUppercaseInString(string: string): boolean {
    return /[A-Z]/.test(string);
}

export function hasSpecialSymbolInString(string: string): boolean {
    return /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(string);
}

export function hasOnlyNumbersAndPhoneSymbols(string: string): boolean {
    return /^[0-9+\-]+$/.test(string);
}

export function generateHash(password: string, saltRounds: number): string {
    const salt = bcrypt.genSaltSync(saltRounds);

    return bcrypt.hashSync(password, salt);
}

export async function comparePasswords(password: string, hashedPassword: string): Promise<void> {
    try {
        
        const compare = await bcrypt.compare(password, hashedPassword);

        if (!compare) {
            throw new Error(USER_BEHAVIOR_ERRORS.INVALID_CREDENTIALS);
        }
          
    } catch (error:any) {
        throw new Error(error.message);
    }
    
}

export function generateUUIDv4(): string {
    return v4();
}

export function addHoursToCurrentTime(hour: number): number {
    const currentTime = new Date().getTime();

    return new Date(currentTime + hour * 60 * 60 * 1000).getTime();
}